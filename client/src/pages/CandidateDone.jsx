import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';

const S = {
  page:   { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f8fc' },
  card:   { background: '#fff', borderRadius: 16, padding: '56px 48px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.09)' },
  icon:   { fontSize: 56, marginBottom: 20 },
  title:  { fontSize: 22, fontWeight: 700, color: '#1F3864', margin: '0 0 12px' },
  body:   { fontSize: 15, color: '#555', lineHeight: 1.7, margin: 0 },
  name:   { fontWeight: 700, color: '#1F3864' },
};

export default function CandidateDone() {
  const { token } = useParams();
  const [name, setName] = useState('');

  useEffect(() => {
    // Fetch candidate name for the personalised message
    api.get(`/assess/${token}`)
      .then((res) => setName(res.data.candidate_name))
      .catch(() => {}); // 410 is expected if already completed — ignore
  }, [token]);

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.icon}>✅</div>
        <h1 style={S.title}>Thank You!</h1>
        <p style={S.body}>
          {name
            ? <>Thank you, <span style={S.name}>{name}</span>. Your response has been recorded.</>
            : 'Your response has been recorded.'
          }
        </p>
      </div>
    </div>
  );
}
