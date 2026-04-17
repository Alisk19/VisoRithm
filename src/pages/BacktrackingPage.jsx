import React, { useEffect, useState } from 'react';
import { useAnimationEngine } from '../engine/useAnimationEngine';
import { GridPanel } from '../panels/GridPanel';
import { DecisionTreePanel } from '../panels/DecisionTreePanel';
import { CodePanel } from '../panels/CodePanel';
import { ExplanationPanel } from '../panels/ExplanationPanel';
import { ControlPanel } from '../panels/ControlPanel';
import { generate4QueensSteps, queensCode } from '../algorithms/4-queens/steps';
import { motion, AnimatePresence } from 'framer-motion';

export default function BacktrackingPage() {
  const engine = useAnimationEngine();
  const [logicEvents, setLogicEvents] = useState([]);
  const [boardSize, setBoardSize] = useState(4);
  const [pendingSize, setPendingSize] = useState(4);

  const loadBoard = (n) => {
    setBoardSize(n);
    setLogicEvents([]);
    const steps = generate4QueensSteps(n);
    engine.load(steps);
  };

  useEffect(() => {
    loadBoard(4);
  }, []);

  // Sync logic stream
  useEffect(() => {
    if (engine.currentStep && engine.currentStep.logicEvent) {
       setLogicEvents(prev => {
          const newEvents = [...prev, engine.currentStep.logicEvent];
          return newEvents.slice(-5); // keep last 5
       });
    } else if (engine.stepIndex === 0) {
       setLogicEvents([]);
    }
  }, [engine.currentStep, engine.stepIndex]);

  const step = engine.currentStep || {
    boardState: null,
    action: 'idle',
    explanation: 'Ready',
    subExplanation: '',
    highlightedLine: -1,
    conflictCell: null,
    treeState: { nodes: [], edges: [] },
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background">
      {/* Header */}
      <section className="px-6 lg:px-24 py-8 border-b border-outline/30 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-heading mb-3 text-onBackground">N-Queens Problem</h1>
          <p className="text-onSurfaceVariant text-base max-w-2xl leading-relaxed">
            A classic backtracking problem. Place N queens on an N×N chessboard such that no two queens attack each other — no two share the same row, column, or diagonal. Supports 4×4 through 8×8.
          </p>
        </div>
        <div className="w-full md:w-72 bg-surface-low border border-outline rounded-xl p-5 shadow-sm">
          <h3 className="font-bold uppercase text-xs tracking-wider mb-4 text-onBackground">Complexity</h3>
          <div className="flex justify-between items-center border-b border-outline/50 pb-2 mb-2">
            <span className="text-onSurfaceVariant">Time (Worst)</span>
            <span className="font-code font-bold text-primary italic">O(N!)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-onSurfaceVariant">Space Complexity</span>
            <span className="font-code font-bold text-primary italic">O(N)</span>
          </div>
        </div>
      </section>

      {/* Controls: board size selector + start/reset */}
      <div className="px-6 lg:px-24 pt-6">
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 flex flex-wrap items-end gap-5 mb-0 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold tracking-widest text-secondary">Board Size (N×N)</label>
            <div className="flex gap-2">
              {[4, 5, 6, 7, 8].map(n => (
                <button
                  key={n}
                  onClick={() => setPendingSize(n)}
                  className={`w-10 h-10 rounded-lg font-mono font-bold text-sm border transition-colors ${
                    pendingSize === n
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary/40'
                  }`}
                >{n}×{n}</button>
              ))}
            </div>
            {pendingSize > 5 && (
              <p className="text-[9px] text-secondary italic mt-1">⚠ Decision tree hidden for boards &gt; 5×5 to prevent overflow.</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => loadBoard(pendingSize)}
              disabled={engine.isPlaying}
              className="px-6 py-2.5 border border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">upload</span>
              Load {pendingSize}×{pendingSize}
            </button>
            <button
              onClick={engine.play}
              disabled={engine.isPlaying}
              className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Play
            </button>
            <button
              onClick={() => { engine.reset(); setLogicEvents([]); }}
              className="px-4 py-2.5 border border-outline-variant text-secondary rounded-xl hover:bg-surface-container transition-colors flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">replay</span>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <section className="px-6 lg:px-24 py-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* Left: Grid + Stream + Controls */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <GridPanel
            boardState={step.boardState}
            action={step.action}
            conflictCell={step.conflictCell}
          />

          {/* Logic stream */}
          <div className="bg-white border border-outline rounded-xl p-4 h-48 overflow-hidden shadow-sm flex flex-col justify-end">
             <div className="text-xs font-bold uppercase tracking-widest text-onSurfaceVariant mb-2 border-b border-outline pb-2">Logic Stream</div>
             <div className="flex-1 flex flex-col justify-end gap-1 overflow-hidden">
               <AnimatePresence>
                 {logicEvents.map((ev, i) => (
                   <motion.div
                     key={ev?.time + '-' + i}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="text-xs font-code flex items-center gap-2"
                   >
                     <span className={`w-2 h-2 rounded-full ${ev?.type === 'conflict' ? 'bg-tertiary' : ev?.type === 'backtrack' ? 'bg-outline' : 'bg-success'}`}></span>
                     <span className={ev?.type === 'conflict' ? 'text-tertiary' : 'text-onSurfaceVariant'}>{ev?.message}</span>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          </div>

          <ControlPanel
            isPlaying={engine.isPlaying}
            speed={engine.speed}
            setSpeed={engine.setSpeed}
            play={engine.play}
            pause={engine.pause}
            next={engine.next}
            prev={engine.prev}
            reset={() => { engine.reset(); setLogicEvents([]); }}
          />
        </div>

        {/* Middle/Right: Explanation + Code */}
        <div className="xl:col-span-2 flex flex-col gap-6 h-[600px] lg:h-auto xl:h-[700px]">
          <div className="min-h-[150px]">
            <ExplanationPanel text={step.explanation} subText={step.subExplanation} />
          </div>
          <div className="flex-1 min-h-[0]">
            <CodePanel code={queensCode} highlightedLine={step.highlightedLine} />
          </div>
        </div>
      </section>

      {/* Decision Tree Section */}
      {step.treeState?.nodes?.length > 0 && (
        <section className="px-6 lg:px-24 pb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
            Backtracking Decision Tree
            <span className="ml-2 text-[10px] font-normal text-outline normal-case">(Row, Col) — nodes start from 1</span>
          </h2>
          <div style={{ minHeight: 360 }}>
            <DecisionTreePanel treeState={step.treeState} />
          </div>
        </section>
      )}
    </div>
  );
}
