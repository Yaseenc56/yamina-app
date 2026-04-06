'use client';

import React, { useState } from 'react';

type GamePhase = 'setup' | 'gameplay';

export default function YaminaPremiumGift() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [setupDigits, setSetupDigits] = useState(['', '', '', '', '']);
  const [setupActiveSlot, setSetupActiveSlot] = useState(0);
  const [isSetupHidden, setIsSetupHidden] = useState(false);
  
  const [guessDigits, setGuessDigits] = useState(['', '', '', '', '']);
  const [guessActiveSlot, setGuessActiveSlot] = useState(0);
  const [lockedSlots, setLockedSlots] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [keypadValidation, setKeypadValidation] = useState<Record<string, 'green' | 'yellow' | 'none'>>({});

  const pressNumber = (num: string) => {
    if (phase === 'setup') {
      if (isSetupHidden) return;
      const newDigits = [...setupDigits];
      newDigits[setupActiveSlot] = num;
      setSetupDigits(newDigits);
      if (setupActiveSlot < 4) setSetupActiveSlot(setupActiveSlot + 1);
    } else {
      let nextSlot = guessActiveSlot;
      while (lockedSlots.has(nextSlot) && nextSlot < 5) nextSlot++;
      if (nextSlot < 5) {
        const newDigits = [...guessDigits];
        newDigits[nextSlot] = num;
        setGuessDigits(newDigits);
        setGuessActiveSlot(nextSlot + 1);
      }
    }
  };

  const submitGuess = () => {
    const currentGuess = guessDigits.join('');
    if (currentGuess.length < 5) return;
    
    const correctCode = setupDigits.join('');
    const newKeypad: Record<string, 'green' | 'yellow' | 'none'> = {};

    guessDigits.forEach((d, i) => {
      if (d === setupDigits[i]) newKeypad[d] = 'green';
      else if (correctCode.includes(d) && newKeypad[d] !== 'green') newKeypad[d] = 'yellow';
      else if (!correctCode.includes(d)) newKeypad[d] = 'none';
    });

    setKeypadValidation(prev => ({...prev, ...newKeypad}));
    setHistory([currentGuess, ...history]);
    
    const reset = guessDigits.map((d, i) => lockedSlots.has(i) ? d : '');
    setGuessDigits(reset);
    let first = 0;
    while (lockedSlots.has(first) && first < 5) first++;
    setGuessActiveSlot(first);
  };

  const toggleLock = (index: number) => {
    if (phase !== 'gameplay' || guessDigits[index] === '') return;
    setLockedSlots(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 bg-[#FBFBFB] flex flex-col items-center justify-between py-14 px-8 overflow-hidden touch-none font-sans text-[#1C1C1E]">
      
      {/* Refined Header */}
      <div className="text-center flex flex-col items-center animate-in fade-in slide-in-from-top duration-1000">
        <div className="relative h-16 w-full flex items-center justify-center mb-2">
             <svg width="60" height="50" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M7 18c0-4 1-7 5-7s5 3 5 7" />
                <path d="M8 10l-1.5-4 2.5 1.5M16 10l1.5-4-2.5 1.5" />
                <circle cx="10" cy="14" r="0.6" fill="currentColor" />
                <circle cx="14" cy="14" r="0.6" fill="currentColor" />
             </svg>
          <h1 className="absolute bottom-0 text-3xl font-bold tracking-[-0.05em] lowercase">yamina</h1>
        </div>
        <div className="h-[1px] w-4 bg-[#E5E5EA]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs">
        <p className="text-[10px] font-bold text-[#C7C7CC] tracking-[0.2em] uppercase mb-8">
          {phase === 'setup' ? 'Initializing Secret' : 'Decrypting Sequence'}
        </p>

        {/* The Input Grid */}
        <div className="flex w-full justify-between gap-2 mb-8">
          {(phase === 'setup' ? setupDigits : guessDigits).map((digit, i) => (
            <div 
              key={i} 
              onDoubleClick={() => toggleLock(i)}
              onClick={() => phase === 'setup' ? setSetupActiveSlot(i) : !lockedSlots.has(i) && setGuessActiveSlot(i)}
              className={`w-[58px] h-[78px] flex items-center justify-center text-3xl font-light rounded-2xl transition-all duration-500 border relative
                ${lockedSlots.has(i) ? 'bg-white border-[#34C759] shadow-[0_0_15px_rgba(52,199,89,0.2)] text-[#34C759] scale-105' : 
                  ((phase === 'setup' ? setupActiveSlot : guessActiveSlot) === i ? 'bg-white border-[#007AFF] shadow-xl scale-105' : 'bg-white border-[#E5E5EA]')}
              `}
            >
              {phase === 'setup' && isSetupHidden ? '•' : digit}
              {lockedSlots.has(i) && (
                <div className="absolute top-1 right-1 text-[#34C759]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {phase === 'setup' && (
          <button onClick={() => setIsSetupHidden(!isSetupHidden)} className="mb-6 text-[10px] font-bold text-[#8E8E93] border border-[#E5E5EA] px-4 py-2 rounded-full uppercase tracking-widest active:bg-gray-50 transition-colors">
            {isSetupHidden ? 'Reveal Code' : 'Hide Code'}
          </button>
        )}

        {/* Premium Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} onClick={() => pressNumber(n.toString())} className={`h-14 bg-white border border-[#F2F2F7] rounded-2xl text-xl font-medium shadow-sm active:scale-95 transition-all
              ${keypadValidation[n] === 'green' ? 'border-[#34C759] text-[#34C759]' : keypadValidation[n] === 'yellow' ? 'border-[#FFCC00] text-[#FFCC00]' : ''}`}>
              {n}
            </button>
          ))}
          <button onClick={() => phase === 'setup' ? setSetupDigits(['','','','','']) : setGuessDigits(guessDigits.map((d, i) => lockedSlots.has(i) ? d : ''))} className="text-[10px] font-bold text-[#C7C7CC] uppercase tracking-widest">Clr</button>
          <button onClick={() => pressNumber('0')} className={`h-14 bg-white border border-[#F2F2F7] rounded-2xl text-xl font-medium shadow-sm active:scale-95 transition-all
            ${keypadValidation['0'] === 'green' ? 'border-[#34C759] text-[#34C759]' : keypadValidation['0'] === 'yellow' ? 'border-[#FFCC00] text-[#FFCC00]' : ''}`}>0</button>
          <button onClick={phase === 'setup' ? () => setPhase('gameplay') : submitGuess} className={`h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${((phase === 'setup' ? setupDigits : guessDigits).every(d => d !== '')) ? 'bg-[#1C1C1E] text-white' : 'bg-[#E5E5EA] text-[#AEAEB2]'}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{phase === 'setup' ? 'Set' : 'Try'}</span>
          </button>
        </div>
      </div>

      {/* Subtle History Bar */}
      <div className="w-full flex justify-center gap-2 overflow-x-auto no-scrollbar py-4">
        {history.map((h, i) => (
          <div key={i} className="px-3 py-1 bg-white border border-[#F2F2F7] rounded-full text-[9px] font-mono font-bold text-[#C7C7CC]">{h}</div>
        ))}
      </div>
    </div>
  );
}