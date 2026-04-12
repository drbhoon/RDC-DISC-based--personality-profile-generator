/**
 * RoleFitTable.jsx — Displays AI-generated fit ratings for all 6 RDC roles.
 */

import VerdictBadge from './VerdictBadge.jsx';

const ROLE_DISPLAY = {
  business_head:   'Business Head',
  sales_executive: 'Sales Executive',
  technical_qc:    'Technical / QC',
  operations_plant:'Operations / Plant Incharge',
  accounts_finance:'Accounts / Finance',
  human_resources: 'Human Resources',
};

const RATING_COLORS = {
  'Best Fit':         { bg: '#d4edda', color: '#155724', border: '#28a745' },
  'Good Fit':         { bg: '#cce5ff', color: '#004085', border: '#007bff' },
  'Moderate Fit':     { bg: '#fff3cd', color: '#856404', border: '#ffc107' },
  'Not Recommended':  { bg: '#f8d7da', color: '#721c24', border: '#dc3545' },
};

function RatingBadge({ rating }) {
  const c = RATING_COLORS[rating] || { bg: '#e8ecf0', color: '#555', border: '#aaa' };
  return (
    <span style={{
      display: 'inline-block',
      background: c.bg, color: c.color,
      border: `1.5px solid ${c.border}`,
      borderRadius: 20, padding: '3px 12px',
      fontSize: 12, fontWeight: 700,
    }}>
      {rating}
    </span>
  );
}

export default function RoleFitTable({ roleFit }) {
  if (!roleFit) return null;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Role', 'Rating', 'Rationale'].map((h) => (
            <th key={h} style={{
              textAlign: 'left', padding: '10px 14px',
              background: '#1F3864', color: '#fff', fontSize: 13, fontWeight: 700,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(ROLE_DISPLAY).map(([key, label]) => {
          const fit = roleFit[key];
          if (!fit) return null;
          return (
            <tr key={key} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
                {label}
              </td>
              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                <RatingBadge rating={fit.rating} />
              </td>
              <td style={{ padding: '12px 14px', fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                {fit.rationale}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
