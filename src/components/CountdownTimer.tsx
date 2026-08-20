import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface Props {
  targetDateStr: string;
  recipientName: string;
  age?: number;
  theme: ThemeConfig;
  onTimeReached?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownTimer: React.FC<Props> = ({
  targetDateStr,
  recipientName,
  age = 24,
  onTimeReached,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });

        if (!hasCelebrated) {
          setHasCelebrated(true);
          triggerConfettiCelebration();
          if (onTimeReached) {
            onTimeReached();
          }
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr, hasCelebrated, onTimeReached]);

  const triggerConfettiCelebration = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#f43f5e', '#fbbf24', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="relative w-full flex flex-col justify-center items-center py-8">
      {/* Subtle Green Ambient Light Glow behind digits */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[320px] sm:w-[480px] h-[200px] sm:h-[260px] bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Timer Digits Display */}
      {timeLeft.isExpired ? (
        <div className="text-center animate-in fade-in zoom-in-90 duration-500 my-auto z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-bold text-base shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" /> Hari Ulang Tahun Telah Tiba!
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-7 my-auto">
          {/* Days */}
          <div className="text-center min-w-[65px] sm:min-w-[90px]">
            <div className="text-5xl sm:text-7xl font-black text-emerald-400 mb-1 drop-shadow-[0_0_20px_rgba(52,211,153,0.75)] tracking-tight font-mono">
              {padZero(timeLeft.days)}
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-300/80 font-bold uppercase tracking-widest">
              Hari
            </div>
          </div>

          <div className="text-3xl sm:text-6xl font-light text-emerald-400/40 -mt-5 select-none drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
            :
          </div>

          {/* Hours */}
          <div className="text-center min-w-[65px] sm:min-w-[90px]">
            <div className="text-5xl sm:text-7xl font-black text-emerald-400 mb-1 drop-shadow-[0_0_20px_rgba(52,211,153,0.75)] tracking-tight font-mono">
              {padZero(timeLeft.hours)}
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-300/80 font-bold uppercase tracking-widest">
              Jam
            </div>
          </div>

          <div className="text-3xl sm:text-6xl font-light text-emerald-400/40 -mt-5 select-none drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
            :
          </div>

          {/* Minutes */}
          <div className="text-center min-w-[65px] sm:min-w-[90px]">
            <div className="text-5xl sm:text-7xl font-black text-emerald-400 mb-1 drop-shadow-[0_0_20px_rgba(52,211,153,0.75)] tracking-tight font-mono">
              {padZero(timeLeft.minutes)}
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-300/80 font-bold uppercase tracking-widest">
              Menit
            </div>
          </div>

          <div className="text-3xl sm:text-6xl font-light text-emerald-400/40 -mt-5 select-none drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
            :
          </div>

          {/* Seconds */}
          <div className="text-center min-w-[65px] sm:min-w-[90px]">
            <div className="text-5xl sm:text-7xl font-black text-emerald-400 mb-1 drop-shadow-[0_0_25px_rgba(52,211,153,0.9)] tracking-tight font-mono animate-pulse">
              {padZero(timeLeft.seconds)}
            </div>
            <div className="text-[11px] sm:text-xs text-emerald-300/80 font-bold uppercase tracking-widest">
              Detik
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
