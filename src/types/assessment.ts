export interface AssessmentQuestion {
  id: string;
  type: 'likert' | 'multiple-choice' | 'slider' | 'scenario';
  category: 'psychometric' | 'technical' | 'wiscar';
  subcategory?: string;
  question: string;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface AssessmentAnswer {
  questionId: string;
  value: number | string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: AssessmentQuestion[];
}

export interface WISCARScores {
  W: number; // Will
  I: number; // Interest
  S: number; // Skill
  C: number; // Cognitive
  A: number; // Ability to Learn
  R: number; // Real-World Alignment
  overall_confidence: number;
}

export interface AssessmentResults {
  psychological_fit: number;
  technical_readiness: number;
  wiscar: WISCARScores;
  recommendation: 'Yes' | 'Maybe' | 'No';
  confidence_score: number;
  next_steps: string[];
  career_alignment: string[];
  skill_gaps: Record<string, string>;
  ideal_path: string[];
}

export interface UserProgress {
  currentSection: number;
  completedQuestions: number;
  totalQuestions: number;
  answers: AssessmentAnswer[];
}