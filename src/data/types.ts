export interface Concept {
  title: string;
  explanation: string;
  keyPoints: string[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Formula {
  name: string;
  formula: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  shortTitle: string;
  examWeight: string;
  color: string;
  icon: string;
  description: string;
  learningObjectives: string[];
  concepts: Concept[];
  questions: Question[];
  flashcards: Flashcard[];
  formulas: Formula[];
}
