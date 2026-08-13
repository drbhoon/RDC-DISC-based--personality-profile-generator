const express  = require('express');
const crypto   = require('crypto');
const path     = require('path');
const XLSX     = require('xlsx');
const pool     = require('../db');
const { requireAdmin, REQUIRE_SSO } = require('../auth');
const { generateAndStoreReport } = require('../aiReport');
const { resolvePerson } = require('../lib/identity');

const router = express.Router();

// GET /api/admin/me — deliberately BEFORE requireAdmin, since its whole job is
// to tell a not-yet-authenticated client whether the HR platform already knows
// who they are. Returns null on Railway and locally, where the login form is
// still the way in.
router.get('/me', (req, res) => {
  // Only claim an identity when SSO is actually switched on. Reporting the
  // header while REQUIRE_SSO is off would send the client past the login form
  // to a dashboard whose requests then 401, bouncing it straight back.
  const email = REQUIRE_SSO ? (req.headers['x-auth-email'] || null) : null;
  res.json({ email, sso: REQUIRE_SSO });
});

// All other admin routes require a valid JWT, or the platform-verified identity
router.use(requireAdmin);

// ── GET /api/admin/assessments ─────────────────────────────────────────────
// List all non-deleted assessments
router.get('/assessments', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        a.id, a.candidate_name, a.candidate_email, a.role_assessed,
        a.token, a.status, a.created_at, a.completed_at
      FROM assessments a
      WHERE a.status != 'deleted'
      ORDER BY a.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error('[admin/assessments GET]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /api/admin/assessments ───────────────────────────────────────────
// Create a new assessment and return the token URL
router.post('/assessments', async (req, res) => {
  const { candidate_name, candidate_email, role_assessed } = req.body;
  if (!candidate_name || !role_assessed) {
    return res.status(400).json({ error: 'candidate_name and role_assessed are required' });
  }
  // E-mail is now REQUIRED. It used to be "optional, for records only", which
  // is exactly why a DISC profile could never be tied to the person it
  // described. It is the key the whole platform resolves people by.
  const email = String(candidate_email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: 'A candidate e-mail address is required — it is how this profile is linked to the person.',
    });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;

  // DISC is open to non-employees, so an unknown address is not an error — it
  // becomes an external person. A portal that cannot be REACHED is different:
  // the assessment is still created with person_id null and picked up by the
  // backfill, because a portal hiccup must not stop HR issuing a link.
  let personId = null;
  const resolved = await resolvePerson({ email, name: candidate_name });
  if (resolved.ok) {
    personId = resolved.person.person_id;
  } else if (resolved.reason !== 'unconfigured') {
    console.warn(`[admin/assessments POST] identity unresolved (${resolved.reason}) for ${email}`);
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO assessments
         (candidate_name, candidate_email, role_assessed, token, created_by, person_id, captured_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, candidate_name, role_assessed, token, status, created_at, person_id`,
      [candidate_name, email, role_assessed, token, req.admin.sub, personId, email]
    );
    const assessment = rows[0];
    const assessmentUrl = `${appUrl}/assess/${token}`;
    return res.status(201).json({ ...assessment, assessment_url: assessmentUrl });
  } catch (err) {
    console.error('[admin/assessments POST]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /api/admin/assessments/:id ────────────────────────────────────
// Soft-delete (status = 'deleted')
router.delete('/assessments/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      `UPDATE assessments SET status = 'deleted' WHERE id = $1 AND status != 'deleted'`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('[admin/assessments DELETE]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/admin/assessments/:id/report ────────────────────────────────
// Full report: assessment meta + scores + AI report JSON
router.get('/assessments/:id/report', async (req, res) => {
  try {
    const { rows: aRows } = await pool.query(
      `SELECT id, candidate_name, candidate_email, role_assessed, status, created_at, completed_at
       FROM assessments WHERE id = $1 AND status != 'deleted'`,
      [req.params.id]
    );
    if (aRows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    const assessment = aRows[0];

    const { rows: rRows } = await pool.query(
      'SELECT * FROM results WHERE assessment_id = $1',
      [req.params.id]
    );
    const { rows: aiRows } = await pool.query(
      'SELECT report_json, model_used, generated_at, status FROM ai_reports WHERE assessment_id = $1',
      [req.params.id]
    );

    return res.json({
      assessment,
      scores: rRows[0] || null,
      ai_report: aiRows[0] || null,
    });
  } catch (err) {
    console.error('[admin/report GET]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/admin/assessments/:id/pdf ───────────────────────────────────
// PDF is generated client-side via window.print() — this route is unused.
router.get('/assessments/:id/pdf', (req, res) => {
  return res.status(410).json({ error: 'Server-side PDF is disabled. Use the browser Print → Save as PDF option.' });
});

// ── POST /api/admin/assessments/:id/regenerate ───────────────────────────
// Re-call Claude API to regenerate AI report
router.post('/assessments/:id/regenerate', async (req, res) => {
  try {
    const { rows: aRows } = await pool.query(
      `SELECT a.candidate_name, a.role_assessed, r.*
       FROM assessments a
       LEFT JOIN results r ON r.assessment_id = a.id
       WHERE a.id = $1 AND a.status = 'completed'`,
      [req.params.id]
    );
    if (aRows.length === 0) {
      return res.status(404).json({ error: 'Completed assessment not found' });
    }
    const row = aRows[0];
    const scoreData = {
      g1:             { D: row.g1_d, I: row.g1_i, S: row.g1_s, C: row.g1_c },
      g2:             { D: row.g2_d, I: row.g2_i, S: row.g2_s, C: row.g2_c },
      g3:             { D: row.g3_d, I: row.g3_i, S: row.g3_s, C: row.g3_c },
      primary_style:  row.primary_style,
      secondary_style: row.secondary_style,
      verdict:        row.verdict_assessed_role,
    };
    const assessmentMeta = {
      candidate_name: row.candidate_name,
      role_assessed:  row.role_assessed,
    };
    // Run async — respond immediately
    generateAndStoreReport(req.params.id, scoreData, assessmentMeta).catch(console.error);
    return res.json({ success: true, message: 'Regeneration started' });
  } catch (err) {
    console.error('[admin/regenerate POST]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/admin/export/excel ──────────────────────────────────────────
// Export all completed assessments as XLSX
router.get('/export/excel', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        a.candidate_name, a.candidate_email, a.role_assessed, a.status,
        a.created_at, a.completed_at,
        r.g1_d, r.g1_i, r.g1_s, r.g1_c,
        r.g2_d, r.g2_i, r.g2_s, r.g2_c,
        r.g3_d, r.g3_i, r.g3_s, r.g3_c,
        r.primary_style, r.secondary_style, r.verdict_assessed_role
      FROM assessments a
      LEFT JOIN results r ON r.assessment_id = a.id
      WHERE a.status = 'completed'
      ORDER BY a.completed_at DESC
    `);

    const ws = XLSX.utils.json_to_sheet(rows.map((r) => ({
      'Candidate Name':    r.candidate_name,
      'Email':             r.candidate_email || '',
      'Role Assessed':     r.role_assessed,
      'Status':            r.status,
      'Created At':        r.created_at ? new Date(r.created_at).toISOString() : '',
      'Completed At':      r.completed_at ? new Date(r.completed_at).toISOString() : '',
      'G1 D': r.g1_d, 'G1 I': r.g1_i, 'G1 S': r.g1_s, 'G1 C': r.g1_c,
      'G2 D': r.g2_d, 'G2 I': r.g2_i, 'G2 S': r.g2_s, 'G2 C': r.g2_c,
      'G3 D': r.g3_d, 'G3 I': r.g3_i, 'G3 S': r.g3_s, 'G3 C': r.g3_c,
      'Primary Style':     r.primary_style,
      'Secondary Style':   r.secondary_style,
      'Verdict':           r.verdict_assessed_role,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assessments');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="rdc-assessments.xlsx"');
    return res.send(buf);
  } catch (err) {
    console.error('[admin/export/excel]', err);
    return res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
