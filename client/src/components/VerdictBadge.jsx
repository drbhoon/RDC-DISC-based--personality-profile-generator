const COLORS = {
  'STRONG FIT':       { bg: '#d4edda', color: '#155724', border: '#28a745' },
  'MODERATE FIT':     { bg: '#fff3cd', color: '#856404', border: '#ffc107' },
  'NOT RECOMMENDED':  { bg: '#f8d7da', color: '#721c24', border: '#dc3545' },
  'NOT ASSESSED':     { bg: '#e8ecf0', color: '#555',    border: '#aaa' },
};

export default function VerdictBadge({ verdict, large }) {
  const c = COLORS[verdict] || COLORS['NOT ASSESSED'];
  return (
    <span style={{
      display:      'inline-block',
      background:   c.bg,
      color:        c.color,
      border:       `2px solid ${c.border}`,
      borderRadius: large ? 12 : 20,
      padding:      large ? '14px 32px' : '4px 14px',
      fontSize:     large ? 22 : 13,
      fontWeight:   700,
      letterSpacing: large ? 1 : 0,
    }}>
      {verdict || 'NOT ASSESSED'}
    </span>
  );
}
