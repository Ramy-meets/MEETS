
import { Grade, User } from '../types';

const GRADES_KEY = 'educational_grades_db';
const STUDENTS_KEY = 'educational_students_list';

export const storageService = {
  // Grades Logic
  getGrades: (): Grade[] => {
    const data = localStorage.getItem(GRADES_KEY);
    return data ? JSON.parse(data) : [];
  },

  addGrade: (grade: Omit<Grade, 'id' | 'date'>) => {
    const grades = storageService.getGrades();
    const newGrade: Grade = {
      ...grade,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    const updated = [newGrade, ...grades];
    localStorage.setItem(GRADES_KEY, JSON.stringify(updated));
    return newGrade;
  },

  deleteGrade: (id: string) => {
    const grades = storageService.getGrades();
    const updated = grades.filter(g => g.id !== id);
    localStorage.setItem(GRADES_KEY, JSON.stringify(updated));
  },

  getStudentGrades: (email: string): Grade[] => {
    return storageService.getGrades().filter(g => g.studentEmail.toLowerCase() === email.toLowerCase());
  },

  getTeacherGrades: (teacherName: string): Grade[] => {
    return storageService.getGrades().filter(g => g.teacherName === teacherName);
  },

  // Students Directory Logic
  registerStudent: (student: { name: string, email: string }) => {
    const students = storageService.getRegisteredStudents();
    const exists = students.find(s => s.email.toLowerCase() === student.email.toLowerCase());
    if (!exists) {
      const updated = [...students, student];
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(updated));
    }
  },

  getRegisteredStudents: (): { name: string, email: string }[] => {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  }
};
