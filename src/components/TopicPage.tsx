import React, { useState } from 'react';
import { Topic } from '../data/types';
import { useProgress } from '../hooks/useProgress';
import { Quiz } from './Quiz';
import { Flashcards } from './Flashcards';
import { Formulas } from './Formulas';

type Tab = 'lessons' | 'quiz' | 'flashcards' | 'formulas';

interface TopicPageProps {
  topic: Topic;
  onBack: () => void;
}

export function TopicPage({ topic, onBack }: TopicPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('lessons');
  const { markConceptComplete, progress, getTopicProgress } = useProgress();
  const [expandedConcept, setExpandedConcept] = useState<number | null>(0);

  const topicProgress = getTopicProgress(topic.id, topic.concepts.length, topic.questions.length, topic.flashcards.length);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'lessons', label: 'Lessons', icon: '📖' },
    { id: 'quiz', label: 'Practice Quiz', icon: '❓' },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏' },
    { id: 'formulas', label: 'Formulas', icon: '📐' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', color: '#6b7280',
          fontSize: 14, cursor: 'pointer', marginBottom: 20, padding: 0,
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${topic.color} 0%, ${topic.color}cc 100%)`,
        borderRadius: 16,
        padding: '28px 28px',
        color: '#fff',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            flexShrink: 0,
          }}>
            {topic.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>
              EXAM WEIGHT: {topic.examWeight}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{topic.title}</h1>
            <p style={{ opacity: 0.9, fontSize: 14, lineHeight: 1.6, maxWidth: 600 }}>
              {topic.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, opacity: 0.9 }}>
            <span>Topic Progress</span>
            <span style={{ fontWeight: 700 }}>{topicProgress}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${topicProgress}%`,
              background: '#fff',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#15803d', marginBottom: 10 }}>
          Learning Objectives
        </div>
        <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {topic.learningObjectives.map((obj, i) => (
            <li key={i} style={{ fontSize: 14, color: '#166534', lineHeight: 1.5 }}>{obj}</li>
          ))}
        </ul>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f3f4f6', borderRadius: 12, padding: 4 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 9,
              border: 'none',
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? topic.color : '#6b7280',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <span>{tab.icon}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'lessons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topic.concepts.map((concept, idx) => {
            const conceptId = `${topic.id}-c${idx}`;
            const isComplete = progress.completedConcepts[conceptId];
            const isExpanded = expandedConcept === idx;

            return (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: `1px solid ${isComplete ? '#bbf7d0' : '#e5e7eb'}`,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <button
                  onClick={() => setExpandedConcept(isExpanded ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: isComplete ? '#f0fdf4' : '#fff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isComplete ? '#16a34a' : topic.color + '20',
                    color: isComplete ? '#fff' : topic.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>
                    {isComplete ? '✓' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{concept.title}</div>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: 18, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ▾
                  </div>
                </button>

                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f3f4f6' }}>
                    <p style={{ color: '#374151', lineHeight: 1.7, margin: '16px 0', fontSize: 15 }}>
                      {concept.explanation}
                    </p>

                    <div style={{
                      background: '#f9fafb',
                      borderRadius: 10,
                      padding: '16px',
                      marginBottom: 16,
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 10 }}>
                        Key Points:
                      </div>
                      <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {concept.keyPoints.map((point, i) => (
                          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
                            <span style={{ color: topic.color, flexShrink: 0, fontWeight: 700 }}>•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {!isComplete && (
                      <button
                        onClick={() => markConceptComplete(conceptId)}
                        style={{
                          padding: '10px 20px',
                          background: topic.color,
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: 'pointer',
                        }}
                      >
                        Mark as Complete ✓
                      </button>
                    )}
                    {isComplete && (
                      <div style={{ color: '#16a34a', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        ✓ Completed
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'quiz' && (
        <Quiz topic={topic} />
      )}

      {activeTab === 'flashcards' && (
        <Flashcards topic={topic} />
      )}

      {activeTab === 'formulas' && (
        <Formulas topic={topic} />
      )}
    </div>
  );
}
