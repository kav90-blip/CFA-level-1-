import React, { useState, useCallback } from 'react';
import { Topic, Question } from '../data/types';
import { useProgress } from '../hooks/useProgress';

interface QuizProps {
  topic: Topic;
}

type QuizState = 'intro' | 'question' | 'result';

export function Quiz({ topic }: QuizProps) {
  const { markQuestionAnswered, saveQuizScore, progress } = useProgress();
  const [state, setState] = useState<QuizState>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const questions = topic.questions;
  const currentQ = questions[currentIdx];

  const startQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers(new Array(questions.length).fill(null));
    setState('question');
  };

  const handleAnswer = useCallback((optionIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    setShowExplanation(true);
    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) setScore(s => s + 1);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
    markQuestionAnswered(currentQ.id, isCorrect);
  }, [selectedAnswer, currentQ, currentIdx, answers, markQuestionAnswered]);

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      const finalScore = score + (selectedAnswer === currentQ.correctIndex ? 0 : 0);
      saveQuizScore(topic.id, score, questions.length);
      setState('result');
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const prevScore = progress.quizScores[topic.id];

  if (state === 'intro') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Practice Quiz</h2>
        <p style={{ color: '#6b7280', marginBottom: 8, fontSize: 15 }}>
          {questions.length} questions on {topic.shortTitle}
        </p>
        {prevScore && (
          <div style={{
            display: 'inline-block',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            padding: '8px 16px',
            marginBottom: 24,
            fontSize: 14,
            color: '#1e40af',
          }}>
            Previous score: {prevScore.correct}/{prevScore.total} ({Math.round(prevScore.correct / prevScore.total * 100)}%)
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          {['Easy', 'Medium', 'Hard'].map(diff => {
            const count = questions.filter(q => q.difficulty === diff.toLowerCase()).length;
            return count > 0 ? (
              <div key={diff} style={{
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: 8, padding: '8px 14px', fontSize: 13,
              }}>
                <span style={{
                  color: diff === 'Easy' ? '#16a34a' : diff === 'Medium' ? '#d97706' : '#dc2626',
                  fontWeight: 600,
                }}>{diff}</span>: {count}
              </div>
            ) : null;
          })}
        </div>
        <button
          onClick={startQuiz}
          style={{
            marginTop: 32,
            padding: '14px 36px',
            background: topic.color,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (state === 'result') {
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 70 ? '🏆 Pass' : pct >= 50 ? '📈 Getting There' : '📚 Keep Studying';
    const color = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';

    return (
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>
          {pct >= 70 ? '🏆' : pct >= 50 ? '📈' : '📚'}
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color }}>
          {pct}% — {grade}
        </h2>
        <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 32 }}>
          You answered {score} out of {questions.length} questions correctly.
        </p>

        {/* Answer Review */}
        <div style={{ textAlign: 'left', marginBottom: 32 }}>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} style={{
                background: isCorrect ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 10,
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{isCorrect ? '✅' : '❌'}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 4 }}>
                      Q{i + 1}: {q.question.slice(0, 80)}...
                    </div>
                    {!isCorrect && (
                      <div style={{ fontSize: 13, color: '#374151' }}>
                        <span style={{ color: '#dc2626' }}>Your answer: </span>{q.options[userAnswer ?? 0]}
                        <br />
                        <span style={{ color: '#16a34a' }}>Correct: </span>{q.options[q.correctIndex]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={startQuiz}
          style={{
            padding: '12px 28px',
            background: topic.color,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  // Question state
  const difficultyColor = currentQ.difficulty === 'easy' ? '#16a34a' : currentQ.difficulty === 'medium' ? '#d97706' : '#dc2626';

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span style={{ color: difficultyColor, fontWeight: 600, textTransform: 'capitalize' }}>
            {currentQ.difficulty}
          </span>
        </div>
        <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((currentIdx) / questions.length) * 100}%`,
            background: topic.color,
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#111827', fontWeight: 500, margin: 0 }}>
          {currentQ.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {currentQ.options.map((option, idx) => {
          let bg = '#fff';
          let border = '#e5e7eb';
          let color = '#374151';
          let fontWeight = 400;

          if (selectedAnswer !== null) {
            if (idx === currentQ.correctIndex) {
              bg = '#f0fdf4'; border = '#16a34a'; color = '#15803d'; fontWeight = 600;
            } else if (idx === selectedAnswer && selectedAnswer !== currentQ.correctIndex) {
              bg = '#fef2f2'; border = '#ef4444'; color = '#dc2626';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              style={{
                padding: '14px 18px',
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: 10,
                textAlign: 'left',
                cursor: selectedAnswer !== null ? 'default' : 'pointer',
                fontSize: 14,
                color,
                fontWeight,
                lineHeight: 1.5,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
              onMouseOver={e => {
                if (selectedAnswer === null) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = topic.color;
                  (e.currentTarget as HTMLButtonElement).style.background = topic.color + '08';
                }
              }}
              onMouseOut={e => {
                if (selectedAnswer === null) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
                  (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                }
              }}
            >
              <span style={{
                minWidth: 24, height: 24, borderRadius: '50%',
                background: selectedAnswer !== null
                  ? (idx === currentQ.correctIndex ? '#16a34a' : idx === selectedAnswer ? '#ef4444' : '#f3f4f6')
                  : '#f3f4f6',
                color: selectedAnswer !== null && (idx === currentQ.correctIndex || idx === selectedAnswer) ? '#fff' : '#374151',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1,
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e', marginBottom: 8 }}>
            💡 Explanation
          </div>
          <p style={{ fontSize: 14, color: '#78350f', lineHeight: 1.7, margin: 0 }}>
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {showExplanation && (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '14px',
            background: topic.color,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {currentIdx + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
