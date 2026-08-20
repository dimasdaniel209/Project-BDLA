import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioEngine } from '../utils/audio';

interface BalloonData {
  id: number;
  color: string;
  left: number; // percentage
  speed: number; // duration in seconds
  size: number; // in pixels
  delay: number;
  wobble: number;
}

const BALLOON_COLORS = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-indigo-500',
  'from-sky-400 to-blue-500',
  'from-amber-300 to-orange-400',
  'from-emerald-300 to-teal-500',
  'from-fuchsia-400 to-pink-600',
];

export const Balloons: React.FC = () => {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [popCount, setPopCount] = useState<number>(0);

  useEffect(() => {
    // Generate initial set of balloons
    const initialBalloons: BalloonData[] = Array.from({ length: 12 }).map((_, idx) => ({
      id: Date.now() + idx,
      color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
      left: Math.floor(Math.random() * 85) + 5,
      speed: Math.floor(Math.random() * 8) + 12, // 12s - 20s
      size: Math.floor(Math.random() * 20) + 48, // 48px - 68px
      delay: Math.random() * 5,
      wobble: Math.random() * 30 - 15,
    }));
    setBalloons(initialBalloons);
  }, []);

  const handlePop = (id: number) => {
    audioEngine.playPopSound();
    setPopCount((prev) => prev + 1);
    setBalloons((prev) => prev.filter((b) => b.id !== id));

    // Spawn a new balloon after a short delay so the sky stays lively
    setTimeout(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now(),
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
          left: Math.floor(Math.random() * 85) + 5,
          speed: Math.floor(Math.random() * 8) + 12,
          size: Math.floor(Math.random() * 20) + 48,
          delay: 0,
          wobble: Math.random() * 30 - 15,
        },
      ]);
    }, 1500);
  };

  const spawnMore = () => {
    const newB: BalloonData = {
      id: Date.now(),
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      left: Math.floor(Math.random() * 85) + 5,
      speed: Math.floor(Math.random() * 6) + 10,
      size: Math.floor(Math.random() * 20) + 52,
      delay: 0,
      wobble: Math.random() * 40 - 20,
    };
    setBalloons((prev) => [...prev, newB]);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      <AnimatePresence>
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: '110vh', x: 0, opacity: 0.9 }}
            animate={{
              y: '-20vh',
              x: [0, b.wobble, -b.wobble, 0],
              opacity: [0.8, 1, 1, 0.9],
            }}
            transition={{
              y: { duration: b.speed, repeat: Infinity, ease: 'linear', delay: b.delay },
              x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.15 } }}
            onClick={() => handlePop(b.id)}
            style={{ left: `${b.left}%` }}
            className="absolute cursor-pointer pointer-events-auto group select-none"
            title="Klik untuk meletuskan balon!"
          >
            <div className="relative flex flex-col items-center">
              {/* Balloon Body */}
              <div
                style={{ width: `${b.size}px`, height: `${b.size * 1.25}px` }}
                className={`bg-gradient-to-b ${b.color} rounded-t-full rounded-b-[45%] shadow-lg relative group-hover:scale-110 transition-transform duration-200 border border-white/30`}
              >
                {/* Shine highlight */}
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full rotate-[-25deg] blur-[0.5px]" />
              </div>
              {/* Balloon Knot */}
              <div className="-mt-1 w-2 h-2 bg-pink-600 rounded-sm" />
              {/* Balloon String */}
              <div className="w-[1.5px] h-16 bg-white/50 backdrop-blur-sm shadow-sm" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pop count badge if popped any */}
      {popCount > 0 && (
        <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white text-xs font-semibold shadow-md pointer-events-auto flex items-center gap-2">
          <span>🎈 Balon Meletus: {popCount}</span>
          <button
            onClick={spawnMore}
            className="ml-1 text-[10px] bg-white/30 hover:bg-white/40 px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors"
          >
            + Tambah
          </button>
        </div>
      )}
    </div>
  );
};
