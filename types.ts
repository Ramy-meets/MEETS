
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  GUEST = 'GUEST'
}

export interface Grade {
  id: string;
  studentEmail: string;
  studentName: string;
  teacherName: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  feedback?: string;
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  subject?: string; // For teachers
}
