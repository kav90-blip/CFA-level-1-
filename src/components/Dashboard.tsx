import React from 'react';
import { Topic } from '../data/types';
import { useProgress } from '../hooks/useProgress';

interface DashboardProps {
  topics: Topic[];
  onSelectTopic: (topicId: string) => void;
}

export function Dashboard({ topics, onSelectTopic }: DashboardProps) {
  const { getTopicProgress, progress, resetProgress } = useProgress();

  const totalProgress = Math.round(
    topics.reduce((sum, t) => sum + getTopicProgress(t.id, t.concepts.length, t.questions.length, t.flashcards.length), 0) / topics.length
  );

  const totalQuestions = Object.keys(progress.completedQuestions).length;
  const totalCorrect = Object.keys(progress.correctQuestions).filter(k => progress.correctQuestions[k]).length;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #1e429f 100%)',
        borderRadius: 20,
        padding: '40px 32px',
        color: '#fff',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, opacity: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>
            CFA Institute · Level I Curriculum
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>CFA Level 1 Study App</h1>
          <p style={{ opacity: 0.85, fontSize: 16, maxWidth: 500 }}>
            Master all 10 topic areas with lessons, practice questions, and flashcards. Track your progress as you study.
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
            <StatBadge label="Overall Progress" value={`${totalProgress}%`} />
            <StatBadge label="Questions Answered" value={String(totalQuestions)} />
            <StatBadge label="Correct Answers" value={totalQuestions > 0 ? `${Math.round(totalCorrect / totalQuestions * 100)}%` : '—'} />
            <StatBadge label="Topics" value="10" />
          </div>
        </div>
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', right: 60, bottom: -60,
          width: 150, height: 150, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
      </div>

      {/* Overall progress bar */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 32,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Curriculum Progress</span>
            <span style={{ fontSize: 14, color: '#1a56db', fontWeight: 700 }}>{totalProgress}%</span>
          </div>
          <div style={{ height: 10, background: '#e5e7eb', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${totalProgress}%`,
              background: 'linear-gradient(90deg, #1a56db, #0e9f6e)',
              borderRadius: 5,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
        <button
          onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetProgress(); }}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
            background: '#fff', fontSize: 13, color: '#6b7280',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          Reset Progress
        </button>
      </div>

      {/* CFA Exam Info */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 32,
        fontSize: 14,
        color: '#92400e',
      }}>
        <strong>Exam Format:</strong> The CFA Level I exam consists of two 2 hour 15 minute sessions with 90 multiple-choice questions each (180 total). Questions are scenario-based and may appear in vignettes. Ethics always counts for 15–20% of the exam.
      </div>

      {/* Topic Grid */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#111827' }}>
        Topic Areas
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      }}>
        {topics.map(topic => {
          const pct = getTopicProgress(topic.id, topic.concepts.length, topic.questions.length, topic.flashcards.length);
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              progress={pct}
              onClick={() => onSelectTopic(topic.id)}
            />
          );
        })}
      </div>

      <footer style={{ textAlign: 'center', marginTop: 48, color: '#9ca3af', fontSize: 13 }}>
        Study content is for educational purposes. Always refer to official CFA Institute curriculum.
      </footer>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px', minWidth: 90 }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{label}</div>
    </div>
  );
}

function TopicCard({ topic, progress, onClick }: { topic: Topic; progress: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        border: `1px solid #e5e7eb`,
        borderRadius: 14,
        padding: '20px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = topic.color;
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: topic.color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {topic.icon}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: topic.color,
          background: topic.color + '15', padding: '3px 8px', borderRadius: 20,
        }}>
          {topic.examWeight}
        </span>
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>
          {topic.title}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
          {topic.description.slice(0, 90)}...
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9ca3af' }}>
        <span>📖 {topic.concepts.length} lessons</span>
        <span>❓ {topic.questions.length} questions</span>
        <span>🃏 {topic.flashcards.length} cards</span>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
          <span style={{ color: '#6b7280' }}>Progress</span>
          <span style={{ fontWeight: 600, color: progress > 0 ? topic.color : '#9ca3af' }}>{progress}%</span>
        </div>
        <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: topic.color,
            borderRadius: 3,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>
    </button>
  );
}
