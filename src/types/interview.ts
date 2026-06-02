export interface InterviewGuide {
  id: string;
  departmentId: string;
  departmentName: string;
  interviewGoal: string;
  commonQuestions: string[];
  departmentSpecificQuestions: string[];
  deepDiveQuestions: string[];
  dataToCollect: string[];
  assumptionsToVerify: string[];
  generatedAt: string;
}

export interface InterviewMaterial {
  id: string;
  departmentId: string;
  departmentName: string;
  transcript?: string;
  meetingNotes?: string;
  projectOwnerUnderstanding?: string;
  attachments?: string[];
  createdAt: string;
}

export interface StructuredInterviewNotes {
  id: string;
  departmentId: string;
  departmentName: string;
  basicSituation: string;
  coreProcesses: string[];
  mainWork: string[];
  repetitiveWork: string[];
  painPoints: string[];
  currentApproach: string[];
  systems: string[];
  data: string[];
  collaborationIssues: string[];
  aiOpportunities: string[];
  evidenceSources: string[];
}

export interface CoverageItem {
  originalQuestion: string;
  coverage: 'covered' | 'partially_covered' | 'not_covered';
  quality: 'high' | 'medium' | 'low';
  suggestion: string;
}
