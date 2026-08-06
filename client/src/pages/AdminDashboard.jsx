import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { BASE, withBase } from '../basePath.js';
import { ROLE_OPTIONS } from '../constants/questions.js';

const S = {
  page:    { minHeight: '100vh', background: '#f0f4f8' },
  header:  { background: '#1F3864', color: '#fff', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  hTitle:  { margin: 0, fontSize: 18, fontWeight: 700 },
  hSub:    { margin: '2px 0 0', fontSize: 12, opacity: 0.75 },
  hBtn:    { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 },
  main:    { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  topBar:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageH:   { margin: 0, fontSize: 22, fontWeight: 700, color: '#1F3864' },
  actions: { display: 'flex', gap: 12 },
  btnPrimary: { background: '#1F3864', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  btnSecondary: { background: '#fff', color: '#1F3864', border: '1.5px solid #1F3864', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  table:   { width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderCollapse: 'collapse', overflow: 'hidden' },
  th:      { padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#fff', background: '#1F3864', borderBottom: '2px solid #162d52' },
  td:      { padding: '12px 16px', fontSize: 14, color: '#333', borderBottom: '1px solid #f0f0f0' },
  badge:   { pending: { background: '#e8ecf0', color: '#555', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
             completed: { background: '#d4edda', color: '#155724', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
             deleted:   { background: '#f8d7da', color: '#721c24', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 } },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, fontSize: 13, fontWeight: 600 },
  modal:   { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  mBox:    { background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' },
  mTitle:  { margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#1F3864' },
  label:   { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  input:   { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  select:  { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  field:   { marginBottom: 16 },
  mActions:{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 },
  linkBox: { background: '#f0f4f8', border: '1px solid #d0d8e8', borderRadius: 8, padding: '12px 16px', marginTop: 16, wordBreak: 'break-all', fontSize: 13 },
  copyBtn: { background: '#2E5496', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12, marginTop: 8 },
  empty:   { textAlign: 'center', padding: '60px 0', color: '#888', fontSize: 15 },
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showCreate, setShowCreate]   = useState(false);
  const [showDelete, setShowDelete]   = useState(null); // assessment to delete
  const [newLink, setNewLink]         = useState('');
  const [form, setForm]               = useState({ candidate_name: '', candidate_email: '', role_assessed: '' });
  const [creating, setCreating]       = useState(false);
  const [copied, setCopied]           = useState('');
  const navigate = useNavigate();

  async function load() {
    try {
      const { data } = await api.get('/admin/assessments');
      setAssessments(data);
    } catch { /* handled by interceptor */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/admin/assessments', form);
      setNewLink(data.assessment_url);
      setForm({ candidate_name: '', candidate_email: '', role_assessed: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Creation failed');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/admin/assessments/${showDelete.id}`);
      setShowDelete(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  }

  function copyLink(url, id) {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  }

  async function handleExport() {
    const token = localStorage.getItem('rdc_admin_token');
    // window.open takes a raw URL — nothing prefixes it for us, unlike the
    // axios client, which is built on withBase('/api').
    window.open(withBase(`/api/admin/export/excel?token=${token}`), '_blank');
  }

  function handleLogout() {
    const wasSso = localStorage.getItem('rdc_admin_token') === 'hr-sso';
    localStorage.removeItem('rdc_admin_token');
    if (wasSso) {
      // Signed in through the HR portal — end the shared session there, or the
      // login page would simply recognise us again and bounce straight back.
      //
      // DELIBERATELY UNPREFIXED: this is the PORTAL's endpoint at the site
      // root, not ours. withBase() here would point at /disc/api/auth/logout,
      // which does not exist.
      window.location.href = '/api/auth/logout';
      return;
    }
    navigate('/admin/login');
  }

  // Includes the mount prefix. On the HR platform the app lives at
  // hr.rdcc.ai/disc, so origin alone builds hr.rdcc.ai/assess/<token> — which
  // hits the portal and 404s. This link is copied out to candidates, so it
  // fails in someone else's browser, not in the console that produced it.
  // The link shown in the "assessment created" modal is built server-side from
  // APP_URL (already .../disc) and was never affected — so the created-link
  // working while the copied one 404s is the signature of exactly this bug.
  const appUrl = window.location.origin + BASE;

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div>
          <p style={S.hTitle}>RDC People Science Platform</p>
          <p style={S.hSub}>Admin Dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.hBtn} onClick={handleExport}>Export Excel</button>
          <button style={S.hBtn} onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <main style={S.main}>
        <div style={S.topBar}>
          <h1 style={S.pageH}>Assessments</h1>
          <div style={S.actions}>
            <button style={S.btnPrimary} onClick={() => { setShowCreate(true); setNewLink(''); }}>
              + New Assessment
            </button>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>Loading…</p>
        ) : assessments.length === 0 ? (
          <div style={S.empty}>No assessments yet. Create one to get started.</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                {['Candidate Name', 'Role Assessed', 'Status', 'Created', 'Completed', 'Link', 'Actions'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id}>
                  <td style={S.td}><strong>{a.candidate_name}</strong></td>
                  <td style={S.td}>{a.role_assessed}</td>
                  <td style={S.td}>
                    <span style={S.badge[a.status] || S.badge.pending}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td style={S.td}>{formatDate(a.created_at)}</td>
                  <td style={S.td}>{formatDate(a.completed_at)}</td>
                  <td style={S.td}>
                    <button
                      style={{ ...S.iconBtn, color: '#2E5496' }}
                      onClick={() => copyLink(`${appUrl}/assess/${a.token}`, a.id)}
                    >
                      {copied === a.id ? '✓ Copied' : '📋 Copy Link'}
                    </button>
                  </td>
                  <td style={S.td}>
                    {a.status === 'completed' && (
                      <button
                        style={{ ...S.iconBtn, color: '#1F3864', marginRight: 8 }}
                        onClick={() => navigate(`/admin/report/${a.id}`)}
                      >
                        View Report
                      </button>
                    )}
                    <button
                      style={{ ...S.iconBtn, color: '#c0392b' }}
                      onClick={() => setShowDelete(a)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Create Assessment Modal */}
      {showCreate && (
        <div style={S.modal} onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}>
          <div style={S.mBox}>
            <h2 style={S.mTitle}>New Assessment</h2>
            {!newLink ? (
              <form onSubmit={handleCreate}>
                <div style={S.field}>
                  <label style={S.label}>Candidate Name *</label>
                  <input style={S.input} required value={form.candidate_name}
                    onChange={(e) => setForm({ ...form, candidate_name: e.target.value })} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Email (optional)</label>
                  <input style={S.input} type="email" value={form.candidate_email}
                    onChange={(e) => setForm({ ...form, candidate_email: e.target.value })} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Role Being Assessed *</label>
                  <select style={S.select} required value={form.role_assessed}
                    onChange={(e) => setForm({ ...form, role_assessed: e.target.value })}>
                    <option value="">Select a role…</option>
                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={S.mActions}>
                  <button type="button" style={S.btnSecondary} onClick={() => setShowCreate(false)}>Cancel</button>
                  <button type="submit" style={S.btnPrimary} disabled={creating}>
                    {creating ? 'Creating…' : 'Create & Get Link'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p style={{ color: '#155724', fontWeight: 600 }}>Assessment created! Share this link:</p>
                <div style={S.linkBox}>{newLink}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button style={S.copyBtn} onClick={() => copyLink(newLink, 'modal')}>
                    {copied === 'modal' ? '✓ Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div style={S.mActions}>
                  <button style={S.btnPrimary} onClick={() => setShowCreate(false)}>Done</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDelete && (
        <div style={S.modal} onClick={(e) => e.target === e.currentTarget && setShowDelete(null)}>
          <div style={S.mBox}>
            <h2 style={{ ...S.mTitle, color: '#c0392b' }}>Delete Assessment</h2>
            <p>Are you sure you want to delete the assessment for <strong>{showDelete.candidate_name}</strong>? This cannot be undone.</p>
            <div style={S.mActions}>
              <button style={S.btnSecondary} onClick={() => setShowDelete(null)}>Cancel</button>
              <button style={{ ...S.btnPrimary, background: '#c0392b' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
