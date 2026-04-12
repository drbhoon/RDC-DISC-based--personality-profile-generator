const S = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f8fc' },
  card:  { textAlign: 'center' },
  code:  { fontSize: 72, fontWeight: 800, color: '#1F3864', margin: '0 0 8px' },
  msg:   { fontSize: 18, color: '#666', margin: 0 },
};

export default function NotFound() {
  return (
    <div style={S.page}>
      <div style={S.card}>
        <p style={S.code}>404</p>
        <p style={S.msg}>Page not found.</p>
      </div>
    </div>
  );
}
