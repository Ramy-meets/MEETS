
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || (role === UserRole.TEACHER && !subject)) {
      alert('يرجى ملء كافة البيانات المطلوبة');
      return;
    }
    
    const user: User = { email, name, role, subject: role === UserRole.TEACHER ? subject : undefined };
    
    // If student, register them in the global directory for teachers to see
    if (role === UserRole.STUDENT) {
      storageService.registerStudent({ name, email });
    }
    
    onLogin(user);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-100 rounded-2xl mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">أهلاً بك في مدرستي</h1>
          <p className="text-gray-500 mt-2">يرجى تسجيل الدخول للوصول إلى بياناتك</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setRole(UserRole.STUDENT)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
          >
            أنا طالب
          </button>
          <button
            onClick={() => setRole(UserRole.TEACHER)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${role === UserRole.TEACHER ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500'}`}
          >
            أنا معلم
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم بالكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="أدخل اسمك هنا"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="name@example.com"
            />
          </div>

          {role === UserRole.TEACHER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المادة الدراسية</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                placeholder="مثال: رياضيات، لغة عربية..."
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${role === UserRole.STUDENT ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            دخول للمنصة
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
