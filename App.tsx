
import React, { useState } from 'react';
import { User, UserRole } from './types';
import Login from './components/Login';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen">
      {currentUser && (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-600">
                منصة الدرجات الذكية
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-800">{currentUser.name}</span>
                <span className="text-xs text-gray-400">{currentUser.role === UserRole.TEACHER ? `معلم ${currentUser.subject}` : 'طالب'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                title="تسجيل الخروج"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className="container mx-auto py-6">
        {!currentUser ? (
          <Login onLogin={setCurrentUser} />
        ) : currentUser.role === UserRole.TEACHER ? (
          <TeacherView user={currentUser} />
        ) : (
          <StudentView user={currentUser} />
        )}
      </main>

      <footer className="py-12 mt-auto border-t bg-gray-50 text-center text-gray-400 text-sm">
        <p>© 2024 نظام إدارة الدرجات المتطور - مدعوم بالذكاء الاصطناعي</p>
      </footer>
    </div>
  );
};

export default App;
