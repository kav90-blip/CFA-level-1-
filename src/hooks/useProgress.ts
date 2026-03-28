import { useState, useEffect } from 'react';

export interface Progress {
  completedConcepts: Record<string, boolean>;
  completedQuestions: Record<string, boolean>;
  correctQuestions: Record<string, boolean>;
  reviewedFlashcards: Record<string, boolean>;
  quizScores: Record<string, { correct: number; total: number }>;
}

const DEFAULT_PROGRESS: Progress = {
  completedConcepts: {},
  completedQuestions: {},
  correctQuestions: {},
  reviewedFlashcards: {},
  quizScores: {},
};

const STORAGE_KEY = 'cfa-level1-progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markConceptComplete = (conceptId: string) => {
    setProgress(p => ({
      ...p,
      completedConcepts: { ...p.completedConcepts, [conceptId]: true },
    }));
  };

  const markQuestionAnswered = (questionId: string, correct: boolean) => {
    setProgress(p => ({
      ...p,
      completedQuestions: { ...p.completedQuestions, [questionId]: true },
      correctQuestions: { ...p.correctQuestions, [questionId]: correct },
    }));
  };

  const markFlashcardReviewed = (flashcardId: string) => {
    setProgress(p => ({
      ...p,
      reviewedFlashcards: { ...p.reviewedFlashcards, [flashcardId]: true },
    }));
  };

  const saveQuizScore = (topicId: string, correct: number, total: number) => {
    setProgress(p => ({
      ...p,
      quizScores: { ...p.quizScores, [topicId]: { correct, total } },
    }));
  };

  const getTopicProgress = (topicId: string, conceptCount: number, questionCount: number, flashcardCount: number) => {
    const concepts = Object.keys(progress.completedConcepts)
      .filter(k => k.startsWith(topicId)).length;
    const questions = Object.keys(progress.completedQuestions)
      .filter(k => k.startsWith(topicId)).length;
    const flashcards = Object.keys(progress.reviewedFlashcards)
      .filter(k => k.startsWith(topicId)).length;

    const total = conceptCount + questionCount + flashcardCount;
    const done = concepts + questions + flashcards;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  return {
    progress,
    markConceptComplete,
    markQuestionAnswered,
    markFlashcardReviewed,
    saveQuizScore,
    getTopicProgress,
    resetProgress,
  };
}
