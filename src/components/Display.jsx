// src/components/Display.jsx
// LCD panel with ghost digits and operator indicator
import { motion, AnimatePresence } from 'framer-motion';

// Operator symbol mapping for the indicator
const OP_SYMBOLS = {
  '+':  '+',
  '-':  '−',
  '*':  '×',
  '//': '÷',
};

export function Display({ displayValue, operator, error }) {
  return (
    <div
      style={{
        background: '#1A1C1A',
        borderRadius: '10px',
        padding: '12px 14px 10px',
        boxShadow: [
          'inset 0 3px 10px rgba(0,0,0,0.85)',
          'inset 0 0 0 1px rgba(0,0,0,0.6)',
        ].join(', '),
        position: 'relative',
        overflow: 'hidden',
        minHeight: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Operator indicator — top-left corner */}
      {operator && !error && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '12px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px',
            color: 'rgba(138, 148, 128, 0.6)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {OP_SYMBOLS[operator] || ''}
        </div>
      )}

      {/* Ghost digit layer — always render max capacity */}
      <div
        style={{
          position: 'absolute',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 'clamp(1.8rem, 5.5vw, 3rem)',
          letterSpacing: '0.06em',
          color: '#252825',          // display.dim token
          top: '50%',
          right: '14px',
          transform: 'translateY(-50%)',
          userSelect: 'none',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {'8888888888'}
      </div>

      {/* Value layer — z-index 1, right-aligned */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={displayValue}           // triggers AnimatePresence per value change
          style={{
            zIndex: 1,
            position: 'relative',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(1.8rem, 5.5vw, 3rem)',
            letterSpacing: '0.06em',
            color: error ? '#CC3333' : '#8A9480',  // red for error, gray-green for normal
            textAlign: 'right',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.06 }}  // 60ms — LCD refresh feel
        >
          {displayValue}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
