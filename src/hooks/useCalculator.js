// src/hooks/useCalculator.js
// Proper two-operand state machine calculator logic. No eval().
import { useReducer, useCallback } from 'react';

const initialState = {
  displayValue:      '0',
  previousValue:     null,     // first operand
  operator:          null,     // pending operator string
  waitingForOperand: false,    // true after operator key press
  lastAction:        null,     // tracks repeated = presses
  lastOperand:       null,     // replay value for repeated =
  error:             false,
};

// Core compute function — no eval, no Function()
function compute(prev, curr, op) {
  const a = parseFloat(prev);
  const b = parseFloat(curr);
  switch (op) {
    case '+':  return a + b;
    case '-':  return a - b;
    case '*':  return a * b;
    case '//':
      if (b === 0) return null;   // signal division by zero
      return a / b;
    default:   return b;
  }
}

// Format result for display
function formatResult(n) {
  if (n === null) return 'E';                              // error
  if (Object.is(n, -0)) return '0';                        // negative zero
  if (!isFinite(n)) return 'E';                            // infinity
  const str = String(n);
  if (str.length > 10) return parseFloat(n.toExponential(4)).toString();
  // Strip trailing zeros after decimal only for computed results
  if (str.includes('.')) return parseFloat(str).toString();
  return str;
}

function reducer(state, actionStr) {
  // If in error state, only AC can recover
  if (state.error && actionStr !== 'clear') {
    return state;
  }

  // Parse action type
  if (actionStr === 'clear') {
    return { ...initialState };
  }

  if (actionStr.startsWith('digit:')) {
    const digit = actionStr.split(':')[1];
    if (state.waitingForOperand) {
      return {
        ...state,
        displayValue: digit,
        waitingForOperand: false,
        lastAction: 'digit',
      };
    }
    // Prevent leading zeros (but allow "0.")
    const newValue = state.displayValue === '0' ? digit : state.displayValue + digit;
    // Cap at 10 digits
    if (newValue.replace('.', '').replace('-', '').length > 10) return state;
    return {
      ...state,
      displayValue: newValue,
      lastAction: 'digit',
    };
  }

  if (actionStr === 'decimal') {
    if (state.waitingForOperand) {
      return {
        ...state,
        displayValue: '0.',
        waitingForOperand: false,
        lastAction: 'decimal',
      };
    }
    if (state.displayValue.includes('.')) return state;
    return {
      ...state,
      displayValue: state.displayValue + '.',
      lastAction: 'decimal',
    };
  }

  if (actionStr.startsWith('operator:')) {
    const nextOp = actionStr.split(':')[1];

    // Chained operations: left-to-right, no precedence
    if (state.operator && !state.waitingForOperand) {
      const result = compute(state.previousValue, state.displayValue, state.operator);
      const formatted = formatResult(result);
      if (formatted === 'E') {
        return { ...initialState, displayValue: 'E', error: true };
      }
      return {
        ...state,
        displayValue: formatted,
        previousValue: formatted,
        operator: nextOp,
        waitingForOperand: true,
        lastAction: 'operator',
      };
    }

    return {
      ...state,
      previousValue: state.displayValue,
      operator: nextOp,
      waitingForOperand: true,
      lastAction: 'operator',
    };
  }

  if (actionStr === 'calculate') {
    // Repeated = behavior: re-apply last operation
    if (state.lastAction === 'calculate' && state.lastOperand !== null && state.operator) {
      const result = compute(state.displayValue, state.lastOperand, state.operator);
      const formatted = formatResult(result);
      if (formatted === 'E') {
        return { ...initialState, displayValue: 'E', error: true };
      }
      return {
        ...state,
        displayValue: formatted,
        lastAction: 'calculate',
      };
    }

    if (state.operator && state.previousValue !== null) {
      const result = compute(state.previousValue, state.displayValue, state.operator);
      const formatted = formatResult(result);
      if (formatted === 'E') {
        return { ...initialState, displayValue: 'E', error: true };
      }
      return {
        ...state,
        displayValue: formatted,
        previousValue: null,
        lastOperand: state.displayValue,
        lastAction: 'calculate',
        waitingForOperand: false,
      };
    }
    return { ...state, lastAction: 'calculate' };
  }

  if (actionStr === 'toggleSign') {
    if (state.displayValue === '0' || state.displayValue === 'E') return state;
    const toggled = state.displayValue.startsWith('-')
      ? state.displayValue.slice(1)
      : '-' + state.displayValue;
    return {
      ...state,
      displayValue: toggled,
      lastAction: 'toggleSign',
    };
  }

  if (actionStr === 'percent') {
    const val = parseFloat(state.displayValue) / 100;
    return {
      ...state,
      displayValue: formatResult(val),
      lastAction: 'percent',
    };
  }

  if (actionStr === 'backspace') {
    if (state.waitingForOperand || state.displayValue === '0') return state;
    const sliced = state.displayValue.slice(0, -1);
    return {
      ...state,
      displayValue: sliced === '' || sliced === '-' ? '0' : sliced,
      lastAction: 'backspace',
    };
  }

  return state;
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAction = useCallback((actionStr) => {
    dispatch(actionStr);
  }, []);

  return { state, dispatch: handleAction };
}
