import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Company, StudentPreferences } from './types';
import { INITIAL_COMPANIES } from './data/companiesData';
import {
  fetchCompanies,
  saveCompany,
  fetchStudentPreferences,
  saveStudentPreferences,
  fetchAllStudentPreferences,
} from './services/matchingService';
import { useAuth } from './context/AuthContext';
import { LoginModal } from './components/LoginModal';
import { SwipeCard } from './components/SwipeCard';
import { SwipeControls } from './components/SwipeControls';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { MatchesView } from './components/MatchesView';
import { TeacherDashboard } from './components/TeacherDashboard';
import {
  Sparkles,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  LogOut,
  GraduationCap,
  Layers,
  MapPin,
  Check,
} from 'lucide-react';

export const App: React.FC = () => {
  const { auth, isLoading: isAuthLoading, loginAsStudent, loginAsTeacher, logout } = useAuth();

  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [superLikes, setSuperLikes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<{ id: string; action: 'like' | 'dislike' | 'super' }[]>([]);

  // Selected filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<'swipe' | 'matches' | 'teacher'>('swipe');
  const [inspectCompany, setInspectCompany] = useState<Company | null>(null);

  // All student preferences for teacher dashboard
  const [allPreferences, setAllPreferences] = useState<StudentPreferences[]>([]);

  // 1. Initial Load Companies & Preferences
  useEffect(() => {
    async function loadData() {
      const loaded = await fetchCompanies();
      setCompanies(loaded);
    }
    loadData();
  }, []);

  // 2. Load Student Preferences when logged in
  useEffect(() => {
    if (auth.role === 'student' && auth.studentCode) {
      async function loadPref() {
        const pref = await fetchStudentPreferences(auth.studentCode);
        if (pref) {
          setLikes(pref.likes || []);
          setSuperLikes(pref.superLikes || []);
          setDislikes(pref.dislikes || []);
        }
      }
      loadPref();
    } else if (auth.role === 'teacher') {
      async function loadTeacherData() {
        const all = await fetchAllStudentPreferences();
        setAllPreferences(all);
      }
      loadTeacherData();
    }
  }, [auth]);

  // Sync back preferences on change
  const persistPreferences = async (newLikes: string[], newSupers: string[], newDislikes: string[]) => {
    if (auth.role !== 'student' || !auth.studentCode) return;
    const prefs: StudentPreferences = {
      studentCode: auth.studentCode,
      studentName: auth.studentName,
      studentClass: auth.studentClass,
      likes: newLikes,
      superLikes: newSupers,
      dislikes: newDislikes,
      updatedAt: new Date().toISOString(),
    };
    await saveStudentPreferences(prefs);
  };

  // Filtered companies based on category
  const filteredCompanies = companies.filter((c) => {
    if (!c.active) return false;
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  // Current deck of cards
  const remainingCompanies = filteredCompanies.slice(currentIndex);
  const currentCard = remainingCompanies[0];
  const nextCard = remainingCompanies[1];

  // Swipe Action Handlers
  const handleSwipe = (dir: 'left' | 'right' | 'super') => {
    if (!currentCard) return;

    const compId = currentCard.id;
    let newLikes = [...likes];
    let newSupers = [...superLikes];
    let newDislikes = [...dislikes];

    if (dir === 'right') {
      if (!newLikes.includes(compId)) newLikes.push(compId);
      setSwipeHistory((prev) => [...prev, { id: compId, action: 'like' }]);
    } else if (dir === 'super') {
      if (!newSupers.includes(compId)) newSupers.push(compId);
      if (!newLikes.includes(compId)) newLikes.push(compId);
      setSwipeHistory((prev) => [...prev, { id: compId, action: 'super' }]);
      // Confetti for Super-Like
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0B7BA7', '#00A8B5', '#F39200', '#FCD34D'],
      });
    } else {
      if (!newDislikes.includes(compId)) newDislikes.push(compId);
      setSwipeHistory((prev) => [...prev, { id: compId, action: 'dislike' }]);
    }

    setLikes(newLikes);
    setSuperLikes(newSupers);
    setDislikes(newDislikes);
    setCurrentIndex((prev) => prev + 1);

    persistPreferences(newLikes, newSupers, newDislikes);
  };

  // Undo Last Swipe
  const handleUndo = () => {
    if (swipeHistory.length === 0 || currentIndex === 0) return;
    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));

    let newLikes = likes.filter((id) => id !== last.id);
    let newSupers = superLikes.filter((id) => id !== last.id);
    let newDislikes = dislikes.filter((id) => id !== last.id);

    setLikes(newLikes);
    setSuperLikes(newSupers);
    setDislikes(newDislikes);
    persistPreferences(newLikes, newSupers, newDislikes);
  };

  // Matches item toggle
  const handleRemoveMatch = (id: string) => {
    const newLikes = likes.filter((l) => l !== id);
    const newSupers = superLikes.filter((s) => s !== id);
    setLikes(newLikes);
    setSuperLikes(newSupers);
    persistPreferences(newLikes, newSupers, dislikes);
  };

  const handleSetSuperLike = (id: string) => {
    let newSupers: string[];
    if (superLikes.includes(id)) {
      newSupers = superLikes.filter((s) => s !== id);
    } else {
      newSupers = [...superLikes, id];
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    }
    setSuperLikes(newSupers);
    persistPreferences(likes, newSupers, dislikes);
  };

  const handleTeacherSaveCompany = async (newComp: Company) => {
    await saveCompany(newComp);
    setCompanies((prev) => [newComp, ...prev.filter((c) => c.id !== newComp.id)]);
  };

  // If loading or unauthenticated
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-school-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col font-sans select-none overflow-x-hidden text-slate-800">
      
      {/* Login Modal */}
      {!auth.role && (
        <LoginModal
          onStudentLogin={(code, name, cls) => loginAsStudent(code, name, cls)}
          onTeacherLogin={(pass) => {
            const ok = loginAsTeacher(pass);
            if (ok) setActiveView('teacher');
            return ok;
          }}
        />
      )}

      {/* Main Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & School Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-school-darkblue to-school-cyan flex items-center justify-center text-white shadow-md shadow-school-blue/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-black text-slate-900 tracking-tight leading-none text-base">
                TIP Matching
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Heimbürgeschule Kahla
              </div>
            </div>
          </div>

          {/* User Status / View Switcher */}
          {auth.role && (
            <div className="flex items-center gap-2">
              {auth.role === 'student' && (
                <>
                  <button
                    onClick={() => setActiveView('swipe')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      activeView === 'swipe'
                        ? 'bg-school-blue text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span className="hidden sm:inline">Entdecken</span>
                  </button>

                  <button
                    onClick={() => setActiveView('matches')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
                      activeView === 'matches'
                        ? 'bg-school-blue text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>Favoriten</span>
                    {likes.length > 0 && (
                      <span className="ml-0.5 bg-rose-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-black">
                        {likes.length}
                      </span>
                    )}
                  </button>
                </>
              )}

              {auth.role === 'teacher' && (
                <button
                  onClick={() => setActiveView('teacher')}
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Lehrerbereich</span>
                </button>
              )}

              {/* Student code badge */}
              {auth.role === 'student' && (
                <span className="hidden md:inline-flex items-center font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg border border-slate-200">
                  {auth.studentCode} ({auth.studentClass})
                </span>
              )}

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-3 sm:p-4 max-w-lg w-full mx-auto relative">
        
        {/* VIEW 1: Tinder Swipe */}
        {activeView === 'swipe' && auth.role && (
          <div className="w-full flex flex-col items-center flex-1 justify-between max-h-[820px]">
            
            {/* Category Filter Pills */}
            <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1 mb-2">
              {[
                { id: 'all', label: 'Alle Betriebe' },
                { id: 'tech', label: 'IT & Hightech' },
                { id: 'craft', label: 'Handwerk & Bau' },
                { id: 'care', label: 'Pflege & Soziales' },
                { id: 'service', label: 'Handel & Logistik' },
                { id: 'industry', label: 'Industrie' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Card Deck Area */}
            <div className="relative w-full aspect-[3/4] max-h-[540px] mb-2">
              <AnimatePresence>
                {remainingCompanies.length > 0 ? (
                  <>
                    {/* Next Card behind */}
                    {nextCard && (
                      <SwipeCard
                        key={nextCard.id}
                        company={nextCard}
                        isFront={false}
                        onSwipe={() => {}}
                        onOpenDetails={() => setInspectCompany(nextCard)}
                      />
                    )}

                    {/* Front Card */}
                    {currentCard && (
                      <SwipeCard
                        key={currentCard.id}
                        company={currentCard}
                        isFront={true}
                        onSwipe={handleSwipe}
                        onOpenDetails={() => setInspectCompany(currentCard)}
                      />
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-white rounded-[2rem] border border-slate-200 shadow-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      Alle Betriebe angesehen!
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Du hast alle verfügbaren Plätze in dieser Kategorie durchstöbert. Sieh dir jetzt deine gespeicherten Favoriten an.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentIndex(0);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Karten von vorn</span>
                      </button>
                      <button
                        onClick={() => setActiveView('matches')}
                        className="px-4 py-2 bg-school-blue text-white font-bold text-xs rounded-xl shadow-md"
                      >
                        Zu meinen Favoriten ({likes.length})
                      </button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Swipe Controls Bar */}
            <SwipeControls
              onDislike={() => handleSwipe('left')}
              onLike={() => handleSwipe('right')}
              onSuperLike={() => handleSwipe('super')}
              onUndo={handleUndo}
              canUndo={currentIndex > 0}
              disabled={remainingCompanies.length === 0}
            />

            <div className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase text-center pb-1">
              Swipe links: Weiter • Swipe rechts: Merken • Hoch: Traumberuf
            </div>
          </div>
        )}

        {/* VIEW 2: Matches & Shortlist */}
        {activeView === 'matches' && auth.role && (
          <div className="w-full flex-1">
            <MatchesView
              companies={companies}
              likes={likes}
              superLikes={superLikes}
              onRemoveMatch={handleRemoveMatch}
              onSetSuperLike={handleSetSuperLike}
              onOpenDetails={(c) => setInspectCompany(c)}
              onBackToSwipe={() => setActiveView('swipe')}
              studentCode={auth.studentCode}
            />
          </div>
        )}

        {/* VIEW 3: Teacher Dashboard */}
        {activeView === 'teacher' && auth.role === 'teacher' && (
          <div className="w-full flex-1">
            <TeacherDashboard
              companies={companies}
              studentPreferences={allPreferences}
              onSaveCompany={handleTeacherSaveCompany}
              onClose={() => setActiveView('swipe')}
            />
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {inspectCompany && (
        <CompanyDetailModal
          company={inspectCompany}
          onClose={() => setInspectCompany(null)}
          onLike={(id) => {
            if (!likes.includes(id)) {
              const newLikes = [...likes, id];
              setLikes(newLikes);
              persistPreferences(newLikes, superLikes, dislikes);
            }
            setInspectCompany(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
