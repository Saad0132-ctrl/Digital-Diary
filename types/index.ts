export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  description?: string;
  submissionDate?: Date;
  marks?: number;
  totalMarks?: number;
}

export interface KPIData {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  icon: string;
  sparklineData: number[];
  color: string;
  index?: number;
}

export interface PerformanceData {
  month: string;
  math: number;
  science: number;
  english: number;
  history: number;
}

export interface SubjectScore {
  subject: string;
  score: number;
  target: number;
}

export interface AttendanceData {
  week: string;
  percentage: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'quiz' | 'meeting' | 'deadline';
  subject?: string;
  description?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'message' | 'warning' | 'success';
  read: boolean;
  timestamp: Date;
}

export interface Grade {
  id: string;
  subject: string;
  assessment: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  date: Date;
  comments?: string;
}

export interface AttendanceRecord {
  id: string;
  date: Date;
  status: 'present' | 'absent' | 'leave';
  subject?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'academic' | 'behavioral' | 'attendance' | 'progress';
  generatedDate: Date;
  content: string;
}

export interface WeakConcept {
  id: string;
  topic: string;
  score: number;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'practice' | 'topic';
  difficulty: 'easy' | 'medium' | 'hard';
}
