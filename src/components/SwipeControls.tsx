import React from 'react';
import { X, Heart, Star, RotateCcw, Info } from 'lucide-react';

interface SwipeControlsProps {
  onDislike: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}

export const SwipeControls: React.FC<SwipeControlsProps> = ({
  onDislike,
  onLike,
  onSuperLike,
  onUndo,
  canUndo,
  disabled
}) => {
  return (
    <div className="flex items-center justify-center gap-4 py-4 px-2">
      {/* Undo */}
      <button
        type="button"
        disabled={!canUndo || disabled}
        onClick={onUndo}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md border ${
          canUndo
            ? 'bg-white text-amber-500 border-amber-200 hover:bg-amber-50 active:scale-95'
            : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-60'
        }`}
        title="Swipe rückgängig machen"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {/* Dislike / Weiter */}
      <button
        type="button"
        disabled={disabled}
        onClick={onDislike}
        className="w-16 h-16 rounded-full bg-white text-rose-500 border-2 border-rose-200 shadow-lg hover:bg-rose-50 hover:border-rose-400 active:scale-90 transition flex items-center justify-center group"
        title="Nicht meins (Links)"
      >
        <X className="w-8 h-8 group-hover:scale-110 transition" strokeWidth={2.5} />
      </button>

      {/* Super Like / Wunschstelle */}
      <button
        type="button"
        disabled={disabled}
        onClick={onSuperLike}
        className="w-12 h-12 rounded-full bg-white text-sky-500 border-2 border-sky-200 shadow-md hover:bg-sky-50 hover:border-sky-400 active:scale-90 transition flex items-center justify-center group"
        title="Favorit / Traumberuf (Oben)"
      >
        <Star className="w-6 h-6 group-hover:scale-125 transition fill-sky-500" />
      </button>

      {/* Like / Interesse */}
      <button
        type="button"
        disabled={disabled}
        onClick={onLike}
        className="w-16 h-16 rounded-full bg-white text-emerald-500 border-2 border-emerald-200 shadow-lg hover:bg-emerald-50 hover:border-emerald-400 active:scale-90 transition flex items-center justify-center group"
        title="Interessant (Rechts)"
      >
        <Heart className="w-8 h-8 group-hover:scale-110 transition fill-emerald-500" strokeWidth={1} />
      </button>
    </div>
  );
};
