import React from 'react';
import { Company } from '../types';
import { X, ExternalLink, MapPin, CheckCircle2, Building, Tag, Sparkles } from 'lucide-react';

interface CompanyDetailModalProps {
  company: Company | null;
  onClose: () => void;
  onLike?: (id: string) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, onClose, onLike }) => {
  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col relative border border-slate-100">
        
        {/* Header Image */}
        <div className="relative h-56 w-full bg-slate-900 flex-shrink-0">
          <img
            src={company.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80'}
            alt={company.name}
            className="w-full h-full object-cover brightness-90"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="bg-school-blue px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {company.industry}
            </span>
            <h2 className="text-2xl font-black mt-2 leading-tight drop-shadow-md">
              {company.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">{company.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{company.slots} Plätze Standard</span>
              </div>
            </div>

            {/* Turnus Slots breakdown */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-200/60 text-center">
              <div className="bg-white p-1 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">Turnus 1</span>
                <span className="text-xs font-black text-slate-800">{company.turnusSlots?.turnus1 ?? company.slots} Pl.</span>
              </div>
              <div className="bg-white p-1 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">Turnus 2</span>
                <span className="text-xs font-black text-slate-800">{company.turnusSlots?.turnus2 ?? company.slots} Pl.</span>
              </div>
              <div className="bg-white p-1 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">Turnus 3</span>
                <span className="text-xs font-black text-slate-800">{company.turnusSlots?.turnus3 ?? company.slots} Pl.</span>
              </div>
              <div className="bg-white p-1 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block">Turnus 4</span>
                <span className="text-xs font-black text-slate-800">{company.turnusSlots?.turnus4 ?? company.slots} Pl.</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Über den Betrieb
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {company.shortDescription}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Praxis-Highlights
            </h4>
            <div className="space-y-2">
              {company.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/60">
                  <Sparkles className="w-4 h-4 text-school-blue flex-shrink-0" />
                  <span className="font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Link */}
          {company.pdfUrl && (
            <div className="pt-2">
              <a
                href={company.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-school-blue hover:bg-school-darkblue text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-school-blue/20 text-sm"
              >
                <span>Original EduPage Steckbrief öffnen (PDF)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-center text-[11px] text-slate-400 mt-1.5">
                Öffnet den offiziellen Schul-Steckbrief mit Kontaktdaten & Tätigkeiten.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
