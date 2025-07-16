
import React, { useEffect, useRef } from 'react';

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
  // Ref for textarea to control scrolling
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Auto-scroll textarea to bottom when text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="output-panel">
      <div className="text-container">
        <textarea
          ref={textareaRef}
          id="aac-textbox"
          value={text}
          onChange={e => setText(e.target.value)}
          className="output-text"
          placeholder=""
          aria-label="AAC message box"
          style={{ color: '#1976d2' }}
        />
      </div>
      <div className="output-actions">
        <div className="left-actions">
          <button 
            className="stop-btn" 
            onClick={stopSpeaking} 
            disabled={!speaking}
          >⏹ Stop</button>
          <button 
            className="clear-btn"
            onClick={() => setText('')}
          >Clear</button>
          <button 
            className="back-btn" 
            onClick={goBack} 
            disabled={!lastText}
            title="Restore previous text"
          >↩ Go Back</button>
        </div>
        <div className="right-actions">
          <button 
            className="speak-btn" 
            onClick={speak} 
            disabled={speaking || deferSpeak}
          >🔊 Speak</button>
          <button 
            className="stop-btn" 
            onClick={stopSpeaking} 
            disabled={!speaking}
          >⏹ Stop</button>
        </div>
      </div>
    </div>
  );
}
