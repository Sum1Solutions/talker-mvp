
import React from 'react';

interface Props {
  text: string;
  setText: (t: string) => void;
  speak: () => void;
  stopSpeaking: () => void;
  speaking: boolean;
  deferSpeak: boolean;
  setDeferSpeak: (v: boolean) => void;
}

export default function OutputPanel({ text, setText, speak, stopSpeaking, speaking, deferSpeak, setDeferSpeak }: Props) {
  return (
    <div className="output-panel">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="output-text"
      />
      <div className="output-actions">
        <button onClick={() => setText('')}>Clear</button>
        <button className="speak-btn" onClick={speak} disabled={speaking || deferSpeak}>🗣️ Speak</button>
        <button className="speak-btn" style={{background: '#c62828'}} onClick={stopSpeaking} disabled={!speaking}>⏹ Stop</button>
        <button className="speak-btn" style={{background: deferSpeak ? '#ffa000' : '#1976d2'}}
          onClick={() => setDeferSpeak(!deferSpeak)}
        >{deferSpeak ? '🕒 Wait for Space' : '🗣️ Instant Speak'}</button>
      </div>
    </div>
  );
}
