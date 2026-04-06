"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCcw, Delete, Send, CheckCircle2, HelpCircle } from 'lucide-react';

// Using dynamic import for confetti to ensure it only loads on the client
const triggerConfetti = async () => {
  const confetti = (await import('canvas-confetti')).default;
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#000000', '#ec4899', '#3b82f6']
  });
};

export default function YaminaGame() {
  const [gameState, setGameState] = useState('setup'); // setup, playing, won
  const [secretNumber, setSecretNumber] = useState('');
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [history, setHistory] = useState([]); // Array of { guess: string, bulls: number, cows: number }
  const [activeSlot, setActiveSlot] = useState(0);

  // Handle Keypad Input
  const handleKeypadPress = (num) => {
    if (activeSlot < 4) {
      const newGuess = [...currentGuess];
      newGuess[activeSlot] = num.toString();
      setCurrentGuess(newGuess);
      setActiveSlot(activeSlot + 1);
    }
  };

  const handleBackspace = () => {
    if (activeSlot > 0) {
      const newGuess = [...currentGuess];
      newGuess[activeSlot - 1] = '';
      setCurrentGuess(newGuess);
      setActiveSlot(activeSlot - 1);
    }
  };

  const submitGuess = () => {
    if (currentGuess.includes('')) return;

    const guessStr = currentGuess.join('');
    let bulls = 0;
    let cows = 0;

    const secretArr = secretNumber.split('');
    const guessArr = [...currentGuess];

    // Calculate Bulls (Correct digit, correct spot)
    for (let i = 0; i < 4; i++) {
      if (guessArr[i] === secretArr[i]) {
        bulls++;
        secretArr[i] = null;
        guessArr[i] = null;
      }
    }

    // Calculate Cows (Correct digit, wrong spot)
    for (let i = 0; i < 4; i++) {
      if (guessArr[i] !== null) {
        const index = secretArr.indexOf(guessArr[i]);
        if (index !== -1) {
          cows++;
          secretArr[index] = null;
        }
      }
    }

    const newHistoryEntry = { guess: guessStr, bulls, cows };
    setHistory([newHistoryEntry, ...history]);
    
    if (bulls === 4) {
      setGameState('won');
      triggerConfetti();
    } else {
      // Reset for next guess
      setCurrentGuess(['', '', '', '']);
      setActiveSlot(0);
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setSecretNumber('');
    setCurrentGuess(['', '', '', '']);
    setHistory([]);
    setActiveSlot(0);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center">
          <div className="text-5xl mb-6">🐱</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Set the Secret</h1>
          <p className="text-slate-400 text-sm mb-8">Enter 4 digits for her to guess.</p>
          <input
            type="password"
            maxLength={4}
            value={secretNumber}
            onChange={(e) => setSecretNumber(e.target.value.replace(/\D/g, ''))}
            className="w-full text-center text-4xl tracking-[0.5em] py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-200 outline-none mb-6 font-mono"
            placeholder="****"
          />
          <button 
            onClick={() => secretNumber.length === 4 && setGameState('playing')}
            disabled={secretNumber.length !== 4}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-20"
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center p-6 font-sans text-slate-900">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 mt-2">
        <span className="text-xs font-black uppercase tracking-widest text-slate-300">Yamina v2.0</span>
        <button onClick={resetGame} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Main Game Area */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 p-8 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">{gameState === 'won' ? '😻' : '😸'}</div>
          <h2 className="text-lg font-bold">{gameState === 'won' ? 'Perfect Match!' : 'Current Guess'}</h2>
        </div>

        {/* Guess Slots */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {currentGuess.map((digit, i) => (
            <div 
              key={i} 
              className={`h-16 flex items-center justify-center text-2xl font-bold rounded-2xl border-2 transition-all
                ${activeSlot === i ? 'border-blue-400 bg-blue-50/30' : 'border-slate-100 bg-slate-50'}`}
            >
              {digit}
            </div>
          ))}
        </div>

        {/* On-Screen Keypad */}
        {gameState !== 'won' && (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button 
                key={n} 
                onClick={() => handleKeypadPress(n)}
                className="h-14 bg-slate-50 hover:bg-slate-100 active:scale-95 rounded-xl font-bold text-lg transition-all"
              >
                {n}
              </button>
            ))}
            <button onClick={handleBackspace} className="h-14 flex items-center justify-center text-slate-400 hover:text-red-500">
              <Delete size={24} />
            </button>
            <button onClick={() => handleKeypadPress(0)} className="h-14 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-lg">0</button>
            <button 
              onClick={submitGuess}
              disabled={currentGuess.includes('')}
              className="h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-20 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <button 
            onClick={resetGame}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold animate-pulse"
          >
            Play Again
          </button>
        )}
      </div>

      {/* History Log */}
      <div className="w-full max-w-md mt-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">History</h3>
        <div className="space-y-2">
          {history.length === 0 && (
            <div className="text-center py-8 text-slate-300 italic text-sm">No guesses yet...</div>
          )}
          {history.map((entry, i) => (
            <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2">
              <span className="font-mono text-xl font-bold tracking-widest">{entry.guess}</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm font-bold">{entry.bulls}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle size={16} className="text-amber-500" />
                  <span className="text-sm font-bold">{entry.cows}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}