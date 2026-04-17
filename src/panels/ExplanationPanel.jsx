import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Activity, ChevronRight } from 'lucide-react';

export function ExplanationPanel({ explanation, subExplanation, action, logs, text, subText }) {
  // Support both prop sets
  const mainText = explanation || text || 'Awaiting algorithm start...';
  const secondaryText = subExplanation || subText;

  return (
    <div
      className="rounded-2xl p-5 shadow-glass relative overflow-hidden flex flex-col panel-transition"
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-white font-serif text-base font-bold tracking-tight">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Info size={14} className="text-primary" />
          </div>
          Current Operation
        </div>

        {action && action !== 'idle' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Activity size={10} className="text-primary animate-pulse" />
            <span className="text-primary">{action}</span>
          </div>
        )}
      </div>

      {/* ── Main explanation text ── */}
      <div className="relative min-h-[52px] z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="word-safe"
            style={{
              color: '#eaeaea',
              lineHeight: 1.7,
              fontSize: '0.9rem',
              fontWeight: 450,
            }}
          >
            {mainText}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Sub-explanation ── */}
      <AnimatePresence>
        {secondaryText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rounded-xl text-sm relative overflow-hidden z-10"
            style={{
              background: 'rgba(0,0,0,0.4)',
              borderLeft: '3px solid #c2652a',
              padding: '12px 14px',
            }}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
            <div className="flex gap-2">
              <ChevronRight size={15} className="text-primary shrink-0 mt-0.5" />
              <span style={{ color: '#a1a1aa', lineHeight: 1.65 }}>{secondaryText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Execution trace / logs ── */}
      {logs && logs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
          <h5 className="text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
            Execution Trace
          </h5>
          <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar pr-2">
            {logs.map((log, i) => (
              <div
                key={i}
                className="text-xs font-mono py-1.5 px-2 rounded animate-entry"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#a1a1aa' }}
              >
                <span className="text-primary mr-2">›</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
