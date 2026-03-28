import React, { useState } from 'react';
import { Topic } from '../data/types';

interface FormulasProps {
  topic: Topic;
}

export function Formulas({ topic }: FormulasProps) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = topic.formulas.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.formula.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  const copyFormula = (formula: string, name: string) => {
    navigator.clipboard.writeText(formula).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (topic.formulas.length === 1 && topic.formulas[0].formula === 'N/A') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <p style={{ fontSize: 16 }}>{topic.formulas[0].description}</p>
        <p style={{ marginTop: 8, fontSize: 14 }}>Focus on applying the Standards to real-world scenarios.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search formulas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = topic.color)}
          onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((formula, i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{
              padding: '12px 16px',
              background: topic.color + '10',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: topic.color }}>{formula.name}</span>
              <button
                onClick={() => copyFormula(formula.formula, formula.name)}
                style={{
                  background: 'none',
                  border: `1px solid ${topic.color}40`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 12,
                  color: topic.color,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {copied === formula.name ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '14px 16px',
                fontFamily: 'monospace',
                fontSize: 16,
                color: '#1e293b',
                fontWeight: 600,
                letterSpacing: 0.3,
                marginBottom: 10,
                wordBreak: 'break-all',
              }}>
                {formula.formula}
              </div>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                {formula.description}
              </p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            No formulas match your search.
          </div>
        )}
      </div>

      <div style={{
        marginTop: 28,
        padding: '16px 20px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 12,
        fontSize: 13,
        color: '#1e40af',
        lineHeight: 1.6,
      }}>
        <strong>Study Tip:</strong> The CFA exam provides a formula sheet for selected formulas (mainly fixed income and derivatives). However, knowing the formulas conceptually — not just memorizing them — is what leads to correct answers on exam day.
      </div>
    </div>
  );
}
