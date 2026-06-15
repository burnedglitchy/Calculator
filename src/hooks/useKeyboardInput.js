// src/hooks/useKeyboardInput.js
// Maps physical keyboard keys to calculator actions and triggers visual spring on the on-screen key
import { useEffect } from 'react';

const keyMap = {
  '0': 'digit:0', '1': 'digit:1', '2': 'digit:2', '3': 'digit:3',
  '4': 'digit:4', '5': 'digit:5', '6': 'digit:6', '7': 'digit:7',
  '8': 'digit:8', '9': 'digit:9',
  '.': 'decimal',
  '+': 'operator:+', '-': 'operator:-',
  '*': 'operator:*', '/': 'operator://',
  'Enter': 'calculate', '=': 'calculate',
  'Escape': 'clear',
  'Backspace': 'backspace',
  '%': 'percent',
};

export function useKeyboardInput(dispatch, triggerKeySpring) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.key];
      if (!action) return;
      e.preventDefault();
      dispatch(action);
      triggerKeySpring?.(action, 'press');
    };

    const handleKeyUp = (e) => {
      const action = keyMap[e.key];
      if (action) triggerKeySpring?.(action, 'release');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, triggerKeySpring]);
}
