
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Grade, User } from '../types';

interface Props {
  user: User;
}

interface BulkGradeEntry {
  score: string;
  feedback: string;
}

const TeacherView: React.FC<Props> = ({ user }) => {
  const [gradesHistory, setGradesHistory] = useState<Grade[]>([]);
  const [registeredStudents, setRegisteredStudents] = useState<{ name: string, email: string }[]>([]);
  const [bulkGrades, setBulkGrades] = useState<Record<string, BulkGradeEntry>>({});
  const [maxScoreGlobal, setMaxScoreGlobal] = useState('100');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    refreshData();
  }, [user.name]);

  const refreshData = () => {
    setGradesHistory(storageService.getTeacherGrades(user.name));
    const students = storageService.getRegisteredStudents();
    setRegisteredStudents(students);
    
    // Initialize bulk grades state for all registered students
    const initialBulk: Record<string, BulkGradeEntry> = {};
    students.forEach(s => {
      initialBulk[s.email] = { score: '', feedback: '' };
    });
    setBulkGrades(initialBulk);
  };

  const handleInputChange = (email: string, field: keyof BulkGradeEntry, value: string) => {
    setBulkGrades(prev => ({
      ...prev,
      [email]: {
        ...prev[email],
        [field]: value
      }
    }));
  };

  const handleBulkSave = () => {
    const studentsToSave = registeredStudents.filter(s => bulkGrades[s.email]?.score !== '');
    
    if (studentsToSave.length === 0) {
      alert('يرجى إدخال درجة واحدة على الأقل');
      return;
    }

    setIsSaving(true);
    
    studentsToSave.forEach(student => {
      const entry = bulkGrades[student.email];
      storageService.addGrade({
        studentEmail: student.email,
        studentName: student.name,
        teacherName: user.name,
        subject: user.subject || 'مادة عامة',
        score: parseFloat(entry.score),
        maxScore: parseFloat(maxScoreGlobal),
        feedback: entry.feedback
      });
    });

    setTimeout(() => {
      refreshData();
      setIsSaving(false);
      alert(`تم رصد درجات لـ ${studentsToSave.length} طالب بنجاح`);
    }, 500);
  };

  const handleDeleteHistory = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الدرجة من السجل؟')) {
      storageService.deleteGrade(id);
      setGradesHistory(storageService.getTeacherGrades(user.name));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">إدارة درجات الطلاب</h1>
          <p className="text-gray-500 mt-1">المادة: <span className="font-semibold text-teal-600">{user.subject}</span> | المدرس: {user.name}</p>
        </div>
        <div className="flex items-center gap-4 bg-teal-50 p-3 rounded-xl border border-teal-100">
          <label className="text-sm font-bold text-teal-700">الدرجة النهائية للمادة:</label>
          <input 
            type="number" 
            value={maxScoreGlobal}
            onChange={(e) => setMaxScoreGlobal(e.target.value)}
            className="w-20 p-2 border border-teal-200 rounded-lg text-center font-bold text-teal-700 outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </header>

      {/* Main Grade Entry Table (Teams Style) */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-teal-100 p-2 rounded-lg text-teal-600 text-sm">Step 1</span>
            رصد الدرجات الحالية
          </h2>
          <button
            onClick={handleBulkSave}
            disabled={isSaving || registeredStudents.length === 0}
            className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? 'جاري الحفظ...' : 'اعتماد وحفظ الكل ✨'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                <th className="p-4 border-b">اسم الطالب</th>
                <th className="p-4 border-b">البريد الإلكتروني</th>
                <th className="p-4 border-b w-32 text-center">الدرجة ({maxScoreGlobal})</th>
                <th className="p-4 border-b">ملاحظات للمستقبل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {registeredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400">
                    <div className="text-5xl mb-4">👥</div>
                    لا يوجد طلاب مسجلين حالياً. يرجى انتظار دخول الطلاب للمنصة أولاً.
                  </td>
                </tr>
              ) : (
                registeredStudents.map((student) => (
                  <tr key={student.email} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-gray-800">{student.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-400">{student.email}</span>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        placeholder="0"
                        value={bulkGrades[student.email]?.score || ''}
                        onChange={(e) => handleInputChange(student.email, 'score', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-center font-bold text-teal-700 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="مثال: مجهود رائع..."
                        value={bulkGrades[student.email]?.feedback || ''}
                        onChange={(e) => handleInputChange(student.email, 'feedback', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* History Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600 text-sm">Step 2</span>
          <h2 className="text-xl font-bold text-gray-800">سجل الدرجات المرصودة سابقاً</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="p-4 border-b">الطالب</th>
                <th className="p-4 border-b">الدرجة</th>
                <th className="p-4 border-b">الملاحظات</th>
                <th className="p-4 border-b">تاريخ الرصد</th>
                <th className="p-4 border-b text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {gradesHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">لا يوجد سجل درجات لهذه المادة بعد.</td>
                </tr>
              ) : (
                gradesHistory.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-700">{grade.studentName}</div>
                      <div className="text-[10px] text-gray-400">{grade.studentEmail}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-teal-600 font-bold">{grade.score}</span>
                      <span className="text-gray-300 text-xs"> / {grade.maxScore}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 italic max-w-xs truncate">
                      {grade.feedback || '---'}
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(grade.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteHistory(grade.id)}
                        className="text-red-300 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
                        title="حذف الدرجة"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TeacherView;
