// src/panels/TheoryPanel.jsx
import React from 'react';

function ComplexityBadge({ label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">{label}</span>
      <code className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${colors[color]} font-mono`}>{value}</code>
    </div>
  );
}

export function TheoryPanel({ theory, algoName }) {
  if (!theory) {
    return (
      <div className="text-center py-20 text-secondary">
        <span className="material-symbols-outlined text-4xl mb-4 block">menu_book</span>
        <p>Theory content coming soon for this algorithm.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-8">
      {/* Definition */}
      <section>
        <h3 className="text-2xl font-serif text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span>
          Definition
        </h3>
        <p className="text-on-surface-variant leading-relaxed text-base border-l-4 border-primary/30 pl-5 py-2 bg-primary/3 rounded-r-lg">
          {theory.definition}
        </p>
      </section>

      {/* Algorithm Steps */}
      <section>
        <h3 className="text-2xl font-serif text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">format_list_numbered</span>
          Algorithm Steps
        </h3>
        <ol className="space-y-3">
          {theory.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-on-surface-variant leading-snug pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Complexity */}
      <section>
        <h3 className="text-2xl font-serif text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">speed</span>
          Complexity Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
          {theory.timeComplexity.best && (
            <ComplexityBadge label="Best Case" value={theory.timeComplexity.best} color="success" />
          )}
          <ComplexityBadge label="Average Case" value={theory.timeComplexity.average} color="primary" />
          <ComplexityBadge label="Worst Case" value={theory.timeComplexity.worst} color="warning" />
          <ComplexityBadge label="Space" value={theory.spaceComplexity} color="primary" />
        </div>
      </section>

      {/* Advantages & Disadvantages */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-success/5 border border-success/20 rounded-xl p-6">
            <h4 className="font-bold text-success mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">thumb_up</span>
              Advantages
            </h4>
            <ul className="space-y-2">
              {theory.advantages.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <span className="text-success mt-0.5">✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-error/5 border border-error/20 rounded-xl p-6">
            <h4 className="font-bold text-error mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">thumb_down</span>
              Disadvantages
            </h4>
            <ul className="space-y-2">
              {theory.disadvantages.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <span className="text-error mt-0.5">✗</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      {theory.useCases && (
        <section>
          <h3 className="text-2xl font-serif text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">cases</span>
            Real-World Use Cases
          </h3>
          <div className="flex flex-wrap gap-3">
            {theory.useCases.map((uc, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-sm text-on-surface-variant font-medium">
                {uc}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
