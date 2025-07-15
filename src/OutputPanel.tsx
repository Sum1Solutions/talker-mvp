
import React from 'react';

interface Props {
  text: string;
  setText: (t: string) => void;
  speak: () => void;
  stopSpeaking: () => void;
  speaking: boolean;
  deferSpeak: boolean;
  setDeferSpeak: (v: boolean) => void;
  lastText: string;
  goBack: () => void;
}

export default function OutputPanel({ text, setText, speak, stopSpeaking, speaking, deferSpeak, setDeferSpeak, lastText, goBack }: Props) {
  return (
    <div className="output-panel">
      <label htmlFor="aac-textbox" style={{fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.3rem', display: 'block', color: '#1976d2'}}>Your Message</label>
      <textarea
        id="aac-textbox"
        value={text}
        onChange={e => setText(e.target.value)}
        className="output-text"
        aria-label="AAC message box"
        style={{marginBottom: '0.5rem', fontSize: '1.3rem', fontWeight: 700, height: '6rem'}}
      />
      <div className="output-actions">
        <button onClick={() => setText('')}>Clear</button>
        {lastText && (
          <button className="speak-btn" style={{background: '#ffd600', color: '#333'}} onClick={goBack} title="Restore last cleared text">⤺</button>
        )}
        <button className="speak-btn" onClick={speak} disabled={speaking || deferSpeak}>🗣️ Speak</button>
        <button className="speak-btn" style={{background: '#c62828'}} onClick={stopSpeaking} disabled={!speaking}>⏹ Stop</button>
        <button className="speak-btn" style={{background: deferSpeak ? '#ffa000' : '#1976d2'}} 
          onClick={() => setDeferSpeak(!deferSpeak)}
        >{deferSpeak ? '🕒 Wait for Space' : '🗣️ Instant Speak'}</button>
      </div>
    </div>
  );
}
