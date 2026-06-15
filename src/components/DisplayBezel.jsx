// src/components/DisplayBezel.jsx
// Glassmorphism frame around Display — the ONLY glassmorphism element in the design
// The housing is opaque clay — this frosted bezel picks up the warm orange page background

export function DisplayBezel({ children }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        borderRadius: '14px',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.5)',     // top inner sheen
          'inset 0 0 0 1px rgba(255,255,255,0.1)',    // subtle inner rim
          '0 4px 12px rgba(0,0,0,0.15)',              // depth under panel
        ].join(', '),
        padding: '3px',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  );
}
