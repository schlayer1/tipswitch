import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Company } from '../types';
import { MapPin, FileText, CheckCircle2, Info, Sparkles } from 'lucide-react';

interface SwipeCardProps {
  company: Company;
  isFront: boolean;
  onSwipe: (dir: 'left' | 'right' | 'super') => void;
  onOpenDetails: (company: Company) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ company, isFront, onSwipe, onOpenDetails }) => {
  const [showFullDesc] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);

  // Indicator badges opacity
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -120], [0, 1]);
  const superOpacity = useTransform(y, [-20, -120], [0, 1]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    const velocity = 400;

    if (info.offset.y < -threshold || info.velocity.y < -velocity) {
      onSwipe('super');
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      onSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      onSwipe('left');
    }
  };

  const categoryColorMap = {
    tech: 'bg-sky-500/90 text-white',
    craft: 'bg-amber-500/90 text-white',
    care: 'bg-rose-500/90 text-white',
    service: 'bg-emerald-500/90 text-white',
    industry: 'bg-slate-700/90 text-white',
  };

  return (
    <motion.div
      key={company.id}
      initial={!isFront ? { scale: 0.95, y: 12, opacity: 0.9 } : false}
      animate={
        isFront
          ? { scale: 1, y: 0, opacity: 1 }
          : { scale: 0.95, y: 12, opacity: 0.9 }
      }
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      style={{
        x: isFront ? x : 0,
        y: isFront ? y : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 0.9,
        touchAction: 'none',
      }}
      drag={isFront ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.85}
      onDragEnd={isFront ? handleDragEnd : undefined}
      className={`absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden select-none shadow-2xl bg-white border border-slate-200/90 flex flex-col ${
        isFront ? 'cursor-grab active:cursor-grabbing z-20' : 'pointer-events-none z-10'
      }`}
    >
      {/* 1. Header Hero Area: Logo framed with clear contrast */}
      <div className="relative w-full h-1/2 overflow-hidden bg-slate-900 flex items-center justify-center p-4">
        {/* Dark backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 opacity-95" />

        {/* Company Photo / Logo */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
          <img
            src={company.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80'}
            alt={company.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition duration-300 pointer-events-none"
          />
        </div>

        {/* Floating Category Tag */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${categoryColorMap[company.category] || 'bg-slate-800 text-white'}`}>
            {company.industry}
          </span>
          <span className="bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
            <MapPin className="w-3 h-3 text-amber-400" />
            {company.city}
          </span>
        </div>

        {/* Slots Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-emerald-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {company.slots} TIP-Plätze
          </span>
        </div>

        {/* Tinder Swipe Stamp Badges */}
        {isFront && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-12 left-6 border-4 border-emerald-500 text-emerald-500 font-black text-3xl px-4 py-1.5 rounded-2xl rotate-[-15deg] pointer-events-none uppercase tracking-wider backdrop-blur-sm bg-emerald-950/20 shadow-2xl z-30"
            >
              INTERESSE
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-12 right-6 border-4 border-rose-500 text-rose-500 font-black text-3xl px-4 py-1.5 rounded-2xl rotate-[15deg] pointer-events-none uppercase tracking-wider backdrop-blur-sm bg-rose-950/20 shadow-2xl z-30"
            >
              WEITER
            </motion.div>
            <motion.div
              style={{ opacity: superOpacity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 border-4 border-amber-400 text-amber-400 font-black text-3xl px-5 py-1.5 rounded-2xl pointer-events-none uppercase tracking-wider backdrop-blur-sm bg-amber-950/30 shadow-2xl z-30 text-center"
            >
              ⭐ TRAUMBERUF
            </motion.div>
          </>
        )}
      </div>

      {/* 2. Body / Content Area */}
      <div className="p-5 h-1/2 flex flex-col justify-between bg-white text-slate-800 border-t border-slate-100">
        <div>
          {/* Company Title */}
          <div className="mb-2">
            <h3 className="text-xl font-black leading-snug text-slate-900 tracking-tight">
              {company.name}
            </h3>
            <p className="text-xs text-school-blue font-bold flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Tag in der Praxis Partner
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {company.highlights.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className={`text-xs text-slate-600 leading-relaxed ${showFullDesc ? '' : 'line-clamp-2'}`}>
            {company.shortDescription}
          </p>
        </div>

        {/* Steckbrief & Detail Trigger */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          {company.pdfUrl ? (
            <a
              href={company.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-school-blue hover:text-school-darkblue bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EduPage Steckbrief (PDF)</span>
            </a>
          ) : (
            <span className="text-xs text-slate-400">Kein PDF hinterlegt</span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(company);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl transition"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
