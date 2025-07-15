
import React, { useEffect, useState } from 'react';

const rows = [
  'QWERTYUIOP',
  'ASDFGHJKL',
  'ZXCVBNM'
];

interface Props {
  onKeyPress: (key: string) => void;
}

export default function Keyboard({ onKeyPress }: Props) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [caps, setCaps] = useState<boolean>(true);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      let key = e.key;
      if (key === ' ') key = 'SPACE';
      if (key === 'Backspace' || key === 'BACKSPACE') key = 'BACKSPACE';
      if (key === 'Shift' || key === 'CapsLock') {
        setCaps(c => !c);
        return;
      }
      if (
        (key.length === 1 && /[a-zA-Z]/.test(key)) ||
        key === 'SPACE' ||
        key === 'BACKSPACE'
      ) {
        setPressedKey(caps ? key.toUpperCase() : key.toLowerCase());
        onKeyPress(caps ? key.toUpperCase() : key.toLowerCase());
      }
    };
    const handleUp = () => setPressedKey(null);
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [onKeyPress, caps]);

  return (
    <div className="keyboard">
      {rows.map((row, idx) => (
        <div key={idx} className="kb-row">
          {idx === 0 && (
            <button
              className={`key caps-toggle${caps ? ' key-active' : ''}`}
              aria-label={caps ? 'Caps Lock On' : 'Caps Lock Off'}
              onClick={() => setCaps(c => !c)}
              style={{marginRight: '0.4rem', background: caps ? '#e3f2fd' : '#f4f8ff', borderColor: '#1976d2'}}
            >
              {caps ? '↑' : '↓'}
            </button>
          )}
          {row.split('').map((ch, i) => (
            <button
              key={ch}
              className={`key${pressedKey === (caps ? ch : ch.toLowerCase()) ? ' key-active' : ''}`}
              onClick={() => onKeyPress(caps ? ch : ch.toLowerCase())}
            >
              {caps ? ch : ch.toLowerCase()}
            </button>
          ))}
        </div>
      ))}
      <div className="kb-row">
        <button
          className={`key wide${pressedKey === 'SPACE' ? ' key-active' : ''}`}
          style={{marginRight: 'auto'}} // push backspace to right
          onClick={() => onKeyPress(' ')}
          aria-label="Space bar"
        >
          Space
        </button>
        <button
          className={`key backspace${pressedKey === 'BACKSPACE' ? ' key-active' : ''}`}
          onClick={() => onKeyPress('BACKSPACE')}
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

