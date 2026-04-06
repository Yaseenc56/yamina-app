'use client';

import React, { useState } from 'react';

export default function YaminaApp() {
  const [activeSlot, setActiveSlot] = useState(0);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [history, setHistory] = useState<string[]>([]);

  const pressNumber = (num: string) => {
    const newDigits = [...digits];
    newDigits[activeSlot] = num;
    setDigits(newDigits);
    if (activeSlot < 3) setActiveSlot(activeSlot + 1);
  };

  const logGuess = () => {
    const currentGuess = digits.map(d => d || '-').join('');
    if (currentGuess.includes('-')) return;
    setHistory([currentGuess, ...history]);
    setDigits(['', '', '', '']);
    setActiveSlot(0);
  };

  return (
    <div className="fixed inset-0 bg-[#FBFBFB] flex flex-col items-center justify-between py-12 px-8 overflow-hidden touch-none select-none font-sans">
      <div className="text-center w-full flex flex-col items-center mt-4">
        <div className="relative mb-1">
          {/* Minimalist Cute Kitten SVG */}
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 2.67-2.76 4-2.26.33.67.33 1.33 0 2a6 6 0 0 1 2 4.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.5a6 6 0 0 1 2-4.5c-.33-.67-.33-1.33 0-2 1.33-.5 2.22.26 4 2.26.65-.17 1.33-.26 2-.26z" />
            <circle cx="9" cy="14" r="1" fill="#1C1C1E" />
            <circle cx="15" cy="14" r="1" fill="#1C1C1E" />
            <path d="M11 16c.67.33 1.33.33 2 0" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-[#1C1C1E] lowercase">yamina</h1>
        <div className="h-[1px] w-8 bg-[#E5E5EA] mt-3"></div>
      </div>

      <div className="flex w-full max-w-xs justify-between gap-3">
        {digits.map((digit, i) => (
          <div
            key={i}
            onClick={() => setActiveSlot(i)}
            className={`w-16 h-24 flex items-center justify-center text-4xl font-light rounded-2xl transition-all duration-300
              ${activeSlot === i 
                ? 'bg-white border-[1.5px] border-[#007AFF] shadow-lg scale-105' 
                : 'bg-white border border-[#E5E5EA] text-[#1C1C1E]'}
            `}
          >
            {digit}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => pressNumber(n.toString())} className="h-14 bg-white border border-[#F2F2F7] rounded-2xl text-xl font-medium active:bg-[#F2F2F7] shadow-sm transition-transform active:scale-95">{n}</button>
        ))}
        <button onClick={() => {setDigits(['','','','']); setActiveSlot(0)}} className="text-[10px] font-bold text-[#C7C7CC] uppercase tracking-widest">Clear</button>
        <button onClick={() => pressNumber('0')} className="h-14 bg-white border border-[#F2F2F7] rounded-2xl text-xl font-medium active:bg-[#F2F2F7] shadow-sm active:scale-95">0</button>
        <button onClick={logGuess} className="h-14 bg-[#1C1C1E] text-white rounded-2xl flex items-center justify-center active:opacity-70 shadow-md active:scale-95">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
        </button>
      </div>

      <div className="w-full h-12 flex items-center justify-center">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {history.length > 0 ? history.map((h, i) => (
            <div key={i} className="flex-shrink-0 px-4 py-1.5 bg-white border border-[#E5E5EA] rounded-full text-xs font-medium text-[#8E8E93] tracking-widest shadow-sm">{h}</div>
          )) : <span className="text-[10px] text-[#C7C7CC] uppercase tracking-[0.2em]">Ready to play</span>}
        </div>
      </div>
    </div>
  );
}