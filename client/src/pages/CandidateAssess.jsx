import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { QUESTIONS } from '../constants/questions.js';
import { HINDI_DEFINITIONS } from '../constants/questionsHi.js';
import WordTooltip from '../components/WordTooltip.jsx';

const ROWS_PER_PAGE = 8;
const TOTAL_PAGES   = 3; // 3 × 8 = 24

const S = {
  page:     { minHeight: '100vh', background: '#f5f8fc' },
  header:   { background: '#1F3864', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  hTitle:   { margin: 0, fontSize: 16, fontWeight: 700 },
  langBtn:  { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 },
  welcome:  { maxWidth: 780, margin: '28px auto 0', padding: '0 20px', fontSize: 15, color: '#333' },
  name:     { fontWeight: 700, color: '#1F3864' },
  progress: { maxWidth: 780, margin: '16px auto', padding: '0 20px' },
  bar:      { height: 6, borderRadius: 3, background: '#dce3ee' },
  fill:     { height: '100%', borderRadius: 3, background: '#2E5496', transition: 'width .3s' },
  pLabel:   { fontSize: 12, color: '#888', marginTop: 4 },
  main:     { maxWidth: 780, margin: '0 auto', padding: '16px 20px 40px' },
  table:    { width: '100%', borderCollapse: 'collapse' },
  thead:    { background: '#1F3864' },
  thWord:   { padding: '12px 14px', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'left', width: '50%' },
  thRadio:  { padding: '12px 14px', color: '#fff', fontSize: 12, fontWeight: 700, textAlign: 'center', width: '25%' },
  row:      { borderBottom: '1px solid #e8ecf4' },
  rowAlt:   { borderBottom: '1px solid #e8ecf4', background: '#f9fbfd' },
  tdWord:   { padding: '12px 14px', fontSize: 14, color: '#222' },
  tdRadio:  { padding: '12px', textAlign: 'center' },
  radio:    { width: 18, height: 18, cursor: 'pointer', accentColor: '#2E5496' },
  nav:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 },
  btnPrev:  { background: '#fff', color: '#1F3864', border: '1.5px solid #1F3864', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  btnNext:  { background: '#1F3864', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  btnDis:   { opacity: 0.45, cursor: 'not-allowed' },
  pageInfo: { fontSize: 13, color: '#888' },
  error:    { textAlign: 'center', padding: 60, color: '#c0392b', fontSize: 16 },
  loading:  { textAlign: 'center', padding: 60, color: '#888' },
  colLabel: { display: 'flex', justifyContent: 'space-around', padding: '8px 14px 0', fontSize: 12, fontWeight: 700, color: '#2E5496' },
};

export default function CandidateAssess() {
  const { token }    = useParams();
  const navigate     = useNavigate();
  const [meta, setMeta]         = useState(null);   // { candidate_name, role_assessed }
  const [error, setError]       = useState('');
  const [hindi, setHindi]       = useState(false);
  const [page, setPage]         = useState(0);      // 0, 1, 2
  const [selections, setSelections] = useState(
    // {0: {most: 'D', least: 'I'}, ...}
    Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i, { most: null, least: null }]))
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/assess/${token}`)
      .then((res) => setMeta(res.data))
      .catch((err) => {
        const msg = err.response?.data?.error || 'Assessment not found.';
        if (err.response?.status === 410) {
          setError('This assessment has already been submitted.');
        } else {
          setError(msg);
        }
      });
  }, [token]);

  function getDefinition(word) {
    if (hindi) return HINDI_DEFINITIONS[word] || '';
    // find from questions
    for (const q of QUESTIONS) {
      const w = q.words.find((w) => w.word === word);
      if (w) return w.definition;
    }
    return '';
  }

  function handleSelect(qIndex, type, dim) {
    setSelections((prev) => {
      const cur = { ...prev[qIndex] };
      cur[type] = dim;
      // If most and least are same, clear the other
      if (type === 'most'  && cur.least === dim) cur.least = null;
      if (type === 'least' && cur.most  === dim) cur.most  = null;
      return { ...prev, [qIndex]: cur };
    });
  }

  // Questions for current page
  const pageStart = page * ROWS_PER_PAGE;
  const pageQs    = QUESTIONS.slice(pageStart, pageStart + ROWS_PER_PAGE);

  // Check if current page is complete
  const pageComplete = pageQs.every((q) => {
    const s = selections[q.index];
    return s.most !== null && s.least !== null;
  });

  // Total answered rows
  const answeredCount = QUESTIONS.filter((q) => {
    const s = selections[q.index];
    return s.most !== null && s.least !== null;
  }).length;

  const allComplete = answeredCount === 24;

  async function handleSubmit() {
    setSubmitting(true);
    const responses = QUESTIONS.map((q) => {
      const s = selections[q.index];
      // find dim for the selected word
      const mostWord  = q.words.find((w) => w.dim === s.most);
      const leastWord = q.words.find((w) => w.dim === s.least);
      return {
        question_index: q.index,
        most_dim:  mostWord?.dim  || s.most,
        least_dim: leastWord?.dim || s.least,
      };
    });
    try {
      await api.post(`/assess/${token}/submit`, { responses });
      navigate(`/assess/${token}/done`);
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  }

  if (error) return <div style={S.error}>{error}</div>;
  if (!meta)  return <div style={S.loading}>Loading…</div>;

  return (
    <div style={S.page}>
      <header style={S.header}>
        <p style={S.hTitle}>RDC Behavioral Assessment</p>
        <button style={S.langBtn} onClick={() => setHindi((h) => !h)}>
          {hindi ? 'English' : 'हिंदी'}
        </button>
      </header>

      <div style={S.welcome}>
        Welcome, <span style={S.name}>{meta.candidate_name}</span>. Please complete your behavioral assessment below.
      </div>

      {/* Progress bar */}
      <div style={S.progress}>
        <div style={S.bar}>
          <div style={{ ...S.fill, width: `${(answeredCount / 24) * 100}%` }} />
        </div>
        <p style={S.pLabel}>{answeredCount} of 24 rows completed</p>
      </div>

      <main style={S.main}>
        <table style={S.table}>
          <thead style={S.thead}>
            <tr>
              <th style={S.thWord}>Word</th>
              <th style={S.thRadio}>Most</th>
              <th style={S.thRadio}>Least</th>
            </tr>
          </thead>
          <tbody>
            {pageQs.map((q, ri) => (
              q.words.map((w, wi) => {
                const sel  = selections[q.index];
                const isOdd = ri % 2 !== 0;
                return (
                  <tr key={`${q.index}-${wi}`} style={isOdd ? S.rowAlt : S.row}>
                    <td style={S.tdWord}>
                      <WordTooltip word={w.word} definition={getDefinition(w.word)} />
                    </td>
                    <td style={S.tdRadio}>
                      <input
                        type="radio"
                        style={S.radio}
                        name={`most-${q.index}`}
                        checked={sel.most === w.dim}
                        onChange={() => handleSelect(q.index, 'most', w.dim)}
                        disabled={sel.least === w.dim}
                      />
                    </td>
                    <td style={S.tdRadio}>
                      <input
                        type="radio"
                        style={S.radio}
                        name={`least-${q.index}`}
                        checked={sel.least === w.dim}
                        onChange={() => handleSelect(q.index, 'least', w.dim)}
                        disabled={sel.most === w.dim}
                      />
                    </td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>

        <div style={S.nav}>
          <button
            style={{ ...S.btnPrev, ...(page === 0 ? S.btnDis : {}) }}
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            ← Previous
          </button>

          <span style={S.pageInfo}>Page {page + 1} of {TOTAL_PAGES}</span>

          {page < TOTAL_PAGES - 1 ? (
            <button
              style={{ ...S.btnNext, ...(!pageComplete ? S.btnDis : {}) }}
              onClick={() => setPage((p) => p + 1)}
              disabled={!pageComplete}
            >
              Next →
            </button>
          ) : (
            <button
              style={{ ...S.btnNext, background: '#27ae60', ...(!allComplete || submitting ? S.btnDis : {}) }}
              onClick={handleSubmit}
              disabled={!allComplete || submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
