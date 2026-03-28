import React, { useState } from 'react';
import { topics } from './data';
import { Dashboard } from './components/Dashboard';
import { TopicPage } from './components/TopicPage';

type View = { type: 'dashboard' } | { type: 'topic'; topicId: string };

export default function App() {
  const [view, setView] = useState<View>({ type: 'dashboard' });

  const currentTopic = view.type === 'topic'
    ? topics.find(t => t.id === view.topicId)
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Nav */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => setView({ type: 'dashboard' })}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #1a56db, #1e429f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 14,
            }}>
              CFA
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>
              Level 1 Study
            </span>
          </button>

          {currentTopic && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 14, color: '#6b7280',
            }}>
              <span>{currentTopic.icon}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{currentTopic.shortTitle}</span>
            </div>
          )}

          <div style={{ fontSize: 13, color: '#9ca3af' }}>
            {topics.length} Topics
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {view.type === 'dashboard' && (
          <Dashboard
            topics={topics}
            onSelectTopic={topicId => setView({ type: 'topic', topicId })}
          />
        )}
        {view.type === 'topic' && currentTopic && (
          <TopicPage
            topic={currentTopic}
            onBack={() => setView({ type: 'dashboard' })}
          />
        )}
      </main>
    </div>
  );
}
