import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import PPAGraph      from '../components/PPAGraph.jsx';
import VerdictBadge  from '../components/VerdictBadge.jsx';
import ShiftAnalysis from '../components/ShiftAnalysis.jsx';
import RoleFitTable  from '../components/RoleFitTable.jsx';
import { BENCHMARKS, getBand } from '../constants/benchmarks.js';

const S = {
  page:    { minHeight: '100vh', background: '#f0f4f8' },
  header:  { background: '#1F3864', color: '#fff', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  hTitle:  { margin: 0, fontSize: 17, fontWeight: 700 },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 },
  pdfBtn:  { background: '#2E5496', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  main:    { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  section: { background: '#fff', borderRadius: 12, padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  sTitle:  { margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: '#1F3864', paddingBottom: 10, borderBottom: '2px solid #e8ecf4' },
  candH:   { margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1F3864' },
  candSub: { margin: 0, color: '#666', fontSize: 14 },
  graphs:  { display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' },
  shaded:  { background: '#f5f8fc', border: '1px solid #e0e8f0', borderRadius: 10, padding: '18px 22px', marginBottom: 16 },
  shadedLabel: { fontSize: 12, fontWeight: 700, color: '#2E5496', textTransform: 'uppercase', marginBottom: 6 },
  devTable:{ width: '100%', borderCollapse: 'collapse' },
  devTh:   { textAlign: 'left', padding: '10px 14px', background: '#1F3864', color: '#fff', fontSize: 13, fontWeight: 700 },
  devTd:   { padding: '10px 14px', fontSize: 14, borderBottom: '1px solid #f0f0f0', verticalAlign: 'top' },
  flags:   { background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '16px 20px', marginBottom: 24 },
  flagTitle:{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#856404' },
  flagItem: { color: '#856404', fontSize: 14, marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 },
  bmTable: { width: '100%', borderCollapse: 'collapse' },
  bmTh:    { textAlign: 'left', padding: '10px 14px', background: '#2E5496', color: '#fff', fontSize: 13 },
  bmTd:    { padding: '10px 14px', fontSize: 14, borderBottom: '1px solid #f0f0f0' },
  inRange: { color: '#155724', fontWeight: 700 },
  outRange:{ color: '#721c24', fontWeight: 700 },
  bestFit: { background: '#d4edda', border: '1px solid #28a745', borderRadius: 10, padding: '18px 22px', textAlign: 'center', marginTop: 16 },
  bestFitLabel: { fontSize: 12, fontWeight: 700, color: '#155724', textTransform: 'uppercase', marginBottom: 4 },
  bestFitRole:  { fontSize: 22, fontWeight: 800, color: '#155724' },
  loading: { textAlign: 'center', padding: 80, color: '#888' },
  error:   { textAlign: 'center', padding: 80, color: '#c0392b' },
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function AiSection({ label, text }) {
  if (!text) return null;
  return (
    <div style={S.shaded}>
      <div style={S.shadedLabel}>{label}</div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#333' }}>{text}</p>
    </div>
  );
}

export default function AdminReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]   = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/assessments/${id}/report`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load report'));
  }, [id]);

  function handlePDF() {
    const token = localStorage.getItem('rdc_admin_token');
    // Attach token as query param so Puppeteer can pick it up via localStorage injection
    window.open(`/api/admin/assessments/${id}/pdf`, '_blank');
  }

  async function handleRegenerate() {
    if (!confirm('Re-generate the AI report using the latest model?')) return;
    try {
      await api.post(`/admin/assessments/${id}/regenerate`);
      alert('Regeneration started. Refresh in ~30 seconds.');
    } catch {
      alert('Failed to trigger regeneration.');
    }
  }

  if (error) return <div style={S.error}>{error}</div>;
  if (!data)  return <div style={S.loading}>Loading report…</div>;

  const { assessment, scores, ai_report } = data;
  const report = ai_report?.report_json || {};
  const role   = assessment.role_assessed;
  const bench  = BENCHMARKS[role];

  // Build benchmark detail rows
  const bmRows = bench
    ? ['D', 'I', 'S', 'C'].map((dim) => ({
        dim,
        score:     scores?.[`g1_${dim.toLowerCase()}`] ?? '—',
        band:      scores ? getBand(scores[`g1_${dim.toLowerCase()}`]) : '—',
        benchmark: `${bench[dim].min}–${bench[dim].max}`,
        fit:       scores && bench[dim]
          ? (scores[`g1_${dim.toLowerCase()}`] >= bench[dim].min && scores[`g1_${dim.toLowerCase()}`] <= bench[dim].max ? 'In Range' : 'Out of Range')
          : '—',
      }))
    : [];

  const g1 = scores ? { D: scores.g1_d, I: scores.g1_i, S: scores.g1_s, C: scores.g1_c } : null;
  const g2 = scores ? { D: scores.g2_d, I: scores.g2_i, S: scores.g2_s, C: scores.g2_c } : null;
  const g3 = scores ? { D: scores.g3_d, I: scores.g3_i, S: scores.g3_s, C: scores.g3_c } : null;

  const criticalFlags = report.critical_flags || [];
  const hasPendingAI  = !ai_report || ai_report.status === 'failed';

  return (
    <div style={S.page} data-pdf-ready>
      <header style={S.header}>
        <button style={S.backBtn} onClick={() => navigate('/admin')}>← Back</button>
        <p style={S.hTitle}>Assessment Report</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {!hasPendingAI && (
            <button style={{ ...S.pdfBtn, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }} onClick={handleRegenerate}>
              Regenerate AI
            </button>
          )}
          <button style={S.pdfBtn} onClick={handlePDF}>Download PDF</button>
        </div>
      </header>

      <main style={S.main}>
        {/* 1. Candidate Header */}
        <div style={S.section}>
          <h1 style={S.candH}>{assessment.candidate_name}</h1>
          <p style={S.candSub}>
            Role Assessed: <strong>{assessment.role_assessed}</strong> &nbsp;|&nbsp;
            Completed: <strong>{formatDate(assessment.completed_at)}</strong>
          </p>
          {scores && (
            <div style={{ marginTop: 16 }}>
              Primary Style: <strong>{scores.primary_style}</strong> &nbsp;|&nbsp;
              Secondary Style: <strong>{scores.secondary_style}</strong>
            </div>
          )}
        </div>

        {/* 2. Verdict */}
        {scores && (
          <div style={{ ...S.section, textAlign: 'center' }}>
            <h2 style={S.sTitle}>Verdict for {role}</h2>
            <VerdictBadge verdict={scores.verdict_assessed_role} large />
          </div>
        )}

        {/* 3. Critical Flags */}
        {criticalFlags.length > 0 && (
          <div style={S.flags}>
            <p style={S.flagTitle}>⚠ Critical Flags</p>
            {criticalFlags.map((f, i) => (
              <div key={i} style={S.flagItem}>
                <span>•</span><span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* 4. PPA Graphs */}
        {g1 && g2 && g3 && (
          <div style={S.section}>
            <h2 style={S.sTitle}>DISC Profile — Three Graphs</h2>
            <div style={S.graphs}>
              <PPAGraph title="Graph I — Work Mask" scores={g1} benchmark={bench} />
              <PPAGraph title="Graph II — Under Pressure" scores={g2} benchmark={bench} />
              <PPAGraph title="Graph III — Self Image" scores={g3} benchmark={bench} />
            </div>
          </div>
        )}

        {/* 5. Shift Analysis */}
        {g1 && g2 && (
          <div style={S.section}>
            <h2 style={S.sTitle}>Under-Pressure Shift (G1 → G2)</h2>
            <ShiftAnalysis g1={g1} g2={g2} />
          </div>
        )}

        {/* 6. Benchmark Match Table */}
        {bmRows.length > 0 && (
          <div style={S.section}>
            <h2 style={S.sTitle}>HJA Benchmark Match — {role}</h2>
            <table style={S.bmTable}>
              <thead>
                <tr>
                  {['Dimension', 'Score', 'Band', 'Benchmark', 'Fit'].map((h) => (
                    <th key={h} style={S.bmTh}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bmRows.map((row) => (
                  <tr key={row.dim}>
                    <td style={S.bmTd}><strong>{row.dim}</strong></td>
                    <td style={S.bmTd}>{row.score}</td>
                    <td style={S.bmTd}>{row.band}</td>
                    <td style={S.bmTd}>{row.benchmark}</td>
                    <td style={S.bmTd}>
                      <span style={row.fit === 'In Range' ? S.inRange : S.outRange}>
                        {row.fit === 'In Range' ? '✓ In Range' : '✗ Out of Range'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. AI Report Narrative */}
        {hasPendingAI ? (
          <div style={{ ...S.section, textAlign: 'center', color: '#888' }}>
            {ai_report?.status === 'failed'
              ? 'AI report generation failed. Click "Regenerate AI" to retry.'
              : 'AI report is being generated. Please refresh in a moment.'}
          </div>
        ) : (
          <>
            <div style={S.section}>
              <h2 style={S.sTitle}>Behavioral Narrative</h2>
              <AiSection label="Natural Style"            text={report.natural_style} />
              <AiSection label="Communication Style"      text={report.communication_style} />
              <AiSection label="Under Pressure Behavior"  text={report.under_pressure_behavior} />
              <AiSection label="Motivators"               text={report.motivators} />
              <AiSection label="Demotivators"             text={report.demotivators} />
              <AiSection label="Blind Spots"              text={report.blind_spots} />
              <AiSection label="Strengths for RDC"        text={report.strengths_for_rdc} />
            </div>

            {/* 8. Role Fit Table */}
            {report.role_fit && (
              <div style={S.section}>
                <h2 style={S.sTitle}>Role Fit — All 6 RDC Roles</h2>
                <RoleFitTable roleFit={report.role_fit} />
                {report.best_fit_role && (
                  <div style={S.bestFit}>
                    <div style={S.bestFitLabel}>Best Fit Role</div>
                    <div style={S.bestFitRole}>{report.best_fit_role}</div>
                  </div>
                )}
              </div>
            )}

            {/* 9-10. Development Actions */}
            {report.development_actions && (
              <div style={S.section}>
                <h2 style={S.sTitle}>Development Actions</h2>
                <table style={S.devTable}>
                  <thead>
                    <tr>
                      {['Area', 'Action', 'Timeline'].map((h) => (
                        <th key={h} style={S.devTh}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.development_actions.map((a, i) => (
                      <tr key={i}>
                        <td style={{ ...S.devTd, fontWeight: 600, width: '20%' }}>{a.area}</td>
                        <td style={S.devTd}>{a.action}</td>
                        <td style={{ ...S.devTd, width: '15%', color: '#2E5496', fontWeight: 600 }}>{a.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 11. Manager Guidance */}
            {report.manager_guidance && (
              <div style={S.section}>
                <h2 style={S.sTitle}>Manager Guidance</h2>
                <div style={S.shaded}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#333' }}>{report.manager_guidance}</p>
                </div>
              </div>
            )}

            {/* 12. Succession Note */}
            {report.succession_note && (
              <div style={S.section}>
                <h2 style={S.sTitle}>Succession Note</h2>
                <div style={S.shaded}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: '#333' }}>{report.succession_note}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bottom PDF button */}
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <button style={{ ...S.pdfBtn, padding: '10px 24px', fontSize: 14 }} onClick={handlePDF}>
            Download PDF
          </button>
        </div>
      </main>
    </div>
  );
}
