import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';

const S = {
  page:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  card:    { background: '#fff', borderRadius: 12, padding: '48px 40px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' },
  logo:    { textAlign: 'center', marginBottom: 32 },
  title:   { fontSize: 20, fontWeight: 700, color: '#1F3864', margin: '0 0 4px' },
  sub:     { fontSize: 13, color: '#888', margin: 0 },
  label:   { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  input:   { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 15, outline: 'none', transition: 'border .2s' },
  btn:     { width: '100%', padding: '12px', background: '#1F3864', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  error:   { background: '#fff0f0', color: '#c0392b', border: '1px solid #f5c6cb', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  field:   { marginBottom: 20 },
};

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('rdc_admin_token', data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}>
          <p style={S.title}>RDC Concrete (India) Ltd.</p>
          <p style={S.sub}>People Science Platform — Admin</p>
        </div>
        {error && <div style={S.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={S.field}>
            <label style={S.label} htmlFor="username">Username</label>
            <input
              id="username"
              style={S.input}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={S.field}>
            <label style={S.label} htmlFor="password">Password</label>
            <input
              id="password"
              style={S.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={S.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
