import React, { useState } from 'react';
import { Company, StudentPreferences } from '../types';
import { isFirebaseConfigured } from '../lib/firebase';
import { Plus, Users, Building2, Key, Check, Copy, ExternalLink, ShieldAlert, Sliders, Calendar, ChevronDown, ChevronUp, Image as ImageIcon, Database } from 'lucide-react';

interface TeacherDashboardProps {
  companies: Company[];
  studentPreferences: StudentPreferences[];
  onSaveCompany: (comp: Company) => Promise<void>;
  onSeedCompanies?: () => Promise<number>;
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  companies,
  studentPreferences,
  onSaveCompany,
  onSeedCompanies,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'companies' | 'add'>('students');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [editingSlotsId, setEditingSlotsId] = useState<string | null>(null);

  // Form for new company
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCity, setNewCity] = useState('Kahla');
  const [newSlots, setNewSlots] = useState(2);
  const [t1Slots, setT1Slots] = useState(2);
  const [t2Slots, setT2Slots] = useState(2);
  const [t3Slots, setT3Slots] = useState(2);
  const [t4Slots, setT4Slots] = useState(2);
  const [newCategory, setNewCategory] = useState<Company['category']>('craft');
  const [newDesc, setNewDesc] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUpdateTurnusSlots = async (
    comp: Company,
    field: 'turnus1' | 'turnus2' | 'turnus3' | 'turnus4' | 'default',
    val: number
  ) => {
    const safeVal = Math.max(0, val);
    const existing = comp.turnusSlots || {
      turnus1: comp.slots,
      turnus2: comp.slots,
      turnus3: comp.slots,
      turnus4: comp.slots,
    };

    let updatedSlots = comp.slots;
    const updatedTurnus = { ...existing };

    if (field === 'default') {
      updatedSlots = safeVal;
    } else {
      updatedTurnus[field] = safeVal;
    }

    const updatedCompany: Company = {
      ...comp,
      slots: updatedSlots,
      turnusSlots: updatedTurnus,
    };

    await onSaveCompany(updatedCompany);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    const id = newName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newComp: Company = {
      id,
      name: newName.trim(),
      industry: newIndustry.trim() || 'Allgemein',
      category: newCategory,
      city: newCity.trim(),
      slots: newSlots,
      turnusSlots: {
        turnus1: t1Slots,
        turnus2: t2Slots,
        turnus3: t3Slots,
        turnus4: t4Slots,
      },
      shortDescription: newDesc.trim() || 'Praxispartner der Heimbürgeschule für den Tag in der Praxis.',
      highlights: ['Praktische Einblicke', 'Betreuung vor Ort', 'Berufsorientierung'],
      pdfUrl: newPdfUrl.trim() || undefined,
      imageUrl: newImageUrl.trim() || undefined,
      active: true,
    };

    try {
      await onSaveCompany(newComp);
      setNewName('');
      setNewIndustry('');
      setNewDesc('');
      setNewPdfUrl('');
      setNewImageUrl('');
      setActiveTab('companies');
    } catch {
      alert('Fehler beim Speichern des Betriebs');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter students
  const filteredStudents = studentPreferences.filter(
    (s) =>
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[2100px] mx-auto p-3 sm:p-5 lg:p-6 xl:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-5 sm:p-6 lg:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Lehrkraft-Souveränität HBS</span>
            </div>
            {isFirebaseConfigured ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Database className="w-3.5 h-3.5" />
                <span>Firebase Cloud aktiv</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-bold border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Nur lokaler Speicher (Vercel Env fehlt)</span>
              </div>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">TIP Lehrer-Dashboard</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Matching-Matrix, Kürzel-Verwaltung & manuelle Turnus-Plätze je Betrieb
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onSeedCompanies && (
            <button
              onClick={async () => {
                setIsSeeding(true);
                setSeedSuccess(null);
                try {
                  const count = await onSeedCompanies();
                  setSeedSuccess(`${count} Betriebe erfolgreich in Firebase gespeichert!`);
                  setTimeout(() => setSeedSuccess(null), 4000);
                } catch {
                  alert('Fehler beim Synchronisieren nach Firebase.');
                } finally {
                  setIsSeeding(false);
                }
              }}
              disabled={isSeeding}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm"
              title="Lädt alle 53 EduPage-Betriebe in deine Firestore-Datenbank hoch"
            >
              {isSeeding ? 'Synchronisiere...' : '53 Betriebe in Firebase laden'}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
          >
            Zurück zur Schüler-Ansicht
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{seedSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'students'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Schüler-Wünsche ({studentPreferences.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'companies'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Betriebe & Turnus-Plätze ({companies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'add'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Neuen Betrieb anlegen</span>
        </button>
      </div>

      {/* Tab: Schüler-Präferenzen */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Nach Schüler, Kürzel (z.B. LMUE) oder Klasse filtern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-school-blue shadow-sm"
            />
            <span className="text-xs text-slate-400 font-semibold self-end sm:self-auto">
              {filteredStudents.length} Schüler erfasst
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Schüler / Kürzel</th>
                  <th className="p-3.5">Klasse</th>
                  <th className="p-3.5">Top-Wunsch (Super-Like)</th>
                  <th className="p-3.5">Gemerkt (Likes)</th>
                  <th className="p-3.5 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Noch keine Schüler-Swipes für diese Suche vorhanden.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const superComp = companies.find((c) => s.superLikes?.includes(c.id));
                    const likedComps = companies.filter((c) => s.likes?.includes(c.id));

                    return (
                      <tr key={s.studentCode} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-sm">{s.studentName}</div>
                          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-mono text-xs font-bold mt-1">
                            <Key className="w-3 h-3 text-amber-700" />
                            <span>Login: {s.studentCode}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-700">{s.studentClass}</td>
                        <td className="p-3.5">
                          {superComp ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-bold border border-amber-200">
                              ⭐ {superComp.name}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {likedComps.slice(0, 4).map((lc) => (
                              <span
                                key={lc.id}
                                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] truncate"
                              >
                                {lc.name}
                              </span>
                            ))}
                            {likedComps.length > 4 && (
                              <span className="text-[11px] text-slate-400 font-bold">
                                +{likedComps.length - 4} weitere
                              </span>
                            )}
                            {likedComps.length === 0 && <span className="text-slate-400">—</span>}
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(s.studentCode)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-school-blue hover:bg-blue-50 px-2.5 py-1 rounded-lg transition border border-slate-200 shadow-sm"
                          >
                            {copiedCode === s.studentCode ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Kopiert!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Kürzel</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Betriebe & Turnus-Plätze konfigurieren */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Klicke auf <strong>„Plätze je Turnus anpassen“</strong>, um Kapazitäten für Turnus 1 bis 4 individuell einzustellen.</span>
            <span className="font-bold">{companies.length} Betriebe aktiv</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
            {companies.map((comp) => {
              const isTurnusOpen = editingSlotsId === comp.id;
              const slotsT1 = comp.turnusSlots?.turnus1 ?? comp.slots;
              const slotsT2 = comp.turnusSlots?.turnus2 ?? comp.slots;
              const slotsT3 = comp.turnusSlots?.turnus3 ?? comp.slots;
              const slotsT4 = comp.turnusSlots?.turnus4 ?? comp.slots;

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Header: Logo & Basics */}
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE3] border border-amber-900/10 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                        <img
                          src={comp.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80'}
                          alt={comp.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">{comp.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{comp.industry}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">{comp.city}</p>
                      </div>
                    </div>

                    {/* Turnus Slots Overview Pills */}
                    <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">T1</div>
                        <div className="text-xs font-black text-slate-800">{slotsT1} Pl.</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">T2</div>
                        <div className="text-xs font-black text-slate-800">{slotsT2} Pl.</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">T3</div>
                        <div className="text-xs font-black text-slate-800">{slotsT3} Pl.</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">T4</div>
                        <div className="text-xs font-black text-slate-800">{slotsT4} Pl.</div>
                      </div>
                    </div>

                    {/* Turnus Edit Drawer */}
                    {isTurnusOpen && (
                      <div className="mt-3 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2.5 animate-fade-in text-xs">
                        <div className="font-bold text-school-blue flex items-center gap-1.5 text-xs">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Plätze je Turnus anpassen:</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Turnus 1 (Jg. 8)</label>
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={slotsT1}
                              onChange={(e) => handleUpdateTurnusSlots(comp, 'turnus1', parseInt(e.target.value) || 0)}
                              className="w-full py-1 px-2 border rounded-lg bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Turnus 2 (Jg. 8)</label>
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={slotsT2}
                              onChange={(e) => handleUpdateTurnusSlots(comp, 'turnus2', parseInt(e.target.value) || 0)}
                              className="w-full py-1 px-2 border rounded-lg bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Turnus 3 (Jg. 9)</label>
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={slotsT3}
                              onChange={(e) => handleUpdateTurnusSlots(comp, 'turnus3', parseInt(e.target.value) || 0)}
                              className="w-full py-1 px-2 border rounded-lg bg-white text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Turnus 4 (Jg. 9)</label>
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={slotsT4}
                              onChange={(e) => handleUpdateTurnusSlots(comp, 'turnus4', parseInt(e.target.value) || 0)}
                              className="w-full py-1 px-2 border rounded-lg bg-white text-xs font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingSlotsId(isTurnusOpen ? null : comp.id)}
                      className={`font-bold px-2.5 py-1 rounded-xl transition flex items-center gap-1 text-[11px] ${
                        isTurnusOpen
                          ? 'bg-school-blue text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{isTurnusOpen ? 'Schließen' : 'Turnus-Plätze'}</span>
                      {isTurnusOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {comp.pdfUrl && (
                        <a
                          href={comp.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-school-blue p-1.5 hover:bg-blue-50 rounded-lg transition"
                          title="EduPage PDF öffnen"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={async () => {
                          const newUrl = prompt(`Bild-URL für "${comp.name}" eingeben:`, comp.imageUrl || '');
                          if (newUrl !== null && newUrl.trim() !== comp.imageUrl) {
                            await onSaveCompany({ ...comp, imageUrl: newUrl.trim() });
                          }
                        }}
                        className="text-slate-500 hover:text-school-blue p-1.5 hover:bg-slate-100 rounded-lg transition"
                        title="Foto ändern"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Neuen Betrieb anlegen */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 max-w-3xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Neuen TIP-Betrieb erfassen</h3>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name des Unternehmens *</label>
              <input
                type="text"
                required
                placeholder="z. B. Porzellanmanufaktur Kahla"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Branche / Berufsfeld</label>
                <input
                  type="text"
                  placeholder="z. B. Keramik & Design"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Standort / Ort</label>
                <input
                  type="text"
                  placeholder="z. B. Kahla"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kategorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Company['category'])}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue bg-white shadow-sm"
                >
                  <option value="craft">Handwerk & Bau</option>
                  <option value="tech">IT & Technik</option>
                  <option value="care">Gesundheit & Pflege</option>
                  <option value="service">Handel & Dienstleistung</option>
                  <option value="industry">Landwirtschaft & Produktion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Standard TIP-Plätze</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newSlots}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 1;
                    setNewSlots(v);
                    setT1Slots(v);
                    setT2Slots(v);
                    setT3Slots(v);
                    setT4Slots(v);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
                />
              </div>
            </div>

            {/* Turnus Slots Granular */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Feinabstimmung: Plätze je Durchgang / Turnus
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Turnus 1 (Jg. 8)</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={t1Slots}
                    onChange={(e) => setT1Slots(parseInt(e.target.value) || 0)}
                    className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Turnus 2 (Jg. 8)</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={t2Slots}
                    onChange={(e) => setT2Slots(parseInt(e.target.value) || 0)}
                    className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Turnus 3 (Jg. 9)</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={t3Slots}
                    onChange={(e) => setT3Slots(parseInt(e.target.value) || 0)}
                    className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Turnus 4 (Jg. 9)</span>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={t4Slots}
                    onChange={(e) => setT4Slots(parseInt(e.target.value) || 0)}
                    className="w-full py-1.5 px-2.5 border rounded-lg bg-white text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kurzbeschreibung (für die Karte)</label>
              <textarea
                rows={2}
                placeholder="Spannende Aufgaben und Einblicke..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">EduPage PDF-Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://cloud-...edupage.org/..."
                  value={newPdfUrl}
                  onChange={(e) => setNewPdfUrl(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bild-URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://... (oder leer für Branchenfoto)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-school-blue hover:bg-school-darkblue text-white font-bold rounded-2xl transition shadow-lg shadow-school-blue/20"
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Betrieb zum Portfolio hinzufügen'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
