import React, { useState } from 'react';
import { Company, StudentPreferences } from '../types';
import { Plus, Users, Building2, Key, Check, Copy, ExternalLink, Edit2, ShieldAlert } from 'lucide-react';

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

  // Form for new company
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCity, setNewCity] = useState('Kahla');
  const [newSlots, setNewSlots] = useState(2);
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
      shortDescription: newDesc.trim() || 'Praxispartner der Heimbürgeschule für den Tag in der Praxis.',
      highlights: ['Praktische Einblicke', 'Betreuung vor Ort', 'Berufsorientierung'],
      pdfUrl: newPdfUrl.trim() || undefined,
      imageUrl: newImageUrl.trim() || undefined,
      active: true,
    };

    try {
      await onSaveCompany(newComp);
      // Reset form
      setNewName('');
      setNewIndustry('');
      setNewDesc('');
      setNewPdfUrl('');
      setNewImageUrl('');
      setActiveTab('companies');
    } catch (err) {
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Lehrkraft-Souveränität HBS</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">TIP Lehrer-Dashboard</h2>
          <p className="text-slate-400 text-xs mt-1">
            Matching-Matrix, Kürzel-Verwaltung & Pflege der TIP-Betriebe
          </p>
        </div>

        <div className="flex items-center gap-2">
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
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm"
              title="Lädt alle 53 EduPage-Betriebe in deine Firestore-Datenbank hoch"
            >
              {isSeeding ? 'Synchronisiere...' : '53 Betriebe in Firebase laden'}
            </button>
          )}

          <button
            onClick={onClose}
            className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
          >
            Zurück zur Schüler-Ansicht
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{seedSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
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
          className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'companies'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Betriebe verwalten ({companies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
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
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Nach Schüler, Kürzel (z.B. LMUE) oder Klasse filtern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-school-blue"
            />
            <span className="text-xs text-slate-400 font-semibold">
              {filteredStudents.length} Schüler erfasst
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
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
                          {/* Mnemonic Badge conforming to school standard */}
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
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {likedComps.slice(0, 3).map((lc) => (
                              <span
                                key={lc.id}
                                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] truncate"
                              >
                                {lc.name}
                              </span>
                            ))}
                            {likedComps.length > 3 && (
                              <span className="text-[11px] text-slate-400 font-bold">
                                +{likedComps.length - 3} weitere
                              </span>
                            )}
                            {likedComps.length === 0 && <span className="text-slate-400">—</span>}
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(s.studentCode)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-school-blue hover:bg-blue-50 px-2 py-1 rounded transition border border-slate-200"
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

      {/* Tab: Betriebe */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((comp) => (
              <div key={comp.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{comp.name}</h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-school-blue border border-blue-200 flex-shrink-0">
                      {comp.slots} Plätze
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{comp.industry} • {comp.city}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {comp.pdfUrl ? (
                    <a
                      href={comp.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-school-blue font-bold hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Steckbrief</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">Kein PDF</span>
                  )}
                  <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    Aktiv
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Neuen Betrieb anlegen */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-2xl shadow-sm">
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
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Branche / Berufsfeld</label>
                <input
                  type="text"
                  placeholder="z. B. Keramik & Design"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Standort / Ort</label>
                <input
                  type="text"
                  placeholder="z. B. Kahla"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kategorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Company['category'])}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue bg-white"
                >
                  <option value="craft">Handwerk & Bau</option>
                  <option value="tech">IT & Technik</option>
                  <option value="care">Gesundheit & Pflege</option>
                  <option value="service">Handel & Dienstleistung</option>
                  <option value="industry">Industrie & Produktion</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Verfügbare TIP-Plätze</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newSlots}
                  onChange={(e) => setNewSlots(parseInt(e.target.value) || 1)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kurzbeschreibung (für die Karte)</label>
              <textarea
                rows={2}
                placeholder="Spannende Aufgaben und Einblicke..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">EduPage PDF-Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://cloud-...edupage.org/..."
                  value={newPdfUrl}
                  onChange={(e) => setNewPdfUrl(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bild-URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://... (oder leer für Branchenfoto)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-school-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-school-blue hover:bg-school-darkblue text-white font-bold rounded-xl transition shadow-md shadow-school-blue/20"
            >
              {isSubmitting ? 'Wird gespeichert...' : 'Betrieb zum Portfolio hinzufügen'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
