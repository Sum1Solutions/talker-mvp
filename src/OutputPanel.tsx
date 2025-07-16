
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
      <div className="text-container">
        <textarea
          id="aac-textbox"
          value={text}
          onChange={e => setText(e.target.value)}
          className="output-text"
          placeholder="Text Goes Here.."
          aria-label="AAC message box"
        />
      </div>
      <div className="output-actions">
        <div className="left-actions">
          <button onClick={() => setText('')}>Clear</button>
          <button 
            className="stop-btn" 
            onClick={stopSpeaking} 
            disabled={!speaking}
          >⏹ Stop</button>
        </div>
        <div className="right-actions">
          <button 
            className="speak-btn" 
            onClick={speak} 
            disabled={speaking || deferSpeak}
          >🔊 Speak</button>
        </div>
      </div>
    </div>
  );
}
