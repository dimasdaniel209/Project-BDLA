import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Lock, Unlock, ChevronUp, ChevronDown, Sparkles, KeyRound } from 'lucide-react';
import { ThemeConfig } from '../types';
import { audioEngine } from '../utils/audio';

interface Props {
  theme: ThemeConfig;
  correctPasscode: string;
  passcodeHint: string;
  onOpenGiftBox: () => void;
}

export const GiftBoxTrigger: React.FC<Props> = ({
  correctPasscode,
  passcodeHint,
  onOpenGiftBox,
}) => {
  // Normalize passcode to array of digits/chars (default 4 digits if empty)
  const targetCode = (correctPasscode && correctPasscode.trim()) ? correctPasscode.trim() : '1234';
  const codeLength = targetCode.length;

  // Initialize dialed digits
  const [dials, setDials] = useState<string[]>(() => {
    return Array.from({ length: codeLength }, (_, i) => {
      const char = targetCode[i];
      return !isNaN(Number(char)) ? '0' : 'A';
    });
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Rotate a single tumbler dial
  const rotateDial = (index: number, direction: 'up' | 'down') => {
    audioEngine.playDialTickSound();
    setDials((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!isNaN(Number(current))) {
        let num = parseInt(current, 10);
        if (direction === 'up') {
          num = (num + 1) % 10;
        } else {
          num = (num - 1 + 10) % 10;
        }
        next[index] = num.toString();
      } else {
        // Character support (A-Z)
        let code = current.charCodeAt(0);
        if (direction === 'up') {
          code = code >= 90 ? 65 : code + 1;
        } else {
          code = code <= 65 ? 90 : code - 1;
        }
        next[index] = String.fromCharCode(code);
      }
      return next;
    });
    setErrorMsg('');
  };

  // Check if current combination matches
  const currentCombination = dials.join('');
  const isMatch = currentCombination.toLowerCase() === targetCode.toLowerCase();

  // Auto trigger unlock if match is reached via scrolling
  useEffect(() => {
    if (isMatch && !isUnlocked) {
      handleTriggerUnlock();
    }
  }, [dials, isMatch]);

  const handleTriggerUnlock = () => {
    setIsUnlocked(true);
    setErrorMsg('');
    audioEngine.playMagicalUnlockSound();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Delay opening modal slightly to enjoy the 3D box opening animation
    setTimeout(() => {
      onOpenGiftBox();
    }, 1100);
  };

  const handleManualUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatch) {
      handleTriggerUnlock();
    } else {
      audioEngine.playPopSound();
      setIsShaking(true);
      setErrorMsg('Kombinasi kunci belum tepat!');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none py-2">
      {/* Top Floating Glass Status Pill */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all shadow-lg backdrop-blur-xl ${
            isUnlocked || isMatch
              ? 'bg-emerald-400 text-emerald-950 border border-emerald-200 shadow-emerald-400/30'
              : 'bg-white/20 text-white border border-white/30 shadow-black/10'
          }`}
        >
          {isUnlocked || isMatch ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" />
              <span>Kunci Terbuka ✨</span>
            </>
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5 text-amber-200" />
              <span>Scroll Kunci Hadiah</span>
            </>
          )}
        </div>
      </div>
      {/* 3D PERSPECTIVE FLOATING GIFT BOX STAGE */}
      <div
        className="relative w-72 h-64 sm:w-80 sm:h-72 flex items-center justify-center cursor-pointer my-2 group select-none"
        onClick={() => {
          if (isMatch || isUnlocked) {
            onOpenGiftBox();
          }
        }}
      >
        {/* Soft Dynamic Ambient Floor Shadow (Gives realistic floating/flying effect) */}
        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
          {/* Main diffuse ground shadow that reacts to floating height */}
          <motion.div
            animate={{
              scale: [0.9, 1.12, 0.9],
              opacity: isUnlocked ? [0.65, 0.9, 0.65] : [0.4, 0.65, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
            className={`rounded-full blur-xl transition-colors duration-500 ${
              isUnlocked ? 'w-56 h-14 bg-amber-400/45' : 'w-48 h-12 bg-black/60'
            }`}
          />
          {/* Dark center contact shadow */}
          <motion.div
            animate={{
              scale: [0.85, 1.08, 0.85],
              opacity: [0.45, 0.75, 0.45],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
            className="absolute w-36 h-7 bg-black/75 rounded-full blur-md"
          />
        </div>

        {/* Glow Rayburst when Unlocked */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-tr from-amber-300/35 via-yellow-200/40 to-rose-300/35 rounded-full blur-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* 3D FLOATING GIFT BOX CONTAINER */}
        <motion.div
          animate={{
            y: [-12, 6, -12],
            rotate: [-1, 1, -1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
          }}
          className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 z-10"
        >
          {/* SVG 3D ISOMETRIC SOLID CLOSED GIFT BOX WITH LID & BOW */}
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
          >
            <defs>
              {/* --- Box Base Gradients --- */}
              {/* Front Face of Base */}
              <linearGradient id="boxBaseFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff525e" />
                <stop offset="60%" stopColor="#e52636" />
                <stop offset="100%" stopColor="#b8101e" />
              </linearGradient>

              {/* Right Face of Base (Shaded side) */}
              <linearGradient id="boxBaseRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cb1c2b" />
                <stop offset="60%" stopColor="#9c0e19" />
                <stop offset="100%" stopColor="#70060e" />
              </linearGradient>

              {/* --- Lid Gradients --- */}
              {/* Top Surface of Lid (Facing Up towards light) */}
              <linearGradient id="lidTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7b85" />
                <stop offset="50%" stopColor="#ff5a67" />
                <stop offset="100%" stopColor="#e83645" />
              </linearGradient>

              {/* Front Overhang Lip of Lid */}
              <linearGradient id="lidLipFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff5f6c" />
                <stop offset="100%" stopColor="#d91f2f" />
              </linearGradient>

              {/* Right Overhang Lip of Lid */}
              <linearGradient id="lidLipRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c51624" />
                <stop offset="100%" stopColor="#7a0710" />
              </linearGradient>

              {/* --- Ribbon Gradients (Pastel Pink Silk) --- */}
              {/* Ribbon on Top Surface (Diagonal 1: NW to SE) */}
              <linearGradient id="ribbonTop1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff5f8" />
                <stop offset="40%" stopColor="#ffd2dc" />
                <stop offset="100%" stopColor="#ffaec0" />
              </linearGradient>

              {/* Ribbon on Top Surface (Diagonal 2: NE to SW) */}
              <linearGradient id="ribbonTop2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffc5d3" />
                <stop offset="50%" stopColor="#ffdfe7" />
                <stop offset="100%" stopColor="#fff8fa" />
              </linearGradient>

              {/* Ribbon on Front Faces */}
              <linearGradient id="ribbonFrontFace" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff2f6" />
                <stop offset="35%" stopColor="#ffc7d5" />
                <stop offset="80%" stopColor="#ffaec1" />
                <stop offset="100%" stopColor="#f798ad" />
              </linearGradient>

              {/* Ribbon on Right Faces (In shadow) */}
              <linearGradient id="ribbonRightFace" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffaec1" />
                <stop offset="60%" stopColor="#ea899d" />
                <stop offset="100%" stopColor="#c76479" />
              </linearGradient>

              {/* Bow Left Loop */}
              <linearGradient id="bowLoopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ffe6ec" />
                <stop offset="75%" stopColor="#ffb5c6" />
                <stop offset="100%" stopColor="#f58ea5" />
              </linearGradient>

              {/* Bow Right Loop */}
              <linearGradient id="bowLoopRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffeef3" />
                <stop offset="40%" stopColor="#ffcad7" />
                <stop offset="100%" stopColor="#e5768e" />
              </linearGradient>

              {/* Bow Center Upright Loop */}
              <linearGradient id="bowLoopCenter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#ffd8e2" />
                <stop offset="100%" stopColor="#ffa0b5" />
              </linearGradient>

              {/* Inner dark shadow for loops */}
              <linearGradient id="bowInnerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c5445e" />
                <stop offset="100%" stopColor="#750f24" />
              </linearGradient>

              {/* Shadow filter for lid drop shadow */}
              <filter id="lidShadowFilter" x="-10%" y="-10%" width="120%" height="150%">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#400206" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* ========================================================
                1. LOWER BOX BASE (Left/Front & Right 3D faces)
               ======================================================== */}
            <g id="gift-box-base">
              {/* Front/Left Face */}
              {/* Vertices: Top-Left (60,150), Center-Top (150,195), Center-Bottom (150,265), Bottom-Left (60,220) */}
              <path
                d="M60,150 L150,195 L150,265 L60,220 Z"
                fill="url(#boxBaseFront)"
              />

              {/* Right Face (Receding into depth) */}
              {/* Vertices: Center-Top (150,195), Top-Right (240,150), Bottom-Right (240,220), Center-Bottom (150,265) */}
              <path
                d="M150,195 L240,150 L240,220 L150,265 Z"
                fill="url(#boxBaseRight)"
              />

              {/* Base Front Vertical Ribbon */}
              <path
                d="M95,167 L115,177 L115,247 L95,237 Z"
                fill="url(#ribbonFrontFace)"
              />
              {/* Specular highlight on front ribbon */}
              <path
                d="M98,169 L98,238"
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Base Right Vertical Ribbon */}
              <path
                d="M185,177 L205,167 L205,237 L185,247 Z"
                fill="url(#ribbonRightFace)"
              />

              {/* Soft Center Edge Crease Highlight */}
              <path
                d="M150,195 L150,265"
                stroke="#ffa8b3"
                strokeWidth="1.5"
                opacity="0.4"
              />
            </g>

            {/* ========================================================
                2. SOLID CLOSED BOX LID (Overhanging top with Ribbon & Bow)
               ======================================================== */}
            <g id="gift-box-lid" filter="url(#lidShadowFilter)">
              {/* --- Lid Front Overhang Lip --- */}
              {/* Slightly wider than base: X from 52 to 150, Y from 126 to 175 */}
              <path
                d="M52,130 L150,178 L150,198 L52,150 Z"
                fill="url(#lidLipFront)"
              />

              {/* --- Lid Right Overhang Lip --- */}
              {/* X from 150 to 248, Y from 178 to 130 */}
              <path
                d="M150,178 L248,130 L248,150 L150,198 Z"
                fill="url(#lidLipRight)"
              />

              {/* --- Lid Lip Ribbons --- */}
              {/* Front Lip Ribbon */}
              <path
                d="M91,149 L111,159 L111,179 L91,169 Z"
                fill="url(#ribbonFrontFace)"
              />
              <path
                d="M93,150 L93,168"
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.7"
              />

              {/* Right Lip Ribbon */}
              <path
                d="M189,159 L209,149 L209,169 L189,179 Z"
                fill="url(#ribbonRightFace)"
              />

              {/* --- TOP SURFACE OF THE LID (Fully Closed Diamond/Rhombus) --- */}
              {/* Vertices: Top (150,82), Right (248,130), Bottom (150,178), Left (52,130) */}
              <path
                d="M150,82 L248,130 L150,178 L52,130 Z"
                fill="url(#lidTopFace)"
                stroke="#ff8f98"
                strokeWidth="1"
              />

              {/* --- RIBBON CROSS (+) ON TOP SURFACE --- */}
              {/* Ribbon Stripe 1: Top-Left to Bottom-Right (NW to SE) */}
              <path
                d="M91,101 L111,111 L209,159 L189,149 Z"
                fill="url(#ribbonTop1)"
              />

              {/* Ribbon Stripe 2: Top-Right to Bottom-Left (NE to SW) */}
              <path
                d="M189,111 L209,101 L111,149 L91,159 Z"
                fill="url(#ribbonTop2)"
              />

              {/* Center Ribbon Crossing Highlight */}
              <path
                d="M140,125 L160,135 L140,145 L120,135 Z"
                fill="#ffffff"
                opacity="0.25"
              />
            </g>

            {/* ========================================================
                3. LUSH 3D SATIN RIBBON BOW & KNOT (Centered on Top Lid)
               ======================================================== */}
            <g id="gift-box-bow" transform="translate(150, 130)">
              {/* --- Left Bow Loop (Curving out to the left) --- */}
              <g id="bow-left-wing">
                {/* Outer loop shape */}
                <path
                  d="M-5,-5 C-25,-32 -60,-22 -68,-2 C-74,16 -50,28 -28,16 C-16,10 -8,2 -5,-5 Z"
                  fill="url(#bowLoopLeft)"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                {/* Inner shadow hole */}
                <path
                  d="M-45,-4 C-52,-10 -58,-6 -60,4 C-62,14 -48,18 -40,10 C-36,6 -38,-2 -45,-4 Z"
                  fill="url(#bowInnerShadow)"
                />
                {/* Specular gloss streak */}
                <path
                  d="M-22,-22 C-45,-18 -58,-4 -62,8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
              </g>

              {/* --- Right Bow Loop (Curving out to the right) --- */}
              <g id="bow-right-wing">
                {/* Outer loop shape */}
                <path
                  d="M5,-5 C25,-32 60,-22 68,-2 C74,16 50,28 28,16 C16,10 8,2 5,-5 Z"
                  fill="url(#bowLoopRight)"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                {/* Inner shadow hole */}
                <path
                  d="M45,-4 C52,-10 58,-6 60,4 C62,14 48,18 40,10 C36,6 38,-2 45,-4 Z"
                  fill="url(#bowInnerShadow)"
                />
                {/* Specular gloss streak */}
                <path
                  d="M22,-22 C45,-18 58,-4 62,8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </g>

              {/* --- Center Upright Loop (Puffy vertical top loop) --- */}
              <g id="bow-center-loop">
                <path
                  d="M-14,-6 C-18,-28 -14,-46 0,-48 C14,-46 18,-28 14,-6 C8,0 -8,0 -14,-6 Z"
                  fill="url(#bowLoopCenter)"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                {/* Center loop inner hole */}
                <path
                  d="M-6,-16 C-8,-28 -6,-38 0,-40 C6,-38 8,-28 6,-16 C3,-12 -3,-12 -6,-16 Z"
                  fill="url(#bowInnerShadow)"
                />
                {/* Center loop highlight */}
                <path
                  d="M-13,-18 C-14,-34 -8,-44 0,-46 C8,-44 14,-34 13,-18"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
              </g>

              {/* --- Flowing Ribbon Tails (Curving down onto the lid) --- */}
              {/* Left Ribbon Tail */}
              <path
                d="M-10,4 C-24,18 -36,26 -44,38 L-32,40 C-24,30 -14,20 -4,12 Z"
                fill="url(#ribbonTop1)"
                stroke="#ffffff"
                strokeWidth="0.8"
              />
              {/* Right Ribbon Tail */}
              <path
                d="M10,4 C24,18 36,26 44,38 L32,40 C24,30 14,20 4,12 Z"
                fill="url(#ribbonTop2)"
                stroke="#ffffff"
                strokeWidth="0.8"
              />

              {/* --- Center Ribbon Knot (Smooth rounded pillow) --- */}
              <g id="bow-center-knot">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="14"
                  ry="10"
                  fill="url(#ribbonFrontFace)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Knot crease */}
                <path
                  d="M-6,2 C0,5 0,5 6,2"
                  stroke="#e87088"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </g>
          </svg>
        </motion.div>
      </div>

      {/* FROSTED GLASS SCROLL COMBINATION LOCK (Clean Glass Effect) */}
      <div
        className={`w-full max-w-xs mt-2 flex flex-col items-center ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <p className="text-xs text-white/90 font-semibold text-center mb-2.5 drop-shadow-sm">
          Scroll / geser angka untuk membuka:
        </p>

        {/* Frosted Glass Dials Floating Bar */}
        <div className="bg-white/20 backdrop-blur-2xl p-2.5 sm:p-3 rounded-2xl border border-white/30 shadow-xl flex items-center justify-center gap-2 w-full">
          {dials.map((digit, idx) => {
            const isDigitNum = !isNaN(Number(digit));
            const num = isDigitNum ? parseInt(digit, 10) : digit.charCodeAt(0);
            
            // Previous & Next Values for 3D Roller illusion
            const prevVal = isDigitNum
              ? ((num - 1 + 10) % 10).toString()
              : String.fromCharCode(num <= 65 ? 90 : num - 1);
            const nextVal = isDigitNum
              ? ((num + 1) % 10).toString()
              : String.fromCharCode(num >= 90 ? 65 : num + 1);

            return (
              <GlassTumblerDial
                key={idx}
                current={digit}
                prevVal={prevVal}
                nextVal={nextVal}
                onScrollUp={() => rotateDial(idx, 'up')}
                onScrollDown={() => rotateDial(idx, 'down')}
              />
            );
          })}
        </div>

        {/* Glass Action Button */}
        <form onSubmit={handleManualUnlock} className="w-full mt-3">
          <button
            type="submit"
            disabled={isUnlocked}
            className={`w-full py-3 rounded-2xl font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isMatch || isUnlocked
                ? 'bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 text-emerald-950 border border-white shadow-emerald-500/30'
                : 'bg-white/30 hover:bg-white/40 text-white backdrop-blur-xl border border-white/40 shadow-black/10'
            }`}
          >
            {isUnlocked ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-950 animate-spin" /> Membuka Hadiah...
              </>
            ) : isMatch ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-950 stroke-[2.5]" /> Buka Kotak Hadiah ✨
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white" /> Periksa Kunci
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <p className="text-white text-xs font-semibold text-center mt-2.5 bg-rose-500/80 backdrop-blur-md py-1.5 px-3 rounded-xl border border-white/30 shadow-md animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Hint Toggle */}
        {passcodeHint && (
          <div className="text-center mt-2.5">
            {showHint ? (
              <p className="text-white text-xs italic bg-white/20 backdrop-blur-xl py-1.5 px-3 rounded-xl border border-white/30 inline-block shadow-md">
                💡 Petunjuk: {passcodeHint}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-white/80 hover:text-white text-xs underline underline-offset-4 transition-colors cursor-pointer"
              >
                Butuh petunjuk kode?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// INDIVIDUAL FROSTED GLASS ROTARY TUMBLER COMPONENT
interface TumblerProps {
  current: string;
  prevVal: string;
  nextVal: string;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

const GlassTumblerDial: React.FC<TumblerProps> = ({
  current,
  prevVal,
  nextVal,
  onScrollUp,
  onScrollDown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Wheel listener
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      onScrollUp();
    } else if (e.deltaY > 0) {
      onScrollDown();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;

    if (Math.abs(diff) > 20) {
      if (diff > 0) {
        onScrollUp();
      } else {
        onScrollDown();
      }
      touchStartY.current = currentY;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col items-center bg-white/15 backdrop-blur-md rounded-xl border border-white/30 p-1 select-none flex-1 max-w-[62px] shadow-sm group hover:bg-white/25 hover:border-white/50 transition-all"
    >
      {/* Up Stepper Button */}
      <button
        type="button"
        onClick={onScrollUp}
        className="w-full py-0.5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 rounded transition-colors active:scale-90 cursor-pointer"
        title="Scroll Up"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>

      {/* 3D Drum Dial Viewing Slot in Glass */}
      <div className="relative w-full h-14 overflow-hidden my-0.5 rounded-lg bg-emerald-950/20 backdrop-blur-sm flex flex-col items-center justify-center border border-white/20">
        {/* Upper Preview Value */}
        <span className="text-[10px] text-white/40 font-mono absolute top-0.5 transform scale-75 pointer-events-none">
          {prevVal}
        </span>

        {/* Central Active Dial Value in Golden Glass Ring */}
        <div className="w-full h-8 flex items-center justify-center bg-white/30 backdrop-blur-md border-y border-white/50 rounded shadow-inner">
          <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            {current}
          </span>
        </div>

        {/* Lower Preview Value */}
        <span className="text-[10px] text-white/40 font-mono absolute bottom-0.5 transform scale-75 pointer-events-none">
          {nextVal}
        </span>

        {/* Reflection Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none rounded-lg" />
      </div>

      {/* Down Stepper Button */}
      <button
        type="button"
        onClick={onScrollDown}
        className="w-full py-0.5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 rounded transition-colors active:scale-90 cursor-pointer"
        title="Scroll Down"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
