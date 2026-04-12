import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';

const NAVY = '#1a2e4a';
const GOLD = '#c87a2a';

export default function CandidateDone() {
  const { token } = useParams();
  const [name, setName] = useState('');

  useEffect(() => {
    api.get(`/assess/${token}`)
      .then((res) => setName(res.data.candidate_name))
      .catch(() => {});
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef3fa 0%, #f5f8fc 100%)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      {/* Top bar */}
      <div style={{
        background: NAVY, color: '#fff',
        padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>
          RDC People Science Profiler
        </span>
      </div>

      {/* Main card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px',
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          padding: '52px 48px', maxWidth: 520, width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(26,46,74,0.10)',
          border: '1px solid #dde5f0',
        }}>
          {/* Check circle */}
          <div style={{
            width: 72, height: 72,
            background: '#d4edda', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 36,
            border: '3px solid #28a745',
          }}>
            ✓
          </div>

          <h1 style={{
            margin: '0 0 10px',
            fontSize: 26, fontWeight: 900, color: NAVY,
          }}>
            All Done!
          </h1>

          {name && (
            <p style={{ margin: '0 0 6px', fontSize: 16, color: '#555' }}>
              Thank you, <strong style={{ color: NAVY, fontSize: 17 }}>{name}</strong>.
            </p>
          )}

          <p style={{ margin: '0 0 32px', fontSize: 15, color: '#666', lineHeight: 1.7 }}>
            Your responses have been recorded successfully.<br />
            Our team will review your behavioral profile and be in touch.
          </p>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: 24 }}>
            <p style={{
              margin: 0, fontSize: 12, color: '#aaa',
              fontStyle: 'italic',
              letterSpacing: 0.3,
            }}>
              You may close this window.
            </p>
            <p style={{
              margin: '10px 0 0', fontSize: 11,
              color: GOLD, fontWeight: 600, letterSpacing: 0.5,
            }}>
              CONFIDENTIAL — RDC Concrete (India) Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
