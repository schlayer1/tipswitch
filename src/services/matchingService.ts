import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company, StudentPreferences } from '../types';
import { INITIAL_COMPANIES } from '../data/companiesData';

const COMPANIES_COLLECTION = 'tip_companies';
const PREFERENCES_COLLECTION = 'tip_student_preferences';

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const colRef = collection(db, COMPANIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: Company[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Company);
      });
      return list;
    }
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to local initial companies:', error);
  }
  return INITIAL_COMPANIES;
}

export async function saveCompany(company: Company): Promise<void> {
  try {
    const docRef = doc(db, COMPANIES_COLLECTION, company.id);
    await setDoc(docRef, company, { merge: true });
  } catch (error) {
    console.error('Error saving company to Firestore:', error);
    throw error;
  }
}

export async function seedCompaniesToFirestore(): Promise<number> {
  let count = 0;
  for (const comp of INITIAL_COMPANIES) {
    try {
      const docRef = doc(db, COMPANIES_COLLECTION, comp.id);
      await setDoc(docRef, comp, { merge: true });
      count++;
    } catch (e) {
      console.error('Error seeding company:', comp.id, e);
    }
  }
  return count;
}



export async function fetchStudentPreferences(studentCode: string): Promise<StudentPreferences | null> {
  const cleanCode = studentCode.trim().toUpperCase();
  try {
    const docRef = doc(db, PREFERENCES_COLLECTION, cleanCode);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StudentPreferences;
    }
  } catch (error) {
    console.warn('Error reading preferences from Firestore, trying localStorage:', error);
  }

  // Local fallback
  const local = localStorage.getItem(`tip_pref_${cleanCode}`);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveStudentPreferences(prefs: StudentPreferences): Promise<void> {
  const cleanCode = prefs.studentCode.trim().toUpperCase();
  const data = {
    ...prefs,
    studentCode: cleanCode,
    updatedAt: new Date().toISOString()
  };

  // Always persist locally for offline / instant availability
  localStorage.setItem(`tip_pref_${cleanCode}`, JSON.stringify(data));

  try {
    const docRef = doc(db, PREFERENCES_COLLECTION, cleanCode);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.warn('Firestore save failed, saved locally:', error);
  }
}

export async function fetchAllStudentPreferences(): Promise<StudentPreferences[]> {
  try {
    const colRef = collection(db, PREFERENCES_COLLECTION);
    const snap = await getDocs(colRef);
    const list: StudentPreferences[] = [];
    snap.forEach(d => {
      list.push(d.data() as StudentPreferences);
    });
    return list;
  } catch (error) {
    console.warn('Error fetching all preferences:', error);
    // Scan localStorage as fallback
    const list: StudentPreferences[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('tip_pref_')) {
        try {
          const val = JSON.parse(localStorage.getItem(key) || '');
          list.push(val);
        } catch {
          // ignore
        }
      }
    }
    return list;
  }
}
