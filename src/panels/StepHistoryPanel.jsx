// src/panels/StepHistoryPanel.jsx
import React, { useEffect, useRef } from 'react';

export function StepHistoryPanel({ steps, currentIndex }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Only scroll WITHIN the panel container — never touch the page scroll position
    if (containerRef.current && bottomRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [currentIndex]);

  if (!steps || steps.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-center text-secondary text-sm italic">
        No steps yet — load data and press Play.
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-low/50">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">history</span>
          Step History
        </span>
        <span className="text-xs text-secondary font-mono">{currentIndex + 1} / {steps.length}</span>
      </div>
      <div
        ref={containerRef}
        className="overflow-y-auto flex flex-col gap-0 max-h-52"
        style={{ scrollbarWidth: 'thin' }}
      >
        {steps.slice(0, currentIndex + 1).map((step, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 px-4 py-2.5 border-b border-outline-variant/30 transition-colors ${
                isCurrent
                  ? 'bg-primary/8 border-l-2 border-l-primary'
                  : 'opacity-50 hover:opacity-70'
              }`}
            >
              <span className={`shrink-0 font-mono text-[10px] pt-0.5 w-10 text-right ${isCurrent ? 'text-primary font-bold' : 'text-outline'}`}>
                #{idx + 1}
              </span>
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-medium leading-snug ${isCurrent ? 'text-on-surface' : 'text-secondary'}`}>
                  {step.explanation || '—'}
                </span>
                {step.subExplanation && isCurrent && (
                  <span className="text-[10px] text-secondary mt-0.5 leading-snug">{step.subExplanation}</span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
