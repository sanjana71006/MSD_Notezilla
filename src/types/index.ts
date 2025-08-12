export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'moderator' | 'admin';
  college: string;
  profilePicture?: string;
  createdAt: string;
  uploadCount: number;
  downloadCount: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  year: string;
  semester: string;
  subject: string;
  examType: string;
  uploaderId: string;
  uploaderName: string;
  uploadDate: string;
  downloadCount: number;
  likes: number;
  isApproved: boolean;
  tags: string[];
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

export interface FilterState {
  year: string;
  semester: string;
  subject: string;
  examType: string;
  search: string;
}

export const EXAM_TYPES = ['T1', 'T2', 'T3', 'T4', 'T5', 'Summative', 'Lab', 'Internals', 'Viva'];
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];