// src/components/Key.jsx
// The most critical component — clay dome button with full spring physics
//
// Why this spring overshoots:
// Damping ratio: ζ = 22 / (2 × √(700 × 0.4)) = 22 / 33.47 ≈ 0.657
// ζ < 1 → underdamped → system oscillates → overshoot confirmed
// Overshoot magnitude: e^(−πζ/√(1−ζ²)) ≈ 6.5% on first rebound
// Perceptible on scaleY: 12% compression range → 0.78px pop above rest on release

import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { useEffect, useImperativeHandle, forwardRef } from 'react';

const VARIANT_STYLES = {
  digit: {
    gradient: 'linear-gradient(145deg, #EDD5C5 0%, #E2C3B0 50%, #C8A090 100%)',
    wall:     '#B08870',
    labelColor: '#3A2E26',
  },
  fn: {
    gradient: 'linear-gradient(145deg, #FFFFFF 0%, #EDEBE6 50%, #D4D0C8 100%)',
    wall:     '#C0BAB0',
    labelColor: '#3A2E26',
  },
  fnAC: {
    gradient: 'linear-gradient(145deg, #FFFFFF 0%, #EDEBE6 50%, #D4D0C8 100%)',
    wall:     '#C0BAB0',
    labelColor: '#CC3333',  // AC = red label, not red background
  },
  op: {
    gradient: 'linear-gradient(145deg, #E4CCEE 0%, #D4B8E0 50%, #B89CC8 100%)',
    wall:     '#A888C0',
    labelColor: '#4A3460',
  },
  eq: {
    gradient: 'linear-gradient(145deg, #FFBA88 0%, #FF9F62 50%, #E07838 100%)',
    wall:     '#C06020',
    labelColor: '#FFFFFF',
  },
};

// Check for reduced motion preference
const prefersReduced = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const springConfig = prefersReduced
  ? { stiffness: 9999, damping: 100, mass: 1 }    // instant — no overshoot
  : { stiffness: 700,  damping: 22,  mass: 0.4 };  // physics spring

export const Key = forwardRef(function Key({ label, variant = 'digit', onAction, wide = false }, ref) {
  const v = VARIANT_STYLES[variant];

  // --- Spring Setup ---
  // rawPress is the intent signal: 0 = up, 1 = down
  // It is NOT animated itself — it's a step function
  const rawPress = useMotionValue(0);

  // springPress smooths rawPress with physics
  // stiffness: 700  →  snappy, fast settle (~180ms)
  // damping:    22  →  underdamped (ζ≈0.657), produces overshoot
  // mass:       0.4 →  light feel, not sluggish
  const springPress = useSpring(rawPress, springConfig);

  // --- Visual Mappings ---
  // All derived from springPress [0=released → 1=pressed]

  // Outer button shifts down 4px — key entering the board
  const translateY = useTransform(springPress, [0, 1], [0, 4]);

  // Keycap face compresses vertically — 3D deformation
  // scaleY applied from top — bottom of face moves up, shrinks the dome height
  const scaleY = useTransform(springPress, [0, 1], [1, 0.88]);

  // Wall height: 8px at rest → 2px when fully pressed
  // This collapses the 3D side-wall as the key sinks — CRITICAL for physical feel
  const wallH = useTransform(springPress, [0, 1], [8, 2]);

  // Ground shadow: softens and lifts as key sinks
  const groundBlur   = useTransform(springPress, [0, 1], [8, 2]);
  const groundOffset = useTransform(springPress, [0, 1], [11, 4]);
  const groundAlpha  = useTransform(springPress, [0, 1], [0.22, 0.10]);

  // Compose the full box-shadow as a single animated string.
  // DO NOT animate box-shadow in CSS — it skips compositor, causes jank.
  // useTransform produces a MotionValue<string> that updates on the compositor thread.
  const boxShadow = useTransform(
    [wallH, groundOffset, groundBlur, groundAlpha],
    ([h, gOff, gBlur, gA]) => [
      `inset 0 1.5px 0 rgba(255,255,255,0.65)`,        // top dome sheen
      `inset 0 -1px 0 rgba(0,0,0,0.10)`,               // bottom inner shadow
      `0 ${h}px 0 ${v.wall}`,                           // ← THE WALL — collapses on press
      `0 ${gOff}px ${gBlur}px rgba(0,0,0,${gA})`,      // ground shadow lifts
      `0 0 0 1px rgba(255,255,255,0.30)`,               // outer rim highlight
    ].join(', ')
  );

  // --- Interaction Handlers ---
  const press   = () => rawPress.set(1);
  const release = () => rawPress.set(0);

  const handlePointerDown = (e) => {
    e.preventDefault();   // prevents touch delay on mobile
    press();
    onAction?.();
  };

  // Expose press/release for keyboard-driven visual triggers
  useImperativeHandle(ref, () => ({
    press,
    release,
  }), []);

  const borderRadius = wide
    ? '24px 24px 28px 28px'
    : '10px 10px 12px 12px';

  return (
    // Outer: handles translateY — moves the whole key assembly down
    // No overflow:hidden here — wall shadow must be visible
    <motion.button
      style={{
        translateY,
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        width: '100%',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={release}
      onPointerLeave={release}   // handles fast swipes without pointerUp
      onPointerCancel={release}
      aria-label={String(label)}
    >
      {/*
        Inner: the keycap face itself.
        scaleY compresses FROM THE TOP (transformOrigin: 'top center').
        This means the bottom of the key face rises upward when pressed,
        which combined with wallH collapse creates the physical sinking effect.
        The outer button does NOT scale — it holds grid space.
      */}
      <motion.div
        style={{
          scaleY,
          transformOrigin: 'top center',
          boxShadow,
          background: v.gradient,
          color: v.labelColor,
          borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '15px 0',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'var(--key-font-size, 15px)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </motion.div>
    </motion.button>
  );
});
