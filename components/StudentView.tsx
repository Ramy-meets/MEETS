
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { Grade, User } from '../types';

interface Props {
  user: User;
}

const StudentView: React.FC<Props> = ({ user }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const studentGrades = storageService.getStudentGrades(user.email);
    setGrades(studentGrades);
  }, [user.email]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await geminiService.analyzeGrades(grades, user.name);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8 text-center md:text-right">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">مرحباً بك، {user.name}</h1>
        <p className="text-gray-600">هنا يمكنك متابعة تقدمك الدراسي في جميع المواد.</p>
      </header>

      {grades.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
          <div className="text-gray-400 mb-4 text-6xl">📊</div>
          <p className="text-lg text-gray-500">لا توجد درجات مسجلة لك بعد.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grades.map((grade) => (
              <div key={grade.id} className="bg-white p-6 rounded-2xl shadow-md border-r-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-800">{grade.subject}</h3>
                  <span className="text-xs text-gray-400">{new Date(grade.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-indigo-600">{grade.score}</span>
                  <span className="text-gray-400">/ {grade.maxScore}</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">المدرس: {grade.teacherName}</div>
                {grade.feedback && (
                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm italic text-indigo-700">
                    "{grade.feedback}"
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-l from-indigo-600 to-blue-500 text-white p-8 rounded-3xl mt-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>✨</span>
              تحليل الأداء بالذكاء الاصطناعي
            </h2>
            <p className="mb-6 opacity-90">احصل على تحليل مخصص لمستواك الدراسي ونصائح للتحسين.</p>
            
            {analysis ? (
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? 'جاري التحليل...' : 'ابدأ التحليل الآن'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentView;
