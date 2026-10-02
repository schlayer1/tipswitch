import React, { useState } from 'react';
import { generateStudentCode } from '../utils/studentAuth';
import { Sparkles, GraduationCap, ArrowRight, UserCheck, Shield } from 'lucide-react';

interface LoginModalProps {
  onStudentLogin: (code: string, name: string, studentClass: string) => void;
  onTeacherLogin: (password: string) => boolean;
}

const AVAILABLE_CLASSES = ['8a', '8b', '8c', '9a', '9b', '9c'];

export const LoginModal: React.FC<LoginModalProps> = ({ onStudentLogin, onTeacherLogin }) => {
  const [tab, setTab] = useState<'code' | 'new' | 'teacher'>('code');
  const [existingCode, setExistingCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('8a');
  const [teacherPass, setTeacherPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const previewCode = fullName.trim() ? generateStudentCode(fullName) : '';

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingCode.trim()) {
      setErrorMsg('Bitte gib dein 4-stelliges Kürzel ein.');
      return;
    }
    onStudentLogin(existingCode.trim().toUpperCase(), existingCode.trim().toUpperCase(), studentClass);
  };

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Bitte gib deinen vollständigen Namen ein.');
      return;
    }
    const code = generateStudentCode(fullName);
    onStudentLogin(code, fullName.trim(), studentClass);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = onTeacherLogin(teacherPass);
    if (!success) {
      setErrorMsg('Ungültiges Lehrer-Passwort (z. B. "hbs-lehrer")');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-school-darkblue via-school-blue to-school-cyan p-6 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-xl overflow-hidden border-2 border-white/30">
            <img src="/icon.svg" alt="TipSwitch Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">TipSwitch Matching</h2>
          <p className="text-blue-100 text-sm mt-1">Tag in der Praxis • Heimbürgeschule Kahla</p>
          <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
            Finde deinen Wunschbetrieb im Tinder-Style
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 text-sm font-semibold">
          <button
            onClick={() => { setTab('code'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition ${
              tab === 'code' ? 'text-school-blue border-b-2 border-school-blue bg-blue-50/50' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kürzel-Login
          </button>
          <button
            onClick={() => { setTab('new'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition ${
              tab === 'new' ? 'text-school-blue border-b-2 border-school-blue bg-blue-50/50' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Neu anlegen
          </button>
          <button
            onClick={() => { setTab('teacher'); setErrorMsg(''); }}
            className={`py-3 px-4 text-center transition flex items-center justify-center gap-1 ${
              tab === 'teacher' ? 'text-amber-700 border-b-2 border-amber-600 bg-amber-50/50' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Lehrerzugang"
          >
            <GraduationCap className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {tab === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dein 4-stelliges Kürzel
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Z. B. LMUE"
                  value={existingCode}
                  onChange={(e) => setExistingCode(e.target.value.toUpperCase())}
                  className="w-full text-center text-2xl tracking-widest font-mono font-black py-3 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue focus:border-transparent uppercase bg-slate-50 placeholder:font-sans placeholder:tracking-normal placeholder:text-base placeholder:text-slate-300"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-1.5 text-center">
                  Erster Buchstabe Vorname + 3 Buchstaben Nachname
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deine Klasse
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVAILABLE_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setStudentClass(cls)}
                      className={`py-2 text-xs font-bold rounded-lg border transition ${
                        studentClass === cls
                          ? 'bg-school-blue text-white border-school-blue shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-school-blue to-school-cyan hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-school-blue/20 transition flex items-center justify-center gap-2 group"
              >
                <span>Matching starten</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </form>
          )}

          {tab === 'new' && (
            <form onSubmit={handleNewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vor- und Nachname
                </label>
                <input
                  type="text"
                  placeholder="z. B. Lukas Müller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-school-blue text-slate-800"
                  autoFocus
                />
              </div>

              {previewCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-semibold">Dein generiertes Kürzel:</span>
                  </div>
                  <span className="font-mono font-black text-lg bg-amber-200/80 px-2.5 py-0.5 rounded-lg text-amber-950">
                    {previewCode}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deine Klasse
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVAILABLE_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setStudentClass(cls)}
                      className={`py-2 text-xs font-bold rounded-lg border transition ${
                        studentClass === cls
                          ? 'bg-school-blue text-white border-school-blue shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-school-blue to-school-cyan hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-school-blue/20 transition flex items-center justify-center gap-2"
              >
                <span>Profil anlegen & loslegen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs">
                <Shield className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>Lehrerbereich zur Verwaltung von Betrieben und Einsicht der Schüler-Präferenzen.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Lehrer-Passwort
                </label>
                <input
                  type="password"
                  placeholder="Passwort eingeben"
                  value={teacherPass}
                  onChange={(e) => setTeacherPass(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Ins Lehrer-Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
