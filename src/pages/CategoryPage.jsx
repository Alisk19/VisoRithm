import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getCategoryById } from '../data/algorithms';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);

  if (!category) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full pb-24">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">{category.title}</span>
        </nav>
      </div>

      {/* Category Hero */}
      <section className="bg-surface-container-low pt-16 pb-16 px-8 border-b border-outline-variant/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6 text-primary">
            <span className="material-symbols-outlined text-4xl">{category.icon}</span>
            <span className="text-sm font-label tracking-widest uppercase border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">Category Profile</span>
          </div>
          <h1 className="text-6xl font-headline text-on-surface mb-6 italic">{category.title}</h1>
          <p className="text-xl text-secondary max-w-3xl leading-relaxed">
            {category.description} This category explores the foundational structures and strategic paradigms essential for optimizing computations within this domain.
          </p>
        </div>
      </section>

      {/* Algorithms Grid */}
      <section className="max-w-6xl mx-auto px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {category.algorithms.map((algo) => (
            <div key={algo.id} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col group hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-3xl font-serif text-on-surface">{algo.name}</h3>
                <span className="bg-surface-container-high text-primary font-bold px-3 py-1 rounded text-sm tracking-wider">{algo.complexity}</span>
              </div>
              <p className="text-on-surface-variant text-base leading-relaxed mb-8 flex-grow">
                {algo.description} Master the nuances of this algorithm to drastically improve your algorithmic efficiency and conceptual understanding.
              </p>
              <Link 
                to={algo.isDashboard ? '/complexity' : `/algorithms/${algo.id}`}
                className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary text-center font-bold rounded-lg shadow hover:-translate-y-0.5 hover:shadow-md transition-all self-start"
              >
                Visualize It →
              </Link>
            </div>
          ))}
        </div>

        {/* Educational Note — dark themed */}
        <div className="border border-[#c2652a]/25 rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0e0805 0%, #1a0d05 60%, #0a0a0a 100%)' }}>
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'rgba(194,101,42,0.10)' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ background: 'rgba(139,52,16,0.08)' }} />
          {/* Top accent line */}
          <div className="absolute top-0 left-6 right-6 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(194,101,42,0.5), transparent)' }} />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(194,101,42,0.12)', border: '1px solid rgba(194,101,42,0.25)' }}>
              <span className="material-symbols-outlined" style={{ color: '#c2652a' }}>lightbulb</span>
            </div>
            <div>
              <h4 className="text-xl font-serif text-white mb-2">Why does complexity matter here?</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Algorithms in the <strong className="text-white">{category.title}</strong> class often handle large datasets or recurse deeply. A naive approach might result in an exponential <span className="font-mono font-bold" style={{ color: '#c2652a' }}>O(2^n)</span> execution, freezing systems, while an optimized approach ensures responsive <span className="font-mono font-bold" style={{ color: '#e0954d' }}>O(n log n)</span> completion. Choosing the right mechanism here fundamentally defines application performance limits.
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
