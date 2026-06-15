// src/components/Calculator.jsx
// Root component — layout, state wiring, keyboard input integration
import { useRef, useCallback } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { DisplayBezel } from './DisplayBezel';
import { Display } from './Display';
import { Keypad } from './Keypad';

export function Calculator() {
  const { state, dispatch } = useCalculator();

  // Map<action, { press, release }> — populated as each Key mounts
  const keyRefsMap = useRef(new Map());

  // triggerKeySpring callback for keyboard input
  const triggerKeySpring = useCallback((action, mode) => {
    const keyRef = keyRefsMap.current.get(action);
    if (!keyRef) return;
    if (mode === 'press') {
      keyRef.press();
    } else {
      keyRef.release();
    }
  }, []);

  // Hook up keyboard → dispatch + visual spring
  useKeyboardInput(dispatch, triggerKeySpring);

  return (
    <div
      style={{
        width: 'min(360px, 92vw)',
        background: '#F5F0E8',
        borderRadius: '28px',
        padding: 'var(--housing-padding, 20px 18px 24px)',
        boxShadow: [
          'inset 0 2px 0 rgba(255,255,255,0.85)',     // top sheen
          'inset 0 -2px 0 rgba(0,0,0,0.06)',           // bottom depth
          '0 2px 0 #E0D5C5',                            // housing top face
          '0 16px 0 #C8B8A4',                           // housing bottom wall — thick body illusion
          '0 20px 40px rgba(0,0,0,0.25)',               // ground shadow
          '0 2px 8px rgba(0,0,0,0.12)',                 // close ambient
        ].join(', '),
        // Do NOT use overflow: hidden — it will clip key wall shadows
      }}
    >
      <DisplayBezel>
        <Display
          displayValue={state.displayValue}
          operator={state.operator}
          error={state.error}
        />
      </DisplayBezel>

      <Keypad ref={keyRefsMap} onAction={dispatch} />
    </div>
  );
}
