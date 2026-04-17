import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CodePanel — renders syntax-highlighted (line-by-line) code.
 *
 * Props:
 *   code            — string OR { python: string, cpp: string }
 *   highlightedLine — 0-based index of the current executing line
 *   lang            — optional controlled lang ('python'|'cpp')
 *   onLangChange    — optional controlled setter; if absent, component is self-managed
 */
export function CodePanel({ code, highlightedLine, lang: langProp, onLangChange }) {
  const [internalLang, setInternalLang] = useState('python');

  // Controlled or uncontrolled
  const lang = langProp !== undefined ? langProp : internalLang;
  const setLang = onLangChange ?? setInternalLang;

  // Support plain string (backwards-compat) or { python, cpp } object
  const resolveCode = () => {
    if (!code) return '// No code available';
    if (typeof code === 'string') return code;
    return code[lang] || code.python || '// No code available';
  };

  const activeCode = resolveCode();
  const lines = activeCode.split('\n');

  return (
    <div className="bg-[#0d0d0d] border border-[#222] rounded-2xl overflow-hidden shadow-glass flex flex-col h-full relative panel-transition">
      {/* Shine line at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ── Terminal Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] relative z-10 shrink-0"
        style={{ background: 'linear-gradient(to right, #0a0a0a, #111)' }}
      >
        {/* Mac-style traffic lights */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: '#ff5f57', borderColor: '#e0443e' }}
            title="Close"
          />
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: '#ffbd2e', borderColor: '#dea123' }}
            title="Minimize"
          />
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: '#28c940', borderColor: '#1aab29' }}
            title="Maximize"
          />
          {/* Orange accent line below dots */}
          <div className="h-3 w-px bg-primary/30 mx-1" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {lang === 'python' ? 'algorithm.py' : 'algorithm.cpp'}
          </span>
        </div>

        {/* Language toggle — single source of truth */}
        <div className="flex bg-black/60 rounded-full p-0.5 border border-white/10 gap-0.5">
          {['python', 'cpp'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all btn-interact ${
                lang === l
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {l === 'cpp' ? 'C++' : 'Python'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Code Lines ── */}
      <div className="p-4 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed flex-1 relative z-10 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lang}-${lines.length}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {lines.map((line, i) => {
              const isHighlighted = i === highlightedLine;
              return (
                <div
                  key={`${lang}-${i}`}
                  style={{
                    backgroundColor: isHighlighted
                      ? 'rgba(194, 101, 42, 0.15)'
                      : 'transparent',
                    transform: isHighlighted ? 'scale(1.01)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                  className={`flex rounded px-3 py-0.5 -mx-3 ${
                    isHighlighted
                      ? 'border-l-[3px] border-primary text-zinc-100 font-semibold'
                      : 'border-l-[3px] border-transparent hover:bg-white/3 text-zinc-400'
                  }`}
                >
                  <div className="w-8 shrink-0 text-white/20 text-right pr-4 select-none text-[11px]">
                    {i + 1}
                  </div>
                  <div className="whitespace-pre tracking-wide word-safe">{line}</div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
