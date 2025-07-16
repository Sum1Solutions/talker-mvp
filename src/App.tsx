import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import OutputPanel from './OutputPanel';
import PredictionBar from './PredictionBar';
import FloatingButton from './FloatingButton';

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
  { emoji: '😕', text: "I've got some discomfort." },
  { emoji: '🍽️', text: "I could eat." },
  { emoji: '🚻', text: "I could use help getting to the bathroom." },
  { emoji: '🚽', text: "I need to void please." },
  { emoji: '💩', text: "I got a #2 coming." },
  { emoji: '👍', text: "I'm good." }
];

export default function App() {
  const [currentText, setCurrentText] = useState<string>('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [deferSpeak, setDeferSpeak] = useState(false);
  const [lastText, setLastText] = useState<string>('');
  const utterRef = React.useRef<SpeechSynthesisUtterance|null>(null);

  // Always track previous text before any change
  const setCurrentTextWithHistory = (updater: string | ((t: string) => string)) => {
    setCurrentText(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      setLastText(prev);
      return updated;
    });
  };


  // Find a male voice (preferring Google, Apple, or best en-US)
  function getBestMaleVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      // Try to find a male voice by name
      voices.find(v => 
        (v.name.toLowerCase().includes('male') || 
        v.name.includes('David') ||
        v.name.includes('Daniel') ||
        v.name.includes('Thomas') ||
        v.name.includes('Alex') ||
        v.name.includes('Google UK English Male')) &&
        v.lang.startsWith('en')
      ) ||
      // Fall back to any Google/Apple voice that might be male
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
      voices.find(v => v.name.includes('Apple') && v.lang.startsWith('en')) ||
      // Last resort - any English voice
      voices.find(v => v.lang === 'en-US') ||
      voices[0]
    );
  }
  
  // Initialize voices when available
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Load voices as soon as they're available
  useEffect(() => {
    const loadVoices = () => {
      const voice = getBestMaleVoice();
      setMaleVoice(voice);
    };
    
    // Voices might be available immediately
    loadVoices();
    
    // Or they might load asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Only allow one utterance at a time
  const speak = () => {
    if (speaking) return;
    if (!currentText.trim()) return;
    const utter = new window.SpeechSynthesisUtterance(currentText);
    // Use the stored male voice for consistent voice across calls
    utter.voice = maleVoice;
    utter.onend = () => {
      setSpeaking(false);
      // Only clear if not in instant speak mode
      if (!deferSpeak) {
        // Store the full window of text when cleared
        if (currentText.trim()) {
          setLastText(currentText);
        }
        setCurrentText('');
      }
    };
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const goBack = () => {
    setCurrentText(prev => {
      // If already at lastText, don't change
      if (prev === lastText) return prev;
      // Swap: go back to lastText, and keep current as lastText for further undo
      setLastText(prev);
      return lastText;
    });
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

  // Add global keyboard event listener for Enter key and handle space bar focus issues
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default behavior
        speak(); // This will speak and then clear the text
      }
      
      // If space is pressed, ensure no button has focus to prevent accidental re-clicks
      if (e.key === ' ' && document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.blur();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speak]); // Include speak in dependency array to avoid stale closures

  const handleKey = (key: string) => {
    if (key === ' ' || key === 'SPACE') {
      setCurrentTextWithHistory(t => t + ' ');
      if (deferSpeak && !speaking && currentText.trim()) {
        setTimeout(() => speak(), 0);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentTextWithHistory(t => t.slice(0, -1));
    } else {
      setCurrentTextWithHistory(t => t + key);
    }
  };


  const handlePrediction = (word: string) => {
    const lastSpace = currentText.lastIndexOf(' ');
    setCurrentTextWithHistory(
      currentText.slice(0, lastSpace + 1) + word + ' '
    );
  };


  const resetToDefault = () => {
    // Reset floating button position by clearing local storage
    localStorage.removeItem('floatingButtonPosition');
    // Force refresh to apply defaults
    window.location.reload();
  };

  return (
    <div className="container" style={{position: 'relative'}}>
      <div className="app-header">
        <h1 className="app-title">ocutalk.com</h1>
        <div className="dropdown">
          <button className="settings-button" title="Settings">
            ⚙️
          </button>
          <div className="dropdown-content">
            <button 
              onClick={resetToDefault}
              className="dropdown-item"
              title="Reset to default settings"
            >
              Reset to default
            </button>
            <a 
              href="https://github.com/sum1solutions/ocutalk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dropdown-item"
              title="View source code on GitHub"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <OutputPanel text={currentText} setText={setCurrentTextWithHistory}
        speak={speak} stopSpeaking={stopSpeaking} speaking={speaking}
        deferSpeak={deferSpeak} setDeferSpeak={setDeferSpeak}
        lastText={lastText} goBack={goBack}
      />
      <div
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 45vh)', // Adjusted for header + OutputPanel
          overflow: 'auto',
        }}
        aria-label="Main communication area"
      >
        <div className="phrase-bar" aria-label="Quick phrases">
          {PHRASE_BUTTONS.map(btn => (
            <button
              key={btn.emoji}
              className="phrase-btn"
              aria-label={btn.text}
              onClick={(e) => {
                setCurrentTextWithHistory(t => (t.trim() ? t + ' ' : '') + btn.text);
                // Remove focus from the button to prevent space bar from triggering it again
                // Use setTimeout to ensure blur happens after the click event is fully processed
                setTimeout(() => {
                  if (document.activeElement instanceof HTMLButtonElement) {
                    document.activeElement.blur();
                  }
                }, 0);
              }}
            >
              <span className="phrase-emoji">{btn.emoji}</span>
              <span className="phrase-text">{btn.text.length > 18 ? btn.text.slice(0, 18) + '…' : btn.text}</span>
            </button>
          ))}
        </div>
        <PredictionBar predictions={predictions} onPick={handlePrediction}/>
      </div>
      <Keyboard onKeyPress={handleKey}/>
      <FloatingButton onClick={speak} disabled={speaking} />
    </div>
  );
}
