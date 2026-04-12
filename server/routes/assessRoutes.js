const express  = require('express');
const pool     = require('../db');
const { computeScores } = require('../scoring');
const { getVerdict }    = require('../verdict');
const { generateAndStoreReport } = require('../aiReport');

const router = express.Router();

// ── GET /api/assess/:token ─────────────────────────────────────────────────
// Validate token. Returns candidate name + role. 410 if already completed.
router.get('/:token', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, candidate_name, role_assessed, status
       FROM assessments WHERE token = $1`,
      [req.params.token]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    const a = rows[0];
    if (a.status === 'completed') {
      return res.status(410).json({ error: 'This assessment has already been submitted.' });
    }
    if (a.status === 'deleted') {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    return res.json({
      candidate_name: a.candidate_name,
      role_assessed:  a.role_assessed,
      status:         a.status,
    });
  } catch (err) {
    console.error('[assess/:token GET]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /api/assess/:token/submit ─────────────────────────────────────────
// Submit all 24 responses. Triggers scoring + AI report async.
// Payload: { responses: [{question_index, most_dim, least_dim}, ...] }
router.post('/:token/submit', async (req, res) => {
  const { responses } = req.body;

  // Basic validation
  if (!Array.isArray(responses) || responses.length !== 24) {
    return res.status(400).json({ error: 'Exactly 24 responses are required' });
  }
  const validDims = new Set(['D', 'I', 'S', 'C']);
  for (const r of responses) {
    if (
      typeof r.question_index !== 'number' ||
      !validDims.has(r.most_dim) ||
      !validDims.has(r.least_dim) ||
      r.most_dim === r.least_dim
    ) {
      return res.status(400).json({ error: 'Invalid response format' });
    }
  }

  // Fetch and validate assessment
  let assessment;
  try {
    const { rows } = await pool.query(
      `SELECT id, candidate_name, role_assessed, status FROM assessments WHERE token = $1`,
      [req.params.token]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Assessment not found' });
    assessment = rows[0];
    if (assessment.status === 'completed') {
      return res.status(410).json({ error: 'This assessment has already been submitted.' });
    }
    if (assessment.status === 'deleted') {
      return res.status(404).json({ error: 'Assessment not found' });
    }
  } catch (err) {
    console.error('[assess/submit] fetch:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Persist responses
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert each response row
    for (const r of responses) {
      await client.query(
        `INSERT INTO responses (assessment_id, question_index, most_dim, least_dim)
         VALUES ($1, $2, $3, $4)`,
        [assessment.id, r.question_index, r.most_dim, r.least_dim]
      );
    }

    // Compute scores
    const scores = computeScores(responses);
    const verdict = getVerdict(scores.g1, scores.g2, assessment.role_assessed);

    // Store results
    await client.query(
      `INSERT INTO results
         (assessment_id, g1_d, g1_i, g1_s, g1_c, g2_d, g2_i, g2_s, g2_c,
          g3_d, g3_i, g3_s, g3_c, primary_style, secondary_style, verdict_assessed_role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (assessment_id) DO UPDATE SET
         g1_d = EXCLUDED.g1_d, g1_i = EXCLUDED.g1_i, g1_s = EXCLUDED.g1_s, g1_c = EXCLUDED.g1_c,
         g2_d = EXCLUDED.g2_d, g2_i = EXCLUDED.g2_i, g2_s = EXCLUDED.g2_s, g2_c = EXCLUDED.g2_c,
         g3_d = EXCLUDED.g3_d, g3_i = EXCLUDED.g3_i, g3_s = EXCLUDED.g3_s, g3_c = EXCLUDED.g3_c,
         primary_style = EXCLUDED.primary_style, secondary_style = EXCLUDED.secondary_style,
         verdict_assessed_role = EXCLUDED.verdict_assessed_role, computed_at = NOW()`,
      [
        assessment.id,
        scores.g1.D, scores.g1.I, scores.g1.S, scores.g1.C,
        scores.g2.D, scores.g2.I, scores.g2.S, scores.g2.C,
        scores.g3.D, scores.g3.I, scores.g3.S, scores.g3.C,
        scores.primary_style, scores.secondary_style, verdict,
      ]
    );

    // Mark assessment completed
    await client.query(
      `UPDATE assessments SET status = 'completed', completed_at = NOW() WHERE id = $1`,
      [assessment.id]
    );

    await client.query('COMMIT');

    // Trigger AI report generation async — does NOT block the response
    const scoreDataForAI = {
      g1: scores.g1, g2: scores.g2, g3: scores.g3,
      primary_style: scores.primary_style,
      secondary_style: scores.secondary_style,
      verdict,
    };
    generateAndStoreReport(assessment.id, scoreDataForAI, {
      candidate_name: assessment.candidate_name,
      role_assessed:  assessment.role_assessed,
    }).catch((err) => console.error('[assess/submit] aiReport async error:', err));

    return res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[assess/submit] transaction:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
