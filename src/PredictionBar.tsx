
import React from 'react';

interface Props {
  predictions: string[];
  onPick: (word: string) => void;
}

export default function PredictionBar({ predictions, onPick }: Props) {
  if (!predictions.length) return null;
  return (
    <div className="prediction-bar">
      {predictions.slice(0,3).map(word => (
        <button key={word} className="prediction" onClick={() => onPick(word)}>
          {word}
        </button>
      ))}
    </div>
  );
}
