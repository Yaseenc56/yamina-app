'use client';

import React, { useState } from 'react';

export default function YaminaPro() {
  const [activeSlot, setActiveSlot] = useState(0);
  const [digits, setDigits] = useState(['', '', '', '', '']);
  const [confirmed, setConfirmed] = useState([false, false, false, false, false]);
  const [history, setHistory] = useState<string[]>([]);

  const pressNumber = (num: string) => {
    if (confirmed[activeSlot]) return;
    const newDigits = [...digits];
    newDigits[activeSlot] = num;
    setDigits(newDigits);

    let next = (activeSlot + 1) % 5;
    let count = 0;
    while (confirmed[next] && count < 5) {
      next = (next + 1) % 5;
      count++;
    }
    setActiveSlot(next);
  };

  const toggleVerify = (index: number) => {
    if (digits[index] === '') return;
    const newConfirmed = [...confirmed];
    newConfirmed[index] = !newConfirmed[index];
    setConfirmed(newConfirmed);
    
    if (newConfirmed.filter(Boolean).length === 5) {
      import('canvas-confetti').then(confetti => {
        confetti.default({ particleCount: 150, spread: 70, origin: { y: 0.7 }, colors: ['#10B981', '#34D399'] });
      });
    }
  };

  const logGuess = () => {
    const currentGuess = digits.map(d => d || '-').join('');
    if (currentGuess.includes('-')) return;
    setHistory([currentGuess, ...history]);
    setDigits(digits.map((d, i) => confirmed[i] ? d : ''));
    setActiveSlot(confirmed.indexOf(false));
  };

  return (
    <div className="fixed inset-0 bg-[#F2F2F7] flex flex-col items-center justify-between py-12 px-6 overflow-hidden touch-none">
      <div className="text-center w-full mt-4">
        <h1 className="text-3xl font-extrabold tracking-tighter text-[#1C1C1E]">Yamina</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
          {confirmed.filter(Boolean).length}/5 Digits Verified
        </p>
      </div>

      <div className="flex w-full max-w-sm justify-between gap-2 my-8">
        {digits.map((digit, i) => (
          <div
            key={i}
            onClick={() => {
              setActiveSlot(i);
              if (digits[i] !== '') toggleVerify(i);
            }}
            className={`w-14 h-20 flex items-center justify-center text-3xl font-light rounded-[20px] transition-all duration-300
              ${confirmed[i] ? 'bg-[#ECFDF5] border-2 border-[#10B981] text-[#047857]' : activeSlot === i ? 'bg-white border-2 border-[#007AFF]' : 'bg-white border border-[#E5E5EA]'}
            `}
          >
            {digit}
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => pressNumber(n.toString())} className="h-16 bg-white border border-[#E5E5EA] rounded-2xl text-2xl font-medium active:bg-slate-100 transition-all shadow-sm">{n}</button>
        ))}
        <button onClick={() => setDigits(digits.map((d, i) => confirmed[i] ? d : ''))} className="h-16 text-slate-400 text-sm font-bold uppercase tracking-tighter">Clear</button>
        <button onClick={() => pressNumber('0')} className="h-16 bg-white border border-[#E5E5EA] rounded-2xl text-2xl font-medium active:bg-slate-100 shadow-sm">0</button>
        <button onClick={logGuess} className="h-16 bg-[#1C1C1E] text-white rounded-2xl text-2xl font-bold active:opacity-80 shadow-lg">↵</button>
      </div>

      <div className="w-full flex gap-2 overflow-x-auto pb-4 px-2 no-scrollbar h-12 items-center">
        {history.map((h, i) => (
          <div key={i} className="flex-shrink-0 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-mono text-slate-500">{h}</div>
        ))}
      </div>
    </div>
  );
}
