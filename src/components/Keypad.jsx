// src/components/Keypad.jsx
// CSS grid layout with stagger mount animation. Structure matches the reference image exactly.
import { motion } from 'framer-motion';
import { Key } from './Key';
import { KEYS } from '../constants/keymap';
import { forwardRef, useCallback } from 'react';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025 } },
};

const keyVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  show:   {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 28 },
  },
};

export const Keypad = forwardRef(function Keypad({ onAction }, ref) {
  // ref is a Map<action, { press, release }> stored in Calculator
  const setKeyRef = useCallback((action, keyRef) => {
    if (ref && ref.current) {
      ref.current.set(action, keyRef);
    }
  }, [ref]);

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--key-gap, 10px)',
      }}
    >
      {KEYS.map((key, i) => (
        <motion.div
          key={i}
          variants={keyVariants}
          style={{ gridColumn: key.span === 2 ? 'span 2' : undefined }}
        >
          <Key
            ref={(el) => setKeyRef(key.action, el)}
            label={key.label}
            variant={key.variant}
            wide={key.span === 2}
            onAction={() => onAction(key.action)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});
