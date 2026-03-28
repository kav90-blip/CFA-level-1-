import React, { useState } from 'react';
import { Topic } from '../data/types';
import { useProgress } from '../hooks/useProgress';

interface FlashcardsProps {
  topic: Topic;
}

export function Flashcards({ topic }: FlashcardsProps) {
  const { markFlashcardReviewed, progress } = useProgress();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedSet, setReviewedSet] = useState<Set<string>>(new Set());

  const cards = topic.flashcards;
  const card = cards[currentIdx];
  const reviewedCount = cards.filter(c => progress.reviewedFlashcards[c.id]).length;

  const handleFlip = () => setFlipped(f => !f);

  const handleKnow = () => {
    markFlashcardReviewed(card.id);
    setReviewedSet(s => new Set([...s, card.id]));
    goNext();
  };

  const handleDontKnow = () => {
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIdx(i => (i + 1) % cards.length);
    }, 150);
  };

  const goPrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIdx(i => (i - 1 + cards.length) % cards.length);
    }, 150);
  };

  const isReviewed = progress.reviewedFlashcards[card.id];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: topic.color }}>{currentIdx + 1}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>of {cards.length}</div>
        </div>
        <div style={{ width: 1, background: '#e5e7eb' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>{reviewedCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Learned</div>
        </div>
        <div style={{ width: 1, background: '#e5e7eb' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#d97706' }}>{cards.length - reviewedCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Remaining</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, marginBottom: 28, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(reviewedCount / cards.length) * 100}%`,
          background: '#16a34a',
          borderRadius: 3,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Card */}
      <div
        onClick={handleFlip}
        style={{
          background: flipped ? topic.color : '#fff',
          border: `2px solid ${flipped ? topic.color : '#e5e7eb'}`,
          borderRadius: 20,
          padding: '40px 32px',
          minHeight: 260,
          cursor: 'pointer',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          position: 'relative',
          marginBottom: 24,
        }}
      >
        {isReviewed && (
          <div style={{
            position: 'absolute', top: 16, right: 16,
            background: '#16a34a', color: '#fff',
            borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700,
          }}>
            ✓ Learned
          </div>
        )}

        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
          color: flipped ? 'rgba(255,255,255,0.7)' : '#9ca3af',
          textTransform: 'uppercase',
        }}>
          {flipped ? 'Answer' : 'Question — Click to flip'}
        </div>

        <div style={{
          fontSize: flipped ? 15 : 18,
          fontWeight: flipped ? 500 : 700,
          color: flipped ? '#fff' : '#111827',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}>
          {flipped ? card.back : card.front}
        </div>

        {!flipped && (
          <div style={{ fontSize: 24, color: '#d1d5db' }}>↕</div>
        )}
      </div>

      {/* Actions */}
      {flipped ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleDontKnow}
            style={{
              flex: 1, padding: '14px',
              background: '#fef2f2', color: '#dc2626',
              border: '2px solid #fecaca', borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            ✗ Still Learning
          </button>
          <button
            onClick={handleKnow}
            style={{
              flex: 1, padding: '14px',
              background: '#f0fdf4', color: '#16a34a',
              border: '2px solid #bbf7d0', borderRadius: 12,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            ✓ Got It!
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={goPrev}
            style={{
              flex: 1, padding: '12px',
              background: '#f9fafb', color: '#374151',
              border: '1px solid #e5e7eb', borderRadius: 10,
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            ← Previous
          </button>
          <button
            onClick={handleFlip}
            style={{
              flex: 2, padding: '12px',
              background: topic.color, color: '#fff',
              border: 'none', borderRadius: 10,
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            Reveal Answer
          </button>
          <button
            onClick={goNext}
            style={{
              flex: 1, padding: '12px',
              background: '#f9fafb', color: '#374151',
              border: '1px solid #e5e7eb', borderRadius: 10,
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* All cards list */}
      <div style={{ marginTop: 36 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 12 }}>
          All Cards ({cards.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setCurrentIdx(i); setFlipped(false); }}
              style={{
                padding: '10px 14px',
                background: currentIdx === i ? topic.color + '12' : '#f9fafb',
                border: `1px solid ${currentIdx === i ? topic.color : '#e5e7eb'}`,
                borderRadius: 8,
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 13,
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {progress.reviewedFlashcards[c.id] && (
                <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
              )}
              <span style={{ fontWeight: currentIdx === i ? 600 : 400 }}>{c.front}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
