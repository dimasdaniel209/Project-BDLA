import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  MailOpen,
  ZoomIn,
  MessageCircleHeart,
  Flame,
  Check,
} from 'lucide-react';
import { BirthdayConfig } from '../types';
import { audioEngine } from '../utils/audio';
import { formatGoogleDriveImageUrl } from '../utils/urlHelpers';

interface Props {
  config: BirthdayConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftBoxModal: React.FC<Props> = ({ config, isOpen, onClose }) => {
  const defaultWish =
    config.wishText ||
    `Semoga di usia ke-${config.age || 24} ini selalu dilimpahi kesehatan, kebahagiaan sejati, cinta tulus, dan tercapai segala cita-cita indahmu ✨`;

  const [wishText, setWishText] = useState(defaultWish);
  const [isEditingWish, setIsEditingWish] = useState(false);
  const [tempWish, setTempWish] = useState(defaultWish);
  const [flightKey, setFlightKey] = useState(1);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [loveCount, setLoveCount] = useState(24);

  const letterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger celebration confetti & flight sound on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      triggerLaunchSequence();
      setIsLetterOpen(false);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const triggerLaunchSequence = () => {
    setFlightKey((prev) => prev + 1);
    audioEngine.playMagicalUnlockSound();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ffd166', '#ff758f', '#ffe8d6', '#fcd34d'],
      });
    }, 350);
  };

  // Handle keyboard shortcuts (Escape to close lightbox / modal, Arrow keys for photos)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        } else if (isEditingWish) {
          setIsEditingWish(false);
        } else {
          onClose();
        }
      } else if (selectedPhotoIndex !== null && config.memories.length > 0) {
        if (e.key === 'ArrowRight') {
          setSelectedPhotoIndex((prev) =>
            prev !== null ? (prev + 1) % config.memories.length : 0
          );
        } else if (e.key === 'ArrowLeft') {
          setSelectedPhotoIndex((prev) =>
            prev !== null
              ? (prev - 1 + config.memories.length) % config.memories.length
              : 0
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedPhotoIndex, isEditingWish, config.memories.length, onClose]);

  const handleSaveWish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalWish = tempWish.trim() || defaultWish;
    setWishText(finalWish);
    setIsEditingWish(false);
    audioEngine.playPopSound();
    triggerLaunchSequence();
  };

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
    audioEngine.playMagicalUnlockSound();
    confetti({
      particleCount: 45,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166', '#ffffff'],
    });

    setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const handleCloseLetter = () => {
    setIsLetterOpen(false);
  };

  const handleSendLove = () => {
    setLoveCount((prev) => prev + 1);
    audioEngine.playPopSound();
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166'],
    });
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isOpen) return null;

  const memories = config.memories || [];
  const selectedPhoto =
    selectedPhotoIndex !== null && memories[selectedPhotoIndex]
      ? memories[selectedPhotoIndex]
      : null;

  return (
    <AnimatePresence>
      <motion.div
        key="fullscreen-lantern-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        ref={containerRef}
        className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#01140e] via-[#021f16] to-[#010d08] text-white selection:bg-emerald-500 selection:text-black"
      >
        {/* =========================================================================
            BACKGROUND: Starry Night Sky, Warm Cosmic Glow & Floating Embers
           ========================================================================= */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[520px] bg-gradient-to-b from-amber-500/15 via-emerald-500/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

          {/* Golden Embers */}
          <div className="absolute top-12 left-10 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
          <div className="absolute top-24 right-20 w-2 h-2 bg-amber-200 rounded-full animate-pulse opacity-80" />
          <div className="absolute top-64 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-ping opacity-70" />
          <div className="absolute top-2/3 left-16 w-1 h-1 bg-amber-300 rounded-full animate-pulse opacity-90" />
          <div className="absolute top-3/4 right-12 w-2 h-2 bg-emerald-200 rounded-full animate-pulse opacity-70" />
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
        </div>

        {/* =========================================================================
            MINIMAL FLOATING CLOSE BUTTON (NO NAVBAR)
           ========================================================================= */}
        <button
          onClick={onClose}
          className="fixed top-5 right-5 sm:top-7 sm:right-7 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-950/80 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 hover:border-emerald-400 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-95"
          title="Tutup & Kembali"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            MAIN STREAM CONTAINER
           ========================================================================= */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-32 flex flex-col items-center">
          {/* -------------------------------------------------------------------
              1. THE SKY LANTERN (ANIMASI TERBANG DARI BAWAH KE ATAS)
             ------------------------------------------------------------------- */}
          <motion.div
            key={`lantern-launch-${flightKey}`}
            initial={{ y: 850, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 2.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col items-center mb-4 z-20"
          >
            {/* Trailing golden glow */}
            <div className="absolute -inset-10 bg-gradient-to-t from-amber-500/40 via-orange-500/30 to-yellow-300/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Continuous Floating & Gentle Wind Sway */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [-2, 2, -2],
                x: [-4, 4, -4],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
              }}
              className="relative flex flex-col items-center"
            >
              {/* Sky Lantern Main Body */}
              <div className="relative w-48 h-60 sm:w-56 sm:h-68 bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 rounded-t-[60px] rounded-b-2xl border-2 border-yellow-100 shadow-[0_0_70px_rgba(251,191,36,0.95)] flex flex-col items-center justify-between p-4 z-10 backdrop-blur-sm">
                {/* Top Rim */}
                <div className="w-20 h-2.5 bg-yellow-100/90 rounded-full shadow-sm border border-white/60" />

                {/* --- TULISAN HARAPAN PADA BADAN LAMPION (KLIK UNTUK EDIT) --- */}
                <div
                  onClick={() => {
                    setTempWish(wishText);
                    setIsEditingWish(true);
                  }}
                  className="text-center w-full bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-yellow-200/40 shadow-inner group cursor-pointer hover:bg-black/55 transition-all"
                  title="Klik untuk mengubah tulisan harapan"
                >
                  <p className="text-xs sm:text-sm text-yellow-100 font-serif italic line-clamp-4 leading-snug drop-shadow">
                    "{wishText}"
                  </p>

                  <span className="text-[11px] font-bold text-amber-200 block mt-2">
                    ❤️ {config.recipientName}
                  </span>
                </div>

                {/* Lantern Flame Core & Bottom Burner */}
                <div className="relative flex flex-col items-center">
                  <div className="w-6 h-9 bg-gradient-to-t from-orange-600 via-amber-300 to-yellow-100 rounded-full animate-bounce shadow-[0_0_24px_#fff]" />
                  <div className="w-16 h-4 bg-amber-950 rounded-full border-2 border-yellow-200 flex items-center justify-center -mt-1 shadow-lg">
                    <div className="w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-90" />
                  </div>
                </div>
              </div>

              {/* Lantern Hanging Cord Tether Node */}
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 border-2 border-white shadow-md -mt-1 z-20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-amber-950 rounded-full" />
              </div>
            </motion.div>
          </motion.div>

          {/* -------------------------------------------------------------------
              2. ALTERNATING PHOTOS STREAM (BERSUSUN SELANG-SELING KIRI - KANAN)
             ------------------------------------------------------------------- */}
          <div className="relative w-full flex flex-col items-center">
            {/* Central Vertical Glowing Rope */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.85)] z-0 rounded-full" />

            {/* Staggered Memory Photos along Rope */}
            <div className="w-full space-y-12 sm:space-y-16 pt-6 pb-12 z-10">
              {memories.map((item, index) => {
                const isLeft = index % 2 === 0;
                const tiltAngle = isLeft ? -3 : 3;

                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative w-full flex items-center"
                  >
                    {/* Golden Anchor Knot at Central Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500 border-2 border-white shadow-lg z-20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-amber-900 rounded-full" />
                    </div>

                    {/* Horizontal Branch Cord connecting Center to Photo Card */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-300 to-yellow-400 shadow-[0_0_8px_#fde047] z-10 ${
                        isLeft
                          ? 'right-1/2 w-8 sm:w-16'
                          : 'left-1/2 w-8 sm:w-16'
                      }`}
                    />

                    {/* Polaroid Photo Card on Left or Right Side */}
                    <div
                      className={`w-full flex ${
                        isLeft
                          ? 'justify-start pr-[calc(50%+1.5rem)] sm:pr-[calc(50%+3.5rem)]'
                          : 'justify-end pl-[calc(50%+1.5rem)] sm:pl-[calc(50%+3.5rem)]'
                      }`}
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.06,
                          rotate: 0,
                          zIndex: 30,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPhotoIndex(index)}
                        style={{ transform: `rotate(${tiltAngle}deg)` }}
                        className="group relative bg-white p-2.5 sm:p-3.5 pb-4 rounded-2xl shadow-2xl border-2 border-white/80 cursor-pointer text-slate-900 w-full max-w-[240px] sm:max-w-[280px] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(251,191,36,0.35)] select-none"
                      >
                        {/* Golden Pin Clip on the card corner */}
                        <div
                          className={`absolute -top-2 ${
                            isLeft ? '-right-1.5' : '-left-1.5'
                          } w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border border-white shadow-md z-20 flex items-center justify-center`}
                        >
                          <div className="w-1 h-1 bg-amber-950 rounded-full" />
                        </div>

                        {/* Image Frame */}
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative mb-2.5">
                          <img
                            src={formatGoogleDriveImageUrl(item.imageUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />

                          {/* Hover Zoom Badge */}
                          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white/90 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <ZoomIn className="w-3.5 h-3.5 text-rose-500" /> Perbesar
                            </span>
                          </div>
                        </div>

                        {/* Caption & Date */}
                        <div className="px-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {item.title}
                            </h3>
                            <span className="text-[10px] font-mono font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                              {item.date}
                            </span>
                          </div>
                          {item.caption && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Central Terminal Ring connecting to Envelope */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 border-2 border-white shadow-xl z-20 flex items-center justify-center -mb-2">
              <div className="w-1.5 h-1.5 bg-rose-950 rounded-full" />
            </div>
          </div>

          {/* -------------------------------------------------------------------
              3. HANGING LETTER (DI UJUNG TALI SETELAH FOTO TERAKHIR)
             ------------------------------------------------------------------- */}
          <div ref={letterRef} className="w-full max-w-xl flex flex-col items-center mt-6 z-20">
            <AnimatePresence mode="wait">
              {!isLetterOpen ? (
                /* --- WAX-SEALED HANGING ENVELOPE --- */
                <motion.div
                  key="sealed-hanging-envelope"
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  onClick={handleOpenLetter}
                  className="w-full bg-gradient-to-br from-rose-950/80 via-rose-900/80 to-slate-950/90 border-2 border-rose-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative cursor-pointer group hover:border-rose-300 transition-all hover:scale-[1.02] text-center"
                >
                  {/* Glowing Rose Aura */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/25 via-pink-500/20 to-amber-500/25 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    {/* Hanging String Anchor at Top of Envelope */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="w-0.5 h-7 bg-gradient-to-b from-amber-400 to-rose-400 shadow-[0_0_8px_#fde047]" />
                      <div className="w-3 h-3 rounded-full bg-rose-400 border border-white shadow-sm" />
                    </div>

                    {/* Wax Seal with Beating Heart */}
                    <div className="relative pt-2">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 border-2 border-white/80 shadow-[0_0_25px_rgba(244,63,94,0.6)] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <Heart className="w-9 h-9 fill-white animate-pulse" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                        Untuk: {config.recipientName} ❤️
                      </h3>
                      <p className="text-white/70 text-xs sm:text-sm mt-1">
                        Dari: <span className="font-semibold text-rose-200">{config.senderName}</span>
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-rose-500/40 border border-white/40 group-hover:shadow-rose-500/70 transition-all cursor-pointer"
                      >
                        <MailOpen className="w-4 h-4" />
                        Buka Surat Cinta & Pesan Spesial ✉️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* --- UNFURLED PARCHMENT LOVE LETTER (SPECIAL MESSAGE) --- */
                <motion.div
                  key="opened-parchment-letter"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full bg-[#fdfbf7] text-slate-900 rounded-3xl p-6 sm:p-9 shadow-2xl border-4 border-[#eedec0] relative overflow-hidden font-serif"
                >
                  {/* Decorative Vintage Ribbon Top */}
                  <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400" />

                  {/* Close / Fold Button */}
                  <button
                    onClick={handleCloseLetter}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-200/80 hover:bg-rose-100 text-slate-700 hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Lipat kembali surat"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Letter Header */}
                  <div className="border-b-2 border-rose-200/70 pb-4 mb-5 pr-8">
                    <div className="flex items-center gap-2 text-rose-600 mb-1">
                      <MessageCircleHeart className="w-5 h-5 fill-rose-100" />
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-rose-500">
                        Pesan Spesial Ulang Tahun
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                      Dear {config.recipientName},
                    </h2>
                    {config.subMessage && (
                      <p className="text-xs sm:text-sm text-slate-600 italic mt-1 font-sans">
                        {config.subMessage}
                      </p>
                    )}
                  </div>

                  {/* SCROLLABLE Special Message Body */}
                  <div className="max-h-[50vh] sm:max-h-[420px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-rose-400/60 scrollbar-track-rose-100/30 mb-6">
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif italic selection:bg-rose-200">
                      {config.specialMessage}
                    </p>
                  </div>

                  {/* Letter Footer: Signoff, Heart Reactions, Actions */}
                  <div className="pt-4 border-t-2 border-rose-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                    <div className="text-center sm:text-left">
                      <span className="text-xs text-slate-500 block">Dengan segenap cinta,</span>
                      <span className="text-base font-bold text-rose-600">{config.senderName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSendLove}
                        className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 transition-all cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Kirim Cinta ({loveCount})</span>
                      </button>

                      <button
                        onClick={handleCloseLetter}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-3.5 py-2 rounded-full text-xs transition-colors cursor-pointer"
                      >
                        Lipat Surat
                      </button>

                      <button
                        onClick={scrollToTop}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium p-2 rounded-full text-xs transition-colors cursor-pointer"
                        title="Kembali ke atas lampion"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* =========================================================================
            WISH EDITING MODAL (TULIS / UBAH HARAPAN)
           ========================================================================= */}
        <AnimatePresence>
          {isEditingWish && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingWish(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#031d14] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-amber-300 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">
                        Tuliskan Doa & Harapan di Lampion
                      </h3>
                      <p className="text-xs text-emerald-300/70">
                        Tulisan ini akan tertera pada lampion saat terbang ke angkasa
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingWish(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveWish} className="space-y-4">
                  <div>
                    <textarea
                      rows={4}
                      value={tempWish}
                      onChange={(e) => setTempWish(e.target.value)}
                      placeholder="Tuliskan doa & harapan terindah untuk ulang tahun ini..."
                      className="w-full bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 transition-all resize-none shadow-inner font-serif italic"
                    />
                  </div>

                  {/* Preset Wish Inspiration Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-emerald-300/80 font-semibold block">
                      💡 Inspirasi Harapan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setTempWish(
                            `Semoga di usia ke-${config.age || 24} ini selalu sehat, panjang umur, bahagia, dan semua mimpi indah tercapai! ✨`
                          )
                        }
                        className="text-[11px] bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-amber-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        🌟 Sehat & Bahagia Selalu
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTempWish(
                            'Semoga langkahmu selalu dimudahkan, penuh keberkahan, dikelilingi orang-orang tulus, dan makin bersinar! 💖'
                          )
                        }
                        className="text-[11px] bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        🌸 Penuh Berkah & Cinta
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-500/20">
                    <button
                      type="button"
                      onClick={() => setIsEditingWish(false)}
                      className="bg-white/10 hover:bg-white/20 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Pasang Harapan & Terbangkan ✨
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            LIGHTBOX ZOOM / PREVIEW MODAL: High-craft Photo Inspector
           ========================================================================= */}
        <AnimatePresence>
          {selectedPhoto && selectedPhotoIndex !== null && (
            <motion.div
              key="lightbox-zoom-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhotoIndex(null)}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            >
              {/* Previous Photo Button */}
              {memories.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(
                      (selectedPhotoIndex - 1 + memories.length) % memories.length
                    );
                  }}
                  className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Photo Button */}
              {memories.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((selectedPhotoIndex + 1) % memories.length);
                  }}
                  className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Lightbox Content Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-3xl w-full bg-[#031d14]/95 border border-emerald-500/40 rounded-3xl p-4 sm:p-6 text-white shadow-2xl backdrop-blur-2xl flex flex-col max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Lightbox Photo Image */}
                <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-2xl bg-black/50 mb-4">
                  <img
                    src={formatGoogleDriveImageUrl(selectedPhoto.imageUrl)}
                    alt={selectedPhoto.title}
                    className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details Footer */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-extrabold text-lg sm:text-xl text-amber-200">
                      {selectedPhoto.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2.5 py-0.5 rounded-full font-mono">
                        {selectedPhoto.date}
                      </span>
                      <span className="text-xs text-white/50 font-mono">
                        {selectedPhotoIndex + 1}/{memories.length}
                      </span>
                    </div>
                  </div>
                  {selectedPhoto.caption && (
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      {selectedPhoto.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
