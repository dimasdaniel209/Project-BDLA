import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Tag, ZoomIn, Sparkles } from 'lucide-react';
import { MemoryItem } from '../types';
import { formatGoogleDriveImageUrl } from '../utils/urlHelpers';

interface Props {
  memories: MemoryItem[];
  onSelectPhoto: (photo: MemoryItem) => void;
}

export const TimelineGallery: React.FC<Props> = ({ memories, onSelectPhoto }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info & Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Timeline Kenangan
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline Container */}
      <div className="relative pt-4 pb-2">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent snap-x snap-mandatory px-1"
          style={{ scrollbarWidth: 'thin' }}
        >
          {memories.map((mem, index) => (
            <div
              key={mem.id}
              className="flex-shrink-0 w-[260px] sm:w-[300px] snap-start flex flex-col group"
            >
              {/* Timeline Node & Date */}
              <div className="flex items-center gap-2 mb-2 pl-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 border border-white/60 flex items-center justify-center shadow-md text-slate-950 font-bold text-[11px]">
                  {index + 1}
                </div>
                {mem.date && (
                  <span className="text-[11px] font-medium text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    {mem.date}
                  </span>
                )}
              </div>

              {/* Memory Card */}
              <div
                onClick={() => onSelectPhoto(mem)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between flex-1"
              >
                {/* Photo Frame */}
                <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden mb-2.5 bg-slate-950/40 border border-white/10">
                  <img
                    src={formatGoogleDriveImageUrl(mem.imageUrl)}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Tag Pill */}
                  {mem.tag && (
                    <span className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white/90 border border-white/20">
                      {mem.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 px-1">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1 group-hover:text-amber-200 transition-colors">
                      {mem.title}
                    </h3>
                    <p className="text-white/75 text-xs leading-relaxed line-clamp-3">
                      {mem.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
