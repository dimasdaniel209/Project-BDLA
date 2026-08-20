import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface Props {
  recipientName: string;
  age?: number;
}

export const BirthdayCake: React.FC<Props> = ({ recipientName, age = 24 }) => {
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [wishMade, setWishMade] = useState(false);

  const blowSingleCandle = (index: number) => {
    if (!candles[index]) return;

    audioEngine.playCandleBlowSound();
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    // If all candles blown out
    if (newCandles.every((c) => !c)) {
      handleAllBlown();
    }
  };

  const blowAllCandles = () => {
    audioEngine.playCandleBlowSound();
    setCandles([false, false, false, false, false]);
    handleAllBlown();
  };

  const handleAllBlown = () => {
    setWishMade(true);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const relightCandles = () => {
    setCandles([true, true, true, true, true]);
    setWishMade(false);
  };

  const allOut = candles.every((c) => !c);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md w-full bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl text-white">
      <div className="text-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-pink-200">
          Momen Spesial
        </span>
        <h3 className="text-2xl font-extrabold text-white">Make a Wish & Tiup Lilin 🎂</h3>
        <p className="text-white/80 text-xs mt-1">
          {allOut ? 'Semua lilin padam! Harapanmu akan segera terwujud ✨' : 'Klik lilin atau tombol di bawah untuk meniup lilinnya!'}
        </p>
      </div>

      {/* Birthday Cake Illustration */}
      <div className="relative my-4 flex flex-col items-center">
        {/* Candle Flames Row */}
        <div className="flex gap-4 sm:gap-6 mb-1 z-20">
          {candles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => blowSingleCandle(idx)}
              className="flex flex-col items-center cursor-pointer group"
              title="Klik untuk tiup lilin ini"
            >
              {/* Flame */}
              {isLit ? (
                <div className="relative flex justify-center mb-0.5">
                  <div className="w-3.5 h-5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-bounce shadow-[0_0_12px_rgba(251,191,36,0.9)] group-hover:scale-125 transition-transform" />
                  <div className="absolute -top-1 w-1.5 h-2 bg-yellow-100 rounded-full animate-ping opacity-80" />
                </div>
              ) : (
                /* Smoke Puff */
                <div className="w-2 h-4 bg-white/40 rounded-full blur-[1px] animate-pulse mb-1" />
              )}
              {/* Candle Stick */}
              <div className="w-2.5 h-12 bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-300 rounded-t-sm shadow-md border border-white/40" />
            </div>
          ))}
        </div>

        {/* Top Cake Tier */}
        <div className="w-48 sm:w-56 h-14 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 rounded-t-2xl shadow-lg relative border-t-2 border-white/60 flex items-center justify-center">
          {/* Icing Drips */}
          <div className="absolute top-0 inset-x-0 flex justify-around">
            <div className="w-4 h-4 bg-white/90 rounded-b-full shadow-sm" />
            <div className="w-5 h-6 bg-white/90 rounded-b-full shadow-sm" />
            <div className="w-4 h-3 bg-white/90 rounded-b-full shadow-sm" />
            <div className="w-6 h-5 bg-white/90 rounded-b-full shadow-sm" />
            <div className="w-4 h-4 bg-white/90 rounded-b-full shadow-sm" />
          </div>
          <span className="text-pink-900 font-extrabold text-xs z-10 drop-shadow-sm uppercase tracking-wider">
            Happy {age}th Birthday {recipientName}
          </span>
        </div>

        {/* Bottom Cake Tier */}
        <div className="w-60 sm:w-68 h-20 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-b-2xl shadow-2xl relative border-t border-white/30 flex items-center justify-center">
          {/* Decoration Cherries/Dots */}
          <div className="flex gap-4">
            <span className="text-xl animate-pulse">🍓</span>
            <span className="text-xl animate-pulse">✨</span>
            <span className="text-xl animate-pulse">🍓</span>
            <span className="text-xl animate-pulse">✨</span>
            <span className="text-xl animate-pulse">🍓</span>
          </div>
        </div>

        {/* Plate */}
        <div className="w-72 sm:w-80 h-4 bg-white/40 backdrop-blur-md rounded-full shadow-xl -mt-1 border border-white/60" />
      </div>

      {/* Control Action Buttons */}
      <div className="mt-4 flex gap-3">
        {!allOut ? (
          <button
            onClick={blowAllCandles}
            className="bg-white text-rose-600 font-extrabold px-6 py-2.5 rounded-full hover:bg-rose-50 transition-all active:scale-95 shadow-lg flex items-center gap-2 text-sm"
          >
            <Wind className="w-4 h-4" /> Tiup Semua Lilin 💨
          </button>
        ) : (
          <button
            onClick={relightCandles}
            className="bg-white/20 hover:bg-white/30 border border-white/30 font-semibold px-5 py-2.5 rounded-full text-white transition-all text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Nyalakan Lilin Lagi
          </button>
        )}
      </div>

      {wishMade && (
        <div className="mt-4 p-3 bg-pink-500/30 border border-pink-300/40 rounded-2xl text-center animate-in fade-in zoom-in-95">
          <p className="text-xs font-bold text-amber-200 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-300" /> Wish-mu telah terikrar dengan indah!
          </p>
        </div>
      )}
    </div>
  );
};
