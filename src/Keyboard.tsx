
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

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      let key = e.key.toUpperCase();
      if (key === ' ') key = 'SPACE';
      if (key === 'BACKSPACE') key = 'BACKSPACE';
      if (
        (key.length === 1 && /[A-Z]/.test(key)) ||
        key === 'SPACE' ||
        key === 'BACKSPACE'
      ) {
        setPressedKey(key);
        onKeyPress(key);
      }
    };
    const handleUp = () => setPressedKey(null);
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [onKeyPress]);

  return (
    <div className="keyboard">
      {rows.map((row, idx) => (
        <div key={idx} className="kb-row">
          {row.split('').map(ch => (
            <button
              key={ch}
              className={`key${pressedKey === ch ? ' key-active' : ''}`}
              onClick={() => onKeyPress(ch)}
            >
              {ch}
            </button>
          ))}
        </div>
      ))}
      <div className="kb-row">
        <button
          className={`key wide${pressedKey === 'SPACE' ? ' key-active' : ''}`}
          onClick={() => onKeyPress('SPACE')}
        >
          Space
        </button>
        <button
          className={`key${pressedKey === 'BACKSPACE' ? ' key-active' : ''}`}
          onClick={() => onKeyPress('BACKSPACE')}
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

