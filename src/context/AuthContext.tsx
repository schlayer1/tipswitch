import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAuth } from '../types';

interface AuthContextType {
  auth: UserAuth;
  isLoading: boolean;
  loginAsStudent: (code: string, name?: string, studentClass?: string) => void;
  loginAsTeacher: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<UserAuth>({
    role: null,
    studentCode: '',
    studentName: '',
    studentClass: '8a',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('tip_auth_role') as UserAuth['role'];
      const savedCode = localStorage.getItem('tip_auth_student_code') || '';
      const savedName = localStorage.getItem('tip_auth_student_name') || '';
      const savedClass = localStorage.getItem('tip_auth_student_class') || '8a';

      if (savedRole) {
        setAuth({
          role: savedRole,
          studentCode: savedCode,
          studentName: savedName,
          studentClass: savedClass,
        });
      }
    } catch (e) {
      console.error('Failed to load auth from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsStudent = (code: string, name?: string, studentClass = '8a') => {
    const cleanCode = code.trim().toUpperCase();
    const studentName = name || cleanCode;
    setAuth({
      role: 'student',
      studentCode: cleanCode,
      studentName,
      studentClass,
    });
    localStorage.setItem('tip_auth_role', 'student');
    localStorage.setItem('tip_auth_student_code', cleanCode);
    localStorage.setItem('tip_auth_student_name', studentName);
    localStorage.setItem('tip_auth_student_class', studentClass);
  };

  const loginAsTeacher = (password: string): boolean => {
    // School teacher master passcode
    if (password === 'hbs-lehrer' || password === 'kahla2026' || password === 'lehrer') {
      setAuth({
        role: 'teacher',
        studentCode: 'TEACHER',
        studentName: 'Lehrkraft',
        studentClass: 'Admin',
      });
      localStorage.setItem('tip_auth_role', 'teacher');
      localStorage.setItem('tip_auth_student_code', 'TEACHER');
      localStorage.setItem('tip_auth_student_name', 'Lehrkraft');
      localStorage.setItem('tip_auth_student_class', 'Admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      role: null,
      studentCode: '',
      studentName: '',
      studentClass: '8a',
    });
    localStorage.removeItem('tip_auth_role');
    localStorage.removeItem('tip_auth_student_code');
    localStorage.removeItem('tip_auth_student_name');
    localStorage.removeItem('tip_auth_student_class');
  };

  return (
    <AuthContext.Provider value={{ auth, isLoading, loginAsStudent, loginAsTeacher, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
