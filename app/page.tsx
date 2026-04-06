'use client';

import React, { useState } from 'react';

export default function YaminaFinalVault() {
  const [digits, setDigits] = useState(['', '', '', '', '']);
  const [activeSlot, setActiveSlot] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const pressNumber = (num: string) => {
    const newDigits = [...digits];
    newDigits[activeSlot] = num;
    setDigits(newDigits);
    if (activeSlot < 4) setActiveSlot(activeSlot + 1);
  };

  const submitGuess = () => {
    const current = digits.join('');
    if (current.length < 5) return;
    setHistory([current, ...history]);
    // Optional: Add logic here to clear only if it's a "guess" and not the "set"
    if (isLocked) {
        setDigits(['', '', '', '', '']);
        setActiveSlot(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FBFBFB] flex flex-col items-center justify-between py-16 px-10 overflow-hidden touch-none select-none font-sans text-[#1C1C1E]">
      
      {/* Branding Header */}
      <div className="text-center flex flex-col items-center mt-4">
        <div className="relative w-full flex flex-col items-center">
          {/* Guardian Kitten SVG - Recreated from image */}
          <svg width="90" height="70" viewBox="0 0 100 80" fill="none" className="mb-[-5px]">
            <path d="M30 80 C 30 50, 35 40, 50 40 S 70 50, 70 80" stroke="#1C1C1E" strokeWidth="2.5" />
            <path d="M35 45 L 28 30 L 42 38" fill="white" stroke="#1C1C1E" strokeWidth="2" />
            <path d="M65 45 L 72 30 L 58 38" fill="white" stroke="#1C1C1E" strokeWidth="2" />
            <circle cx="42" cy="58" r="4" fill="#1C1C1E" />
            <circle cx="58" cy="58" r="4" fill="#1C1C1E" />
            <path d="M48 65 Q 50 68, 52 65" stroke="#1C1C1E" strokeWidth="1.5" fill="none" />
            <path d="M40 75 Q 40 70, 45 70 M 60 75 Q 60 70, 55 70" stroke="#1C1C1E" strokeWidth="2" fill="none" />
          </svg>
          <h1 className="text-4xl font-bold tracking-tighter lowercase text-[#1C1C1E]">yamina</h1>
        </div>
      </div>

      {/* Vault Input Area */}
      <div className="w-full max-w-xs flex items-center justify-center bg-[#EAE8E4] p-[2px] rounded-2xl border border-[#D1CFCA]">
        <div className="flex bg-[#F2F1EE] rounded-[14px] w-full items-center px-2 py-2 gap-1">
          {digits.map((digit, i) => (
            <div 
              key={i} 
              onClick={() => setActiveSlot(i)}
              className={`flex-1 h-16 flex items-center justify-center text-3xl font-medium rounded-xl transition-all duration-300 ${activeSlot === i ? 'bg-white shadow-sm scale-105' : ''}`}
            >
              {isLocked && digit !== '' ? '•' : digit}
            </div>
          ))}
          {/* Keyhole Lock Button */}
          <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`w-14 h-16 flex items-center justify-center rounded-xl border-l border-[#D1CFCA] transition-colors ${isLocked ? 'bg-[#1C1C1E] text-white' : 'text-[#8E8E93]'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Premium Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => pressNumber(n.toString())} className="h-16 bg-white border border-[#F2F2F7] rounded-2xl text-2xl font-medium shadow-sm active:bg-[#F2F2F7] active:scale-95 transition-all">
            {n}
          </button>
        ))}
        <button onClick={() => {setDigits(['','','','','']); setActiveSlot(0)}} className="text-[11px] font-bold text-[#C7C7CC] uppercase tracking-widest">Clear</button>
        <button onClick={() => pressNumber('0')} className="h-16 bg-white border border-[#F2F2F7] rounded-2xl text-2xl font-medium shadow-sm active:scale-95 transition-all">0</button>
        <button onClick={submitGuess} className="h-16 bg-[#1C1C1E] text-white rounded-2xl flex flex-col items-center justify-center active:opacity-80 shadow-md active:scale-95 transition-all">
          <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Return</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
        </button>
      </div>

      {/* History History Pill */}
      <div className="w-full flex justify-center">
        {history.length > 0 && (
          <div className="px-5 py-2 bg-white border border-[#E5E5EA] rounded-full text-xs font-bold text-[#8E8E93] shadow-sm tracking-widest animate-in fade-in zoom-in duration-500">
            {history[0]}
          </div>
        )}
      </div>
      
    </div>
  );
}