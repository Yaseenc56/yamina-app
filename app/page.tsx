"use client";
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Eye, EyeOff, Lock, Unlock, RefreshCcw } from 'lucide-react';

export default function YaminaGame() {
  const [gameState, setGameState] = useState('setup'); // setup, playing
  const [secretNumber, setSecretNumber] = useState('');
  const [progress, setProgress] = useState(['', '', '', '']);
  const [showSecret, setShowSecret] = useState(false);
  const [isWinning, setIsWinning] = useState(false);

  // Check for win condition
  useEffect(() => {
    if (secretNumber && progress.every((digit, index) => digit === secretNumber[index] && digit !== '')) {
      handleWin();
    }
  }, [progress, secretNumber]);

  const handleWin = () => {
    if (isWinning) return;
    setIsWinning(true);
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      
      confetti({ 
        particleCount: 40, 
        startVelocity: 30, 
        spread: 360, 
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } 
      });
    }, 250);
  };

  const handleSetSecret = (e) => {
    e.preventDefault();
    if (secretNumber.length === 4) setGameState('playing');
  };

  const updateDigit = (index, value) => {
    const newProgress = [...progress];
    newProgress[index] = value.slice(-1);
    setProgress(newProgress);
  };

  const resetGame = () => {
    setGameState('setup');
    setSecretNumber('');
    setProgress(['', '', '', '']);
    setIsWinning(false);
  };

  const getCatState = () => {
    const correctCount = progress.filter((d, i) => d === secretNumber[i] && d !== '').length;
    if (isWinning) return "🎉";
    if (correctCount >= 3) return "😻";
    if (correctCount >= 1) return "😺";
    return "😸";
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex flex-col items-center justify-center p-6 font-sans text-slate-800">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <h1 className="text-2xl font-semibold mb-2">Create a Secret</h1>
          <p className="text-slate-500 mb-8">Enter the 4-digit code she needs to guess.</p>
          <form onSubmit={handleSetSecret} className="space-y-6">
            <input
              type="password"
              maxLength={4}
              placeholder="0000"
              value={secretNumber}
              onChange={(e) => setSecretNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-4xl tracking-[1em] py-4 rounded-2xl border-2 border-slate-100 focus:border-pink-300 focus:outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={secretNumber.length !== 4}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg"
            >
              Start Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] flex flex-col items-center p-6 font-sans text-slate-800 relative overflow-hidden">
      <div className="w-full max-w-md flex justify-between items-center mb-12 mt-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Yamina Live</span>
        </div>
        
        <button 
          onClick={() => setShowSecret(!showSecret)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
          <span className="text-sm font-mono font-bold tracking-widest">
            {showSecret ? secretNumber : "****"}
          </span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 relative">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl transition-all duration-500 transform hover:scale-110">
          <div className="relative">
             <span className="relative z-10">{getCatState()}</span>
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-200/40 blur-lg -z-10 rounded-full" />
          </div>
        </div>

        <div className="text-center mt-4 mb-10">
          <h2 className="text-xl font-semibold">Unlock the Prize</h2>
          <p className="text-slate-400 text-sm">Update the slots as she guesses!</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {progress.map((digit, index) => {
            const isCorrect = digit === secretNumber[index] && digit !== '';
            return (
              <div key={index} className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => updateDigit(index, e.target.value.replace(/\D/g, ''))}
                  className={`w-full h-20 text-center text-3xl font-bold rounded-2xl border-2 transition-all duration-300 outline-none
                    ${isCorrect 
                      ? 'bg-pink-50 border-pink-200 text-pink-600 shadow-inner' 
                      : 'bg-white border-slate-100 focus:border-slate-300'}`}
                />
                {isCorrect ? (
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-1 rounded-full shadow-lg">
                    <Unlock size={10} />
                  </div>
                ) : (
                  digit !== '' && (
                    <div className="absolute -top-2 -right-2 bg-slate-200 text-slate-500 p-1 rounded-full">
                      <Lock size={10} />
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {isWinning && (
          <div className="mt-10 text-center animate-bounce">
            <p className="text-pink-500 font-bold text-lg">Yay! You found it! 🐾</p>
          </div>
        )}
      </div>

      <button 
        onClick={resetGame}
        className="mt-12 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
      >
        <RefreshCcw size={14} />
        New Game
      </button>

      <div className="fixed top-20 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-[80px] -z-10 opacity-60" />
      <div className="fixed bottom-20 -right-10 w-60 h-60 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-60" />
    </div>
  );
}