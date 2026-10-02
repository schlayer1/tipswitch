import React from 'react';
import { Company } from '../types';
import { Heart, Star, ExternalLink, ArrowRight, Trash2, CheckCircle } from 'lucide-react';

interface MatchesViewProps {
  companies: Company[];
  likes: string[];
  superLikes: string[];
  onRemoveMatch: (id: string) => void;
  onSetSuperLike: (id: string) => void;
  onOpenDetails: (company: Company) => void;
  onBackToSwipe: () => void;
  studentCode: string;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  companies,
  likes,
  superLikes,
  onRemoveMatch,
  onSetSuperLike,
  onOpenDetails,
  onBackToSwipe,
  studentCode,
}) => {
  const likedCompanies = companies.filter((c) => likes.includes(c.id) || superLikes.includes(c.id));

  // Sort: Superlikes at the top
  const sorted = [...likedCompanies].sort((a, b) => {
    const isASuper = superLikes.includes(a.id);
    const isBSuper = superLikes.includes(b.id);
    if (isASuper && !isBSuper) return -1;
    if (!isASuper && isBSuper) return 1;
    return 0;
  });

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Deine Wunschbetriebe</h2>
          <p className="text-sm text-slate-500">
            Kürzel: <span className="font-mono font-bold text-school-blue">{studentCode}</span> • {likedCompanies.length} Betriebe gemerkt
          </p>
        </div>
        <button
          onClick={onBackToSwipe}
          className="px-4 py-2 bg-school-blue text-white rounded-xl font-bold text-sm hover:bg-school-darkblue transition flex items-center gap-1.5 shadow-md shadow-school-blue/20"
        >
          <span>Weiter swipen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Info Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 fill-amber-400" />
        <div>
          <span className="font-bold">Tipp:</span> Markiere mit dem Stern (⭐) deine absoluten Traumstellen. Deine Lehrkraft kann diese Favoriten bei der TIP-Verteilung direkt einsehen.
        </div>
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Noch keine Betriebe auf deiner Liste</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Swipe Betriebe nach rechts oder nutze den Herz-Button, um interessante Stellen für den Tag in der Praxis zu speichern.
          </p>
          <button
            onClick={onBackToSwipe}
            className="px-6 py-2.5 bg-school-blue text-white font-bold text-sm rounded-xl shadow-md"
          >
            Jetzt Betriebe entdecken
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((comp) => {
            const isSuper = superLikes.includes(comp.id);
            return (
              <div
                key={comp.id}
                className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition flex items-center gap-4 ${
                  isSuper ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-200/80'
                }`}
              >
                {/* Thumb */}
                <div
                  onClick={() => onOpenDetails(comp)}
                  className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer relative bg-slate-100 border border-slate-200"
                >
                  <img
                    src={comp.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80'}
                    alt={comp.name}
                    className="w-full h-full object-cover"
                  />
                  {isSuper && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-amber-950 p-0.5 rounded-full shadow">
                      <Star className="w-3 h-3 fill-amber-950" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0" onClick={() => onOpenDetails(comp)}>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm truncate cursor-pointer hover:text-school-blue">
                      {comp.name}
                    </h4>
                    {isSuper && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
                        Top Wunsch
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{comp.industry} • {comp.city}</p>
                  
                  {comp.pdfUrl && (
                    <a
                      href={comp.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-school-blue hover:underline mt-1"
                    >
                      <span>EduPage Steckbrief</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onSetSuperLike(comp.id)}
                    className={`p-2 rounded-xl border transition ${
                      isSuper
                        ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-sm'
                        : 'bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200'
                    }`}
                    title={isSuper ? 'Top-Wunsch entfernen' : 'Als Top-Wunsch markieren'}
                  >
                    <Star className={`w-4 h-4 ${isSuper ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onRemoveMatch(comp.id)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                    title="Von Liste entfernen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
