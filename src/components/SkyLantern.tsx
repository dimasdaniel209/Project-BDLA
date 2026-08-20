import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Send,
  RotateCcw,
  Sparkles,
  Heart,
  Mail,
  MailOpen,
  Eye,
  X,
  ChevronDown,
  MessageCircleHeart,
  Image as ImageIcon,
} from 'lucide-react';
import { MemoryItem } from '../types';
import { audioEngine } from '../utils/audio';
import { formatGoogleDriveImageUrl } from '../utils/urlHelpers';

interface Props {
  recipientName: string;
  senderName: string;
  age?: number;
  memories: MemoryItem[];
  specialMessage: string;
  subMessage?: string;
  onSelectPhoto?: (photo: MemoryItem) => void;
}

export const SkyLantern: React.FC<Props> = ({
  recipientName,
  senderName,
  age = 24,
  memories = [],
  specialMessage,
  subMessage,
  onSelectPhoto,
}) => {
  const [stage, setStage] = useState<'wish' | 'ignited' | 'flying'>('wish');
  const [wishText, setWishText] = useState('');
  const [submittedWish, setSubmittedWish] = useState('');
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [activePhotoZoom, setActivePhotoZoom] = useState<MemoryItem | null>(null);
  const [loveCount, setLoveCount] = useState(24);

  const handleIgnite = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalWish =
      wishText.trim() ||
      'Semoga di usia baru ini senantiasa dipenuhi berkah, kebahagiaan sejati, cinta, dan semua impian indah tercapai.';
    setSubmittedWish(finalWish);
    setStage('ignited');
    audioEngine.playMagicalUnlockSound();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleFly = () => {
    setStage('flying');
    setIsLetterOpen(false);
    audioEngine.playMagicalUnlockSound();
    confetti({
      particleCount: 60,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
    audioEngine.playMagicalUnlockSound();
    confetti({
      particleCount: 45,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const handleReset = () => {
    setStage('wish');
    setWishText('');
    setSubmittedWish('');
    setIsLetterOpen(false);
  };

  const handleSendLove = () => {
    setLoveCount((prev) => prev + 1);
    audioEngine.playPopSound();
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166'],
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[500px] flex flex-col justify-between p-4 sm:p-7 bg-slate-950/70 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] border border-amber-300/30 shadow-2xl relative overflow-hidden text-white">
      {/* Dynamic Starry Sky Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-ping opacity-75" />
        <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse opacity-80" />
        <div className="absolute top-28 left-1/4 w-1 h-1 bg-yellow-100 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-70" />
        <div className="absolute top-48 right-10 w-1 h-1 bg-amber-300 rounded-full animate-pulse opacity-90" />
        <div className="absolute top-1/2 left-6 w-1.5 h-1.5 bg-amber-100 rounded-full animate-pulse opacity-70" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Header Section */}
      <div className="text-center z-10 space-y-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {stage === 'wish' && 'Langkah 1: Tuliskan Harapan'}
          {stage === 'ignited' && 'Langkah 2: Siap Menerbangkan'}
          {stage === 'flying' && 'Lampion Membawa Kenangan & Surat'}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {stage === 'wish' && 'Lampion Kenangan & Surat Cinta'}
          {stage === 'ignited' && 'Lampion Menyala Hangat 🔥'}
          {stage === 'flying' && 'Lampion Mengangkasa di Langit Malam ✨'}
        </h3>
        <p className="text-white/70 text-xs sm:text-sm max-w-md mx-auto">
          {stage === 'wish' &&
            'Tuliskan doa & harapanmu. Lampion ini akan membawa untaian foto kenangan terindah dan surat rahasia.'}
          {stage === 'ignited' &&
            'Api harapan telah menyala! Tekan tombol di bawah untuk menerbangkan lampion bersama foto dan surat.'}
          {stage === 'flying' &&
            'Lihat foto-foto yang melayang bersama lampion dan ketuk surat di bawahnya untuk membaca pesan spesial.'}
        </p>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="relative my-3 flex-1 flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {/* ========================================================
              STAGE 1: WISH PREPARATION
             ======================================================== */}
          {stage === 'wish' && (
            <motion.div
              key="stage-wish"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center space-y-5"
            >
              {/* Unlit Lantern Graphic */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-32 h-40 sm:w-36 sm:h-44 bg-gradient-to-b from-amber-800/70 via-orange-900/80 to-rose-950/90 rounded-t-[44px] rounded-b-2xl border-2 border-amber-400/40 shadow-xl flex flex-col items-center justify-between p-3.5 backdrop-blur-sm">
                  {/* Subtle ribbing lines */}
                  <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-25">
                    <div className="w-0.5 h-full bg-amber-300" />
                    <div className="w-0.5 h-full bg-amber-300" />
                    <div className="w-0.5 h-full bg-amber-300" />
                  </div>
                  <div className="w-10 h-2 bg-amber-300/40 rounded-full border border-amber-300/50" />
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase block">
                      {recipientName}
                    </span>
                    <span className="text-[10px] text-amber-300/70 font-mono">Ulang Tahun Ke-{age}</span>
                  </div>
                  <div className="w-12 h-3.5 bg-amber-950 rounded-full border border-amber-400/50 flex items-center justify-center shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                  </div>
                </div>

                {/* Preview indicator of attached memories & envelope */}
                <div className="flex flex-col items-center -mt-1">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400/60 to-amber-300/30" />
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] text-amber-200">
                    <ImageIcon className="w-3 h-3" />
                    <span>{memories.length} Foto Kenangan</span>
                    <span className="text-white/40">•</span>
                    <Mail className="w-3 h-3 text-rose-300" />
                    <span>1 Surat Spesial</span>
                  </div>
                </div>
              </div>

              {/* Wish Input Form */}
              <form onSubmit={handleIgnite} className="w-full max-w-lg space-y-3">
                <div className="relative">
                  <textarea
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Tuliskan doa & harapan terindah untuk ulang tahun ini..."
                    rows={2}
                    className="w-full bg-slate-900/90 border border-amber-400/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="flex justify-center pt-1">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95 border border-amber-300/40 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 fill-amber-200 text-amber-100 animate-pulse" />
                    Nyalakan & Siapkan Lampion
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ========================================================
              STAGE 2: LANTERN IGNITED (Glow + Attached Photos & Envelope)
             ======================================================== */}
          {stage === 'ignited' && (
            <motion.div
              key="stage-ignited"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center space-y-4"
            >
              {/* Glowing Warm Floating Lantern */}
              <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -inset-4 bg-orange-500/30 rounded-full blur-3xl animate-ping opacity-35" />

                <motion.div
                  animate={{ y: [-4, 4, -4], rotate: [-1, 1, -1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="relative w-32 h-44 sm:w-36 sm:h-48 bg-gradient-to-b from-amber-300 via-amber-500 to-orange-600 rounded-t-[48px] rounded-b-2xl border-2 border-yellow-200 shadow-[0_0_45px_rgba(251,191,36,0.85)] flex flex-col items-center justify-between p-3.5 z-10"
                >
                  <div className="w-12 h-2.5 bg-yellow-100/90 rounded-full border border-white/60 shadow-sm" />

                  <div className="text-center max-w-[120px] bg-black/25 backdrop-blur-sm p-2 rounded-xl border border-yellow-200/40 shadow-inner">
                    <p className="text-[10px] sm:text-xs text-yellow-100 font-serif italic line-clamp-3 leading-tight">
                      "{submittedWish}"
                    </p>
                    <span className="text-[9px] text-amber-200 font-bold block mt-1">
                      ❤️ {recipientName}
                    </span>
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="w-5 h-8 bg-gradient-to-t from-orange-600 via-amber-300 to-yellow-100 rounded-full animate-bounce shadow-[0_0_18px_#fde047]" />
                    <div className="w-12 h-3.5 bg-amber-950 rounded-full border border-yellow-300 flex items-center justify-center -mt-1 shadow-md">
                      <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-90" />
                    </div>
                  </div>
                </motion.div>

                {/* Trailing golden thread preview */}
                <div className="flex flex-col items-center -mt-1">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-amber-300 to-amber-200/40" />
                  <div className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-medium flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Membawa {memories.length} Foto & Surat Rahasia
                  </div>
                </div>
              </div>

              {/* Action Button to Fly */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <button
                  onClick={handleFly}
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-full text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-orange-500/40 transition-all active:scale-95 cursor-pointer border border-yellow-200"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  Terbangkan Lampion ke Angkasa ✨
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              STAGE 3: FLYING STATE WITH PHOTOS & INTERACTIVE ENVELOPE
             ======================================================== */}
          {stage === 'flying' && (
            <motion.div
              key="stage-flying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center relative py-2 space-y-6"
            >
              {/* --- 1. FLYING LANTERN HEADER WITH WISH --- */}
              <div className="relative flex flex-col items-center">
                {/* Glowing Background Ring */}
                <div className="absolute inset-0 bg-amber-400/35 rounded-full blur-2xl animate-pulse" />

                <motion.div
                  animate={{
                    y: [-6, 4, -6],
                    rotate: [-1.5, 1.5, -1.5],
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="relative flex flex-col items-center"
                >
                  {/* The Flying Lantern */}
                  <div className="relative w-28 h-36 sm:w-32 sm:h-42 bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 rounded-t-[44px] rounded-b-2xl border-2 border-yellow-100 shadow-[0_0_50px_rgba(251,191,36,0.9)] flex flex-col items-center justify-between p-3 z-10">
                    <div className="w-10 h-2 bg-yellow-100/90 rounded-full shadow-sm" />
                    <div className="text-center max-w-[110px] bg-black/25 backdrop-blur-sm p-1.5 rounded-xl border border-yellow-100/40">
                      <p className="text-[9px] sm:text-[10px] text-yellow-100 font-serif italic line-clamp-2 leading-tight">
                        "{submittedWish}"
                      </p>
                      <span className="text-[8px] text-amber-200 font-bold block mt-0.5">
                        ❤️ {recipientName}
                      </span>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-6 bg-gradient-to-t from-orange-600 via-amber-300 to-yellow-100 rounded-full animate-bounce shadow-[0_0_15px_#fff]" />
                      <div className="w-10 h-3 bg-amber-950 rounded-full border border-yellow-200 flex items-center justify-center -mt-0.5 shadow-md">
                        <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping opacity-90" />
                      </div>
                    </div>
                  </div>

                  {/* Golden Ribbon Hanging Down */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-[0_0_8px_#fde047]" />
                </motion.div>
              </div>

              {/* --- 2. TRAILING GARLAND OF MEMORY PHOTOS CARRIED BY LANTERN --- */}
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-200 uppercase tracking-wider">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Foto Kenangan Yang Dibawa Lampion ({memories.length})</span>
                </div>

                {/* Horizontal Scrolling or Staggered Polaroid Stream */}
                <div className="w-full overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-amber-400/40 scrollbar-track-transparent">
                  <div className="flex items-center gap-4 justify-start sm:justify-center min-w-max px-2">
                    {memories.map((photo, index) => {
                      const rotation = index % 2 === 0 ? -3 : 3;
                      return (
                        <motion.div
                          key={photo.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.08, rotate: 0, zIndex: 20 }}
                          onClick={() => {
                            setActivePhotoZoom(photo);
                            if (onSelectPhoto) onSelectPhoto(photo);
                          }}
                          className="relative bg-white p-2 sm:p-2.5 pb-4 rounded-xl shadow-xl border border-white/60 cursor-pointer text-slate-900 w-32 sm:w-36 transition-all group select-none"
                          style={{ transform: `rotate(${rotation}deg)` }}
                        >
                          {/* Top Golden Hanging Pin */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 border border-white shadow-md z-10 flex items-center justify-center">
                            <div className="w-1 h-1 bg-amber-900 rounded-full" />
                          </div>

                          {/* Photo Frame */}
                          <div className="w-full h-28 sm:h-32 rounded-lg overflow-hidden bg-slate-100 relative mb-2">
                            <img
                              src={formatGoogleDriveImageUrl(photo.imageUrl)}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-1.5">
                              <span className="text-[10px] text-white font-medium flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <Eye className="w-2.5 h-2.5" /> Lihat
                              </span>
                            </div>
                          </div>

                          {/* Polaroid Title & Date */}
                          <div className="text-center px-1">
                            <p className="text-[11px] font-bold truncate text-slate-800">
                              {photo.title}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono">
                              {photo.date}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Connecting Golden Ribbon to Letter */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 via-rose-300 to-rose-400 shadow-[0_0_8px_#fde047]" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 shadow-md border border-white/60 -mt-1.5" />
              </div>

              {/* --- 3. INTERACTIVE SEALED ENVELOPE / SPECIAL MESSAGE LETTER --- */}
              <div className="w-full max-w-lg flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {!isLetterOpen ? (
                    /* --- SEALED ENVELOPE --- */
                    <motion.div
                      key="sealed-envelope"
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -15 }}
                      onClick={handleOpenLetter}
                      className="w-full bg-gradient-to-br from-rose-950/80 via-rose-900/70 to-slate-950/90 border-2 border-rose-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative cursor-pointer group hover:border-rose-300 transition-all hover:scale-[1.02]"
                    >
                      {/* Floating glowing heart aura */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                        {/* Wax Seal with Heart Icon */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 border-2 border-white/80 shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Heart className="w-8 h-8 fill-white animate-pulse" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                            <Sparkles className="w-3 h-3 text-slate-950 animate-spin" />
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-mono tracking-widest text-rose-300 uppercase block mb-1">
                            Surat Rahasia Terikat di Lampion
                          </span>
                          <h4 className="text-lg sm:text-xl font-extrabold text-white">
                            Untuk: {recipientName} ❤️
                          </h4>
                          <p className="text-white/70 text-xs mt-1">
                            Dari: <span className="font-semibold text-rose-200">{senderName}</span>
                          </p>
                        </div>

                        {/* Interactive Open Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-500/40 border border-white/40 group-hover:shadow-rose-500/60 transition-all cursor-pointer"
                          >
                            <MailOpen className="w-4 h-4" />
                            Ketuk Untuk Membuka Surat ✉️
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* --- UNFURLED LOVE LETTER (SPECIAL MESSAGE) --- */
                    <motion.div
                      key="opened-letter"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full bg-[#fcf9f2] text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#e9dfcc] relative overflow-hidden font-serif"
                    >
                      {/* Parchment Paper Vintage Texture & Top Ribbon */}
                      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400" />
                      <div className="absolute top-3 right-4">
                        <button
                          onClick={() => setIsLetterOpen(false)}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                          title="Tutup surat"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Letter Header */}
                      <div className="border-b-2 border-rose-200/70 pb-4 mb-5">
                        <div className="flex items-center gap-2 text-rose-600 mb-1">
                          <MessageCircleHeart className="w-5 h-5 fill-rose-100" />
                          <span className="text-xs font-sans font-bold uppercase tracking-wider text-rose-500">
                            Pesan Spesial Ulang Tahun
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                          Dear {recipientName},
                        </h3>
                        {subMessage && (
                          <p className="text-xs sm:text-sm text-slate-500 italic mt-0.5">
                            {subMessage}
                          </p>
                        )}
                      </div>

                      {/* Letter Special Message Body */}
                      <div className="prose prose-slate max-w-none mb-6">
                        <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif italic">
                          {specialMessage}
                        </p>
                      </div>

                      {/* Letter Footer Signature & Interactive Heart Button */}
                      <div className="pt-4 border-t-2 border-rose-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
                        <div>
                          <span className="text-xs text-slate-500 block">Dengan segenap cinta,</span>
                          <span className="text-base font-bold text-rose-600">{senderName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSendLove}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>Kirim Cinta ({loveCount})</span>
                          </button>

                          <button
                            onClick={() => setIsLetterOpen(false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-3.5 py-2 rounded-full text-xs transition-colors cursor-pointer"
                          >
                            Lipat Surat
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reset Button */}
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Terbangkan Lampion Baru
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Zoom Modal for Flying Photos */}
      {activePhotoZoom && (
        <div
          onClick={() => setActivePhotoZoom(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-900 border border-amber-300/40 rounded-3xl p-4 text-white shadow-2xl"
          >
            <button
              onClick={() => setActivePhotoZoom(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={formatGoogleDriveImageUrl(activePhotoZoom.imageUrl)}
              alt={activePhotoZoom.title}
              className="w-full max-h-[60vh] object-contain rounded-2xl mb-3 bg-black/40"
              referrerPolicy="no-referrer"
            />

            <div className="p-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-lg text-amber-200">{activePhotoZoom.title}</h3>
                <span className="text-xs text-white/70 font-mono">{activePhotoZoom.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80">{activePhotoZoom.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
