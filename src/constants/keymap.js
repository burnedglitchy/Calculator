// src/constants/keymap.js
// Layout definition: label, variant, action, gridSpan
// Matches the reference image layout exactly

export const KEYS = [
  // Row 0 — function + first operator
  { label: 'AC',  variant: 'fnAC',  action: 'clear',        span: 1 },
  { label: '+/−', variant: 'fn',    action: 'toggleSign',   span: 1 },
  { label: '%',   variant: 'fn',    action: 'percent',      span: 1 },
  { label: '÷',   variant: 'op',    action: 'operator://',  span: 1 },

  // Row 1
  { label: '7',   variant: 'digit', action: 'digit:7',      span: 1 },
  { label: '8',   variant: 'digit', action: 'digit:8',      span: 1 },
  { label: '9',   variant: 'digit', action: 'digit:9',      span: 1 },
  { label: '×',   variant: 'op',    action: 'operator:*',   span: 1 },

  // Row 2
  { label: '4',   variant: 'digit', action: 'digit:4',      span: 1 },
  { label: '5',   variant: 'digit', action: 'digit:5',      span: 1 },
  { label: '6',   variant: 'digit', action: 'digit:6',      span: 1 },
  { label: '−',   variant: 'op',    action: 'operator:-',   span: 1 },

  // Row 3
  { label: '1',   variant: 'digit', action: 'digit:1',      span: 1 },
  { label: '2',   variant: 'digit', action: 'digit:2',      span: 1 },
  { label: '3',   variant: 'digit', action: 'digit:3',      span: 1 },
  { label: '+',   variant: 'op',    action: 'operator:+',   span: 1 },

  // Row 4 — bottom row
  { label: '0',   variant: 'digit', action: 'digit:0',      span: 2 },  // wide key
  { label: '.',   variant: 'digit', action: 'decimal',      span: 1 },
  { label: '=',   variant: 'eq',    action: 'calculate',    span: 1 },
];
