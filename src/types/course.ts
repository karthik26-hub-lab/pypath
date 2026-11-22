export type AppView = 'chapters' | 'chapter' | 'book' | 'dsa' | 'roadmap' | 'progress';
export type ThemeMode = 'dark' | 'light';

export interface TranscriptSegment {
  id: string;
  timestampSeconds: number;
  timestampLabel: string;
  heading: string;
  summary: string;
  takeaway: string;
}

export interface KeyExcerpt {
  id: string;
  timestampSeconds: number;
  timestampLabel: string;
  quote: string;
  whyItMatters: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  domain: string;
  scenario: string;
  solutionSummary: string;
  codeSnippet: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Applied';
  keyPoints: string[];
  modelAnswer: string;
}

export interface CourseModule {
  id: string;
  order: number;
  phase: 1 | 2 | 3 | 4;
  phaseTitle: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  durationMinutes: number;
  overview: string;
  concepts: string[];
  transcript: TranscriptSegment[];
  excerpts: KeyExcerpt[];
  caseStudies: CaseStudy[];
  interviewQuestions: InterviewQuestion[];
  linkedDsaIds: string[];
}

export interface DsaTestCase {
  name: string;
  callExpression: string;
  expectedJson: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  moduleId: string;
  difficulty: 'Easy' | 'Medium';
  pattern: string;
  estimatedMinutes: number;
  aiContext: string;
  description: string;
  constraints: string[];
  functionName: string;
  starterCode: string;
  solutionCode: string;
  complexity: string;
  testCases: DsaTestCase[];
}

export interface StudyNote {
  id: string;
  moduleId: string;
  timestampSeconds: number;
  timestampLabel: string;
  content: string;
  updatedAtIso: string;
}

export interface RoadmapDay {
  id: string;
  dayNumber: number;
  title: string;
  focusType: 'Learn' | 'Practice' | 'Spaced Review' | 'Capstone';
  estimatedMinutes: number;
  moduleIds: string[];
  dsaIds: string[];
  retentionTip: string;
  checklist: string[];
}

export interface PersonalizedRoadmap {
  id: string;
  title: string;
  goal: string;
  experienceLevel: string;
  dailyMinutes: number;
  totalDays: number;
  summary: string;
  days: RoadmapDay[];
  generatedBy: 'ai' | 'local';
  createdAtIso: string;
}

export interface StudyProgressState {
  completedModuleIds: string[];
  solvedProblemIds: string[];
  masteredInterviewIds: string[];
  completedRoadmapDayIds: string[];
  lastModuleId: string;
  theme: ThemeMode;
}

export interface PythonTestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface PythonRunResponse {
  passed: boolean;
  stdout: string;
  stderr: string;
  executionMs: number;
  results: PythonTestResult[];
}

export interface DebugAssistResponse {
  summary: string;
  rootCause: string;
  lineHints: string[];
  conceptualTip: string;
  fixedCode: string;
}

export interface InterviewEvaluationResponse {
  verdict: 'Strong' | 'Developing' | 'Needs Review';
  scoreOutOf5: number;
  strengths: string[];
  missingConcepts: string[];
  improvedAnswer: string;
}
