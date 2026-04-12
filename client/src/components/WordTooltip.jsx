import { useState } from 'react';

const S = {
  wrap:    { display: 'inline-flex', alignItems: 'center', gap: 6 },
  word:    { fontSize: 14, color: '#222', fontWeight: 500 },
  icon:    { display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
             width: 18, height: 18, borderRadius: '50%', background: '#e0e8f5',
             color: '#2E5496', fontSize: 11, fontWeight: 700, cursor: 'pointer',
             flexShrink: 0, userSelect: 'none', border: 'none', padding: 0 },
  tooltip: { position: 'absolute', zIndex: 100, background: '#1F3864', color: '#fff',
             padding: '8px 12px', borderRadius: 8, fontSize: 13, lineHeight: 1.5,
             maxWidth: 280, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
             pointerEvents: 'none', whiteSpace: 'normal', bottom: '100%',
             left: 0, marginBottom: 6 },
  container: { position: 'relative', display: 'inline-flex', alignItems: 'center' },
};

export default function WordTooltip({ word, definition }) {
  const [visible, setVisible] = useState(false);

  return (
    <span style={S.wrap}>
      <span style={S.word}>{word}</span>
      <span style={S.container}>
        <button
          style={S.icon}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          onTouchStart={(e) => { e.stopPropagation(); setVisible((v) => !v); }}
          aria-label={`Definition of ${word}`}
          type="button"
        >
          i
        </button>
        {visible && definition && (
          <span style={S.tooltip}>{definition}</span>
        )}
      </span>
    </span>
  );
}
