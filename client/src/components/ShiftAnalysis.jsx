/**
 * ShiftAnalysis.jsx — Shows G1 → G2 shift per dimension (4 boxes).
 * A large negative shift (G1 >> G2) = collapse under pressure.
 */

const DIMS = ['D', 'I', 'S', 'C'];
const DIM_LABELS = { D: 'Dominance', I: 'Influence', S: 'Steadiness', C: 'Conscientiousness' };

function shiftColor(delta) {
  if (delta <= -15) return '#c0392b'; // critical collapse
  if (delta <= -8)  return '#e67e22'; // notable drop
  if (delta >= 10)  return '#27ae60'; // activation
  return '#555';
}

function shiftLabel(delta) {
  if (delta <= -15) return '▼ Critical Drop';
  if (delta <= -8)  return '↓ Drops';
  if (delta >= 10)  return '↑ Activates';
  if (delta >= 5)   return '↗ Rises slightly';
  return '→ Stable';
}

export default function ShiftAnalysis({ g1, g2 }) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {DIMS.map((d) => {
        const delta = g2[d] - g1[d];
        const color = shiftColor(delta);
        return (
          <div key={d} style={{
            flex: '1 1 160px',
            border: `2px solid ${color}`,
            borderRadius: 10,
            padding: '16px 18px',
            background: '#fff',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1F3864', marginBottom: 4 }}>
              {d} — {DIM_LABELS[d]}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 4 }}>
              {delta > 0 ? `+${delta}` : delta}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>
              G1: <strong>{g1[d]}</strong> → G2: <strong>{g2[d]}</strong>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color, marginTop: 6 }}>
              {shiftLabel(delta)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
