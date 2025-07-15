
import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import PredictionBar from './PredictionBar';
import OutputPanel from './OutputPanel';

async function fetchPredictions(text: string): Promise<string[]> {
  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data.suggestions ?? [];
  } catch {
    return [];
  }
}

const PHRASE_BUTTONS = [
  { emoji: '🙄', text: "I don't mean to be a pain in the ass, but " },
  { emoji: '👍', text: "I'm good." },
  { emoji: '😕', text: "I've got some discomfort." },
  { emoji: '🍽️', text: "I could eat." },
  { emoji: '🚻', text: "I could use help getting to the bathroom." },
  { emoji: '💩', text: "I got a #2 coming." }
];

export default function App() {
  const [currentText, setCurrentText] = useState<string>('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [deferSpeak, setDeferSpeak] = useState(false);
  const utterRef = React.useRef<SpeechSynthesisUtterance|null>(null);

  // Find a more human-like voice (Google, Apple, or best en-US)
  function getBestVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
      voices.find(v => v.name.includes('Apple') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang === 'en-US') ||
      voices[0]
    );
  }

  // Only allow one utterance at a time
  const speak = () => {
    if (speaking) return;
    if (!currentText.trim()) return;
    const utter = new window.SpeechSynthesisUtterance(currentText);
    utter.voice = getBestVoice();
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    utterRef.current = null;
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (currentText.trim().length) {
        const p = await fetchPredictions(currentText);
        setPredictions(p);
      } else {
        setPredictions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [currentText]);

  const handleKey = (key: string) => {
    if (key === 'SPACE') {
      setCurrentText(t => t + ' ');
      if (deferSpeak && !speaking && currentText.trim()) {
        setTimeout(() => speak(), 0);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentText(t => t.slice(0, -1));
    } else {
      setCurrentText(t => t + key);
    }
  };

  const handlePrediction = (word: string) => {
    const lastSpace = currentText.lastIndexOf(' ');
    setCurrentText(
      currentText.slice(0, lastSpace + 1) + word + ' '
    );
  };

  return (
    <div className="container" style={{position: 'relative'}}>
      <OutputPanel text={currentText} setText={setCurrentText}
        speak={speak} stopSpeaking={stopSpeaking} speaking={speaking}
        deferSpeak={deferSpeak} setDeferSpeak={setDeferSpeak}
      />
      <div className="phrase-bar">
        {PHRASE_BUTTONS.map(btn => (
          <button
            key={btn.emoji}
            className="phrase-btn"
            onClick={() => setCurrentText(t => (t.trim() ? t + ' ' : '') + btn.text)}
          >
            <span style={{fontSize: '2.2rem', marginRight: '0.5rem'}}>{btn.emoji}</span>
            {btn.text.length > 18 ? btn.text.slice(0, 18) + '…' : btn.text}
          </button>
        ))}
      </div>
      <PredictionBar predictions={predictions} onPick={handlePrediction}/>
      <Keyboard onKeyPress={handleKey}/>

    </div>
  );
}
