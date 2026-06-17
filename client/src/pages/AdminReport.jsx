import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import PPAGraph      from '../components/PPAGraph.jsx';
import VerdictBadge  from '../components/VerdictBadge.jsx';
import ShiftAnalysis from '../components/ShiftAnalysis.jsx';
import RoleFitTable  from '../components/RoleFitTable.jsx';
import { BENCHMARKS, getBand } from '../constants/benchmarks.js';

/* ── Design tokens ─────────────────────────────────────────────────────── */
const NAVY   = '#1a2e4a';
const NAVY2  = '#2E5496';
const GOLD   = '#c87a2a';
const LIGHT  = '#eef3fa';
const WHITE  = '#ffffff';

/* ── Print + global CSS ────────────────────────────────────────────────── */
const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
  @media print {
    @page { size: A4; margin: 12mm 14mm 14mm 14mm; }
    body  { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
    .no-print  { display: none !important; }
    .page-body { padding: 0 !important; background: #fff !important; }
    .section   { box-shadow: none !important; border: 1px solid #dde3ed !important; margin-bottom: 14px !important; break-inside: avoid; }
    .cover-banner { border-radius: 0 !important; }
  }
  @media screen { }
`;

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Normalise legacy role names stored in DB before the rename
function normaliseRole(role) {
  if (role === 'Sales Executive') return 'Sales';
  return role;
}

/* ── Section heading band ───────────────────────────────────────────────── */
function SectionHead({ n, title }) {
  return (
    <div style={{
      background: NAVY, color: WHITE,
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderRadius: '8px 8px 0 0',
    }}>
      <span style={{
        background: GOLD, color: WHITE,
        borderRadius: 4, padding: '2px 8px',
        fontSize: 12, fontWeight: 800, letterSpacing: 0.3,
      }}>{n}</span>
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2 }}>{title}</span>
    </div>
  );
}

/* ── Card wrapper ───────────────────────────────────────────────────────── */
function Card({ n, title, children, style }) {
  return (
    <div className="section" style={{
      background: WHITE, borderRadius: 8,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      marginBottom: 20, overflow: 'hidden', ...style,
    }}>
      {n && <SectionHead n={n} title={title} />}
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

/* ── Two-column info row ────────────────────────────────────────────────── */
function InfoRow({ label, value, alt }) {
  return (
    <tr style={{ background: alt ? LIGHT : WHITE }}>
      <td style={{ padding: '9px 16px', fontWeight: 700, fontSize: 13.5, color: NAVY, width: '30%', borderBottom: `1px solid #dde3ed` }}>{label}</td>
      <td style={{ padding: '9px 16px', fontSize: 13.5, color: '#333', borderBottom: `1px solid #dde3ed` }}>{value}</td>
    </tr>
  );
}

/* ── AI narrative block ─────────────────────────────────────────────────── */
function NarrativeBlock({ label, text, n }) {
  if (!text) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7,
      }}>
        <span style={{
          background: NAVY2, color: WHITE,
          fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 3,
          letterSpacing: 0.4, textTransform: 'uppercase',
        }}>{n}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: NAVY2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: '#333', paddingLeft: 4 }}>{text}</p>
    </div>
  );
}

