export type CandidateStatus = 'Pending' | 'Active' | 'Passed' | 'Failed';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: CandidateStatus;
  appliedRole: string;
  averageScore: number; // 0 to 5
  lastInterviewDate: string;
  notes: string;
}

export type InterviewStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  interviewerName: string;
  role: string;
  date: string;
  time: string;
  status: InterviewStatus;
  notes?: string;
  score?: number;
  selectedLanguage?: string;
  codeSolution?: string;
  
  // Extended workflow properties
  duration?: number; // e.g., 60
  codingQuestions?: string[]; // question IDs
  aptitudeTestId?: string; // e.g., 'apt-1'
  joiningId?: string; // e.g., 'INT-482-192'
  interviewLink?: string;
  hrNotes?: string;
  hrRating?: number;
}

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionCategory = 'Algorithms' | 'Data Structures' | 'System Design' | 'Frontend';

export interface Question {
  id: string;
  title: string;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  description: string;
  starterCode: {
    [key: string]: string;
  };
  testCases: Array<{
    input: string;
    expected: string;
  }>;
}