/* ── Verdict pill colours ───────────────────────────────────────────────── */
function verdictColors(v) {
  if (!v) return { bg: '#e9ecef', color: '#555', border: '#ccc' };
  if (v.includes('STRONG'))   return { bg: '#d4edda', color: '#155724', border: '#28a745' };
  if (v.includes('MODERATE')) return { bg: '#fff3cd', color: '#856404', border: '#ffc107' };
  return { bg: '#f8d7da', color: '#721c24', border: '#dc3545' };
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminReport() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [data, setData]   = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/assessments/${id}/report`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error || 'Failed to load report'));
  }, [id]);

  function handlePDF() { window.print(); }

  async function handleRegenerate() {
    if (!confirm('Re-generate the AI report using the latest Claude model?')) return;
    try {
      await api.post(`/admin/assessments/${id}/regenerate`);
      alert('Regeneration started. Refresh in ~30 seconds.');
    } catch { alert('Failed to trigger regeneration.'); }
  }

  if (error) return <div style={{ padding: 80, textAlign: 'center', color: '#c0392b' }}>{error}</div>;
  if (!data)  return <div style={{ padding: 80, textAlign: 'center', color: '#888' }}>Loading report…</div>;

  const { assessment, scores, ai_report } = data;
  const report  = ai_report?.report_json || {};
  const role    = normaliseRole(assessment.role_assessed);
  const bench   = BENCHMARKS[role];
  const hasPendingAI = !ai_report || ai_report.status === 'failed';

  const g1 = scores ? { D: scores.g1_d, I: scores.g1_i, S: scores.g1_s, C: scores.g1_c } : null;
  const g2 = scores ? { D: scores.g2_d, I: scores.g2_i, S: scores.g2_s, C: scores.g2_c } : null;
  const g3 = scores ? { D: scores.g3_d, I: scores.g3_i, S: scores.g3_s, C: scores.g3_c } : null;

  const bmRows = bench
    ? ['D', 'I', 'S', 'C'].map((dim) => {
        const score = scores?.[`g1_${dim.toLowerCase()}`] ?? null;
        const inRange = score !== null && score >= bench[dim].min && score <= bench[dim].max;
        return { dim, score: score ?? '—', band: score !== null ? getBand(score) : '—',
                 benchmark: `${bench[dim].min}–${bench[dim].max}`, inRange };
      })
    : [];

  const criticalFlags = report.critical_flags || [];
  const vc = verdictColors(scores?.verdict_assessed_role);

  const sectionNum = (() => { let n = 0; return () => ++n; })();

  return (
    <div style={{ minHeight: '100vh', background: '#eef1f7', fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
      <style>{PRINT_CSS}</style>

      {/* ── Screen nav bar ──────────────────────────────────────────────── */}
      <div className="no-print" style={{
        background: NAVY, color: WHITE, padding: '12px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <button onClick={() => navigate('/admin')} style={{
          background: 'rgba(255,255,255,0.12)', color: WHITE,
          border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
          padding: '6px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>← Dashboard</button>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Assessment Report</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {scores && (
            <button onClick={handleRegenerate} style={{
              background: 'rgba(255,255,255,0.12)', color: WHITE,
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: 6,
              padding: '6px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>Regenerate AI</button>
          )}
          <button onClick={handlePDF} style={{
            background: GOLD, color: WHITE, border: 'none',
            borderRadius: 6, padding: '6px 18px', cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
          }}>Download PDF</button>
        </div>
      </div>

      {/* ── Report body ─────────────────────────────────────────────────── */}
      <div className="page-body" style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px 48px' }}>

        {/* ── Cover Banner ────────────────────────────────────────────── */}
        <div className="cover-banner" style={{
          background: NAVY, color: WHITE,
          borderRadius: 10, padding: '32px 36px', marginBottom: 20,
          textAlign: 'center', boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>
            RDC People Science Platform
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 0.3, lineHeight: 1.2, marginBottom: 6 }}>
            DISC Behavioral Assessment Report
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 14 }}>
            Profiling Instrument · 24 Questions · 3 Graphs · AI Narrative
          </div>
          <div style={{ fontSize: 13, fontStyle: 'italic', color: GOLD, fontWeight: 600 }}>
            CONFIDENTIAL – Head Office Use Only
          </div>
        </div>

        {/* ── 1. Candidate Information ─────────────────────────────────── */}
        <Card n={sectionNum()} title="Candidate Information">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow label="Name"           value={<strong style={{ fontSize: 15 }}>{assessment.candidate_name}</strong>} />
              <InfoRow label="Role Assessed"  value={assessment.role_assessed} alt />
              <InfoRow label="Assessment Date" value={formatDate(assessment.completed_at)} />
              {scores && <>
                <InfoRow label="Primary Style"   value={scores.primary_style}   alt />
                <InfoRow label="Secondary Style" value={scores.secondary_style} />
              </>}
              <InfoRow label="Report Generated" value={formatDate(new Date().toISOString())} alt />
            </tbody>
          </table>
        </Card>

        {/* ── 2. Overall Verdict ──────────────────────────────────────── */}
        {scores && (
          <Card n={sectionNum()} title={`Fit Assessment — ${role}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {/* Big verdict pill */}
              <div style={{
                background: vc.bg, color: vc.color,
                border: `2px solid ${vc.border}`,
                borderRadius: 8, padding: '14px 32px',
                fontSize: 22, fontWeight: 900, letterSpacing: 0.5, whiteSpace: 'nowrap',
              }}>
                {scores.verdict_assessed_role || '—'}
              </div>
              {/* DISC summary scores */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['D', 'I', 'S', 'C'].map((dim) => (
                  <div key={dim} style={{
                    textAlign: 'center', background: LIGHT, borderRadius: 8,
                    padding: '10px 18px', minWidth: 70,
                    border: `1px solid #d0dcef`,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY2, letterSpacing: 0.5, marginBottom: 4 }}>G1 · {dim}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: NAVY }}>{scores[`g1_${dim.toLowerCase()}`]}</div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{getBand(scores[`g1_${dim.toLowerCase()}`])}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical flags inline */}
            {criticalFlags.length > 0 && (
              <div style={{
                marginTop: 16, background: '#fff8e1', border: '1px solid #f5c518',
                borderRadius: 6, padding: '12px 16px',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#7a5800', marginBottom: 6 }}>⚠ Critical Flags</div>
                {criticalFlags.map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#7a5800', marginBottom: 4 }}>• {f}</div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ── 3. DISC Graphs ──────────────────────────────────────────── */}
        {g1 && g2 && g3 && (
          <Card n={sectionNum()} title="DISC Profile — Three Graphs">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <PPAGraph title="Graph I — Work Mask"       scores={g1} benchmark={bench} />
              <PPAGraph title="Graph II — Under Pressure" scores={g2} benchmark={bench} />
              <PPAGraph title="Graph III — Self Image"    scores={g3} benchmark={bench} />
            </div>
          </Card>
        )}

        {/* ── 4. Shift Analysis ───────────────────────────────────────── */}
        {g1 && g2 && (
          <Card n={sectionNum()} title="Behavioural Shift Under Pressure (G1 → G2)">
            <ShiftAnalysis g1={g1} g2={g2} />
          </Card>
        )}

        {/* ── 5. Benchmark Match ──────────────────────────────────────── */}
        {bmRows.length > 0 && (
          <Card n={sectionNum()} title={`HJA Benchmark Comparison — ${role}`}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Dimension', 'Score (G1)', 'Band', 'Ideal Range', 'Status'].map((h) => (
                    <th key={h} style={{
                      background: NAVY2, color: WHITE, padding: '9px 14px',
                      textAlign: 'left', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bmRows.map((row, ri) => (
                  <tr key={row.dim} style={{ background: ri % 2 === 0 ? WHITE : LIGHT }}>
                    <td style={{ padding: '9px 14px', fontWeight: 700, fontSize: 14, color: NAVY, borderBottom: '1px solid #dde3ed' }}>{row.dim}</td>
                    <td style={{ padding: '9px 14px', fontSize: 14, fontWeight: 700, borderBottom: '1px solid #dde3ed' }}>{row.score}</td>
                    <td style={{ padding: '9px 14px', fontSize: 13, color: '#555', borderBottom: '1px solid #dde3ed' }}>{row.band}</td>
                    <td style={{ padding: '9px 14px', fontSize: 13, borderBottom: '1px solid #dde3ed' }}>{row.benchmark}</td>
                    <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 700, borderBottom: '1px solid #dde3ed',
                      color: row.inRange ? '#155724' : '#721c24' }}>
                      {row.inRange ? '✓ In Range' : '✗ Out of Range'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* ── 6–12. AI Narrative ──────────────────────────────────────── */}
        {hasPendingAI ? (
          <Card n={sectionNum()} title="AI Behavioral Report">
            <div style={{ textAlign: 'center', color: '#888', padding: '20px 0', fontSize: 14 }}>
              {ai_report?.status === 'failed'
                ? '⚠ AI report generation failed. Click "Regenerate AI" in the top bar to retry.'
                : '⏳ AI report is being generated. Please refresh in about 30 seconds.'}
            </div>
          </Card>
        ) : (
          <>
            <Card n={sectionNum()} title="Behavioral Narrative">
              <NarrativeBlock n="A" label="Natural Style"           text={report.natural_style} />
              <NarrativeBlock n="B" label="Communication Style"     text={report.communication_style} />
              <NarrativeBlock n="C" label="Under Pressure Behavior" text={report.under_pressure_behavior} />
              <NarrativeBlock n="D" label="Motivators"              text={report.motivators} />
              <NarrativeBlock n="E" label="Demotivators"            text={report.demotivators} />
              <NarrativeBlock n="F" label="Blind Spots"             text={report.blind_spots} />
              <NarrativeBlock n="G" label="Strengths for RDC"       text={report.strengths_for_rdc} />
            </Card>

            {report.role_fit && (
              <Card n={sectionNum()} title="Role Fit — All 6 RDC Role Families">
                <RoleFitTable roleFit={report.role_fit} />
                {report.best_fit_role && (
                  <div style={{
                    marginTop: 16, background: '#d4edda',
                    border: '1.5px solid #28a745', borderRadius: 8,
                    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#155724', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Best Fit Role
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#155724' }}>
                      {report.best_fit_role}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {report.development_actions && (
              <Card n={sectionNum()} title="Development Action Plan">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['#', 'Behavioral Gap', 'Recommended Action', 'Timeline'].map((h) => (
                        <th key={h} style={{
                          background: NAVY, color: WHITE, padding: '9px 14px',
                          textAlign: 'left', fontSize: 12, fontWeight: 700,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.development_actions.map((a, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? WHITE : LIGHT }}>
                        <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 700, color: NAVY2, borderBottom: '1px solid #dde3ed', width: '4%' }}>{i + 1}</td>
                        <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: NAVY, borderBottom: '1px solid #dde3ed', width: '22%' }}>{a.area}</td>
                        <td style={{ padding: '9px 14px', fontSize: 13, color: '#333', borderBottom: '1px solid #dde3ed' }}>{a.action}</td>
                        <td style={{ padding: '9px 14px', fontSize: 12, fontWeight: 700, color: GOLD, borderBottom: '1px solid #dde3ed', width: '13%', whiteSpace: 'nowrap' }}>{a.timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {report.manager_guidance && (
              <Card n={sectionNum()} title="Manager Guidance">
                <div style={{
                  background: LIGHT, borderLeft: `4px solid ${NAVY2}`,
                  borderRadius: '0 8px 8px 0', padding: '14px 18px',
                }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#333' }}>{report.manager_guidance}</p>
                </div>
              </Card>
            )}

            {report.succession_note && (
              <Card n={sectionNum()} title="Succession & Growth Note">
                <div style={{
                  background: '#fff8e1', borderLeft: `4px solid ${GOLD}`,
                  borderRadius: '0 8px 8px 0', padding: '14px 18px',
                }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#333' }}>{report.succession_note}</p>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Footer — shows in print */}
        <div style={{
          marginTop: 24, borderTop: `2px solid ${NAVY}`,
          paddingTop: 12, display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: '#888',
        }}>
          <span>RDC Concrete (India) Ltd. — People Science Platform</span>
          <span style={{ color: GOLD, fontStyle: 'italic', fontWeight: 600 }}>CONFIDENTIAL — Head Office Use Only</span>
          <span>Generated: {formatDate(new Date().toISOString())}</span>
        </div>

        {/* Bottom PDF button (screen only) */}
        <div className="no-print" style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={handlePDF} style={{
            background: GOLD, color: WHITE, border: 'none',
            borderRadius: 8, padding: '11px 36px',
            cursor: 'pointer', fontWeight: 700, fontSize: 14,
            boxShadow: '0 3px 10px rgba(200,122,42,0.35)',
          }}>
            Download PDF (Print → Save as PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
