// src/pages/AlgorithmPage.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { getAlgorithmById, getCategoryById } from '../data/algorithms';
import { getAlgorithmConfig } from '../algorithms/registry';
import { getAlgorithmTheory } from '../data/algorithmTheory';
import { useAnimationEngine } from '../engine/useAnimationEngine';

import { ArrayPanel } from '../panels/ArrayPanel';
import { GraphPanel } from '../panels/GraphPanel';
import { DPMatrixPanel } from '../panels/DPMatrixPanel';
import { DecisionTreePanel } from '../panels/DecisionTreePanel';
import { GridPanel } from '../panels/GridPanel';
import { InputManager } from '../panels/InputManager';
import { GraphBuilder } from '../panels/GraphBuilder';
import { StepHistoryPanel } from '../panels/StepHistoryPanel';
import { TheoryPanel } from '../panels/TheoryPanel';
import { ExplanationPanel } from '../panels/ExplanationPanel';
import { CodePanel } from '../panels/CodePanel';
import { ControlPanel } from '../panels/ControlPanel';

const EMPTY_STEP = {
  action: 'idle', explanation: 'Load data and press Play to begin.',
  subExplanation: '', highlightedLine: -1,
  array: [], indices: [], sortedIndices: [], pointers: [], inactiveIndices: [],
  board: null, treeState: { nodes: [], edges: [] }, logs: [], matrixState: null, graphState: null,
};

export default function AlgorithmPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const algo = getAlgorithmById(slug);
  const algoConfig = getAlgorithmConfig(slug);
  const theory = getAlgorithmTheory(slug);
  const category = algo ? getCategoryById(algo.categoryId) : null;

  const engine = useAnimationEngine();
  const [activeTab, setActiveTab] = useState('visualization'); // 'visualization' | 'theory'
  const [showHistory, setShowHistory] = useState(true);

  // Compute algorithm stats DYNAMICALLY up to current step (not the full run)
  const algoStats = useMemo(() => {
    const stepsUpToNow = engine.steps.slice(0, engine.stepIndex + 1);
    if (!stepsUpToNow.length) return null;
    const pt = algoConfig?.panelType;
    const it = algoConfig?.inputType;
    if (pt === 'array-bars' && it === 'array') {
      let swaps = 0, comparisons = 0, passes = 0;
      stepsUpToNow.forEach(s => {
        if (s.action === 'swap') swaps++;
        if (s.action === 'compare') comparisons++;
        if (s.action === 'scan' || s.action === 'pass' || s.action === 'merge-start') passes++;
      });
      return { type: 'sorting', swaps, comparisons, passes };
    }
    if (pt === 'array-boxes' && it === 'search') {
      let comparisons = 0, passes = 0;
      stepsUpToNow.forEach(s => {
        if (s.action === 'compare') comparisons++;
        if (s.action === 'move') passes++;
      });
      return { type: 'searching', comparisons, passes };
    }
    return null;
  }, [engine.steps, engine.stepIndex, algoConfig]);

  // Auto-load on mount for non-graph, non-special algorithms
  useEffect(() => {
    if (!algoConfig) return;
    const { inputType, defaultData, generateSteps } = algoConfig;
    // These types wait for user input — don't auto-load
    if (['graph', 'weighted-graph', 'knapsack', 'matrix', 'weighted-matrix', 'subset-sum'].includes(inputType)) {
      // Show builder — auto-run with defaults for graph types
      if (['graph', 'weighted-graph', 'knapsack', 'matrix', 'weighted-matrix'].includes(inputType)) {
        try {
          const steps = generateSteps(null);
          if (steps?.length) engine.load(steps);
        } catch (e) { }
      }
      return;
    }
    try {
      const data = defaultData ? defaultData() : null;
      const steps = generateSteps(data);
      if (steps?.length) engine.load(steps);
    } catch (e) {
      engine.load([EMPTY_STEP]);
    }
  }, [slug]);

  // Handle input submission
  const handleLoad = useCallback((data) => {
    if (!algoConfig) return;
    try {
      const steps = algoConfig.generateSteps(data);
      if (steps?.length) { engine.load(steps); engine.play(); }
    } catch (err) { alert('Error running algorithm: ' + err.message); }
  }, [algoConfig, engine]);

  // Graph builder run
  const handleGraphRun = useCallback((graphData) => {
    if (!algoConfig) return;
    try {
      const steps = algoConfig.generateSteps(graphData);
      if (steps?.length) { engine.load(steps); engine.play(); }
    } catch (err) { alert('Graph error: ' + err.message); }
  }, [algoConfig, engine]);

  // Random data
  const handleRandom = useCallback(() => {
    if (!algoConfig?.defaultData) return;
    try {
      const data = algoConfig.defaultData();
      const steps = algoConfig.generateSteps(data);
      if (steps?.length) engine.load(steps);
    } catch (e) { }
  }, [algoConfig, engine]);

  const step = engine.currentStep || EMPTY_STEP;
  const inputType = algoConfig?.inputType || 'none';
  const isGraphAlgo = inputType === 'graph' || inputType === 'weighted-graph';

  // Raw code object — CodePanel manages language toggle internally
  const codeContent = algoConfig?.code ?? '// No code available';

  // Render visualization panel
  const renderVizPanel = () => {
    const pt = algoConfig?.panelType;
    if (pt === 'graph') return <GraphPanel graphState={step.graphState} />;
    if (pt === 'dp-matrix') return <DPMatrixPanel matrixState={step.matrixState} />;
    if (pt === 'decision-tree') return <DecisionTreePanel treeState={step.treeState} />;
    if (pt === 'grid-bt') {
      const board = step.board || step.boardState || null;
      return <GridPanel board={board} boardState={board} action={step.action} conflictCell={step.conflictCell} />;
    }
    if (pt === 'array-bars' || pt === 'array-boxes') {
      const mode = pt === 'array-bars' ? 'bars' : 'boxes';
      return (
        <ArrayPanel
          array={step.array || []}
          currentIndices={step.indices || []}
          isSortedIndices={step.sortedIndices || []}
          action={step.action}
          mode={mode}
          pointers={step.pointers || []}
          inactiveIndices={step.inactiveIndices || []}
        />
      );
    }
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 text-sm rounded-2xl relative z-10">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl mb-2 block text-zinc-600">visibility</span>
          <p>Visualization panel not configured for this algorithm.</p>
        </div>
      </div>
    );
  };

  if (!algo || !algoConfig) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
        <span className="material-symbols-outlined text-5xl text-outline mb-4 block">search_off</span>
        <h1 className="text-3xl font-serif text-on-surface mb-4">Algorithm Not Found</h1>
        <p className="text-secondary mb-8">The algorithm <code className="font-mono bg-surface-container px-2 py-1 rounded">{slug}</code> is not in the registry.</p>
        <Link to="/categories" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all">← Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-48 bg-background relative selection:bg-primary/30 min-h-screen">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none mix-blend-screen opacity-20">
        <div className="absolute top-[-20%] right-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>
      {/* ── Breadcrumb ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
          {category && (<><span>/</span><Link to={`/category/${category.id}`} className="hover:text-primary transition-colors">{category.title}</Link></>)}
          <span>/</span>
          <span className="text-on-surface font-semibold">{algo.name}</span>
        </nav>
      </div>

      {/* ── Page header ── */}
      <section className="relative z-10 border-b border-white/5 pt-10 pb-10 px-8 mt-4 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-primary">
              <span className="material-symbols-outlined text-4xl">{category?.icon || 'code'}</span>
              <span className="text-xs font-label tracking-widest uppercase border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                {category?.title || 'Algorithm'}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline text-on-surface italic">{algo.name}</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mt-3 leading-relaxed">{algo.description}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <span className="text-3xl font-mono font-bold text-primary">{algo.complexity}</span>
            <span className="text-xs text-secondary uppercase tracking-widest">Time Complexity</span>
          </div>
        </div>
      </section>

      {/* ── Tab Toggle ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 mt-8 relative z-10">
        <div className="flex gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1.5 w-fit shadow-lg">
          {[
            { id: 'visualization', icon: 'play_circle', label: 'Visualization' },
            { id: 'theory', icon: 'menu_book', label: 'Theory & Analysis' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-on-surface'
                }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 mt-6">

        {/* ══════════════ THEORY TAB ══════════════ */}
        {activeTab === 'theory' && (
          <TheoryPanel theory={theory} algoName={algo.name} />
        )}

        {/* ══════════════ VISUALIZATION TAB ══════════════ */}
        {activeTab === 'visualization' && (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

            {/* Left column */}
            <div className="flex flex-col gap-5">

              {/* ── Input Section ── */}
              {isGraphAlgo ? (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Build Your Graph</h3>
                  <GraphBuilder
                    onRun={handleGraphRun}
                    showWeights={inputType === 'weighted-graph'}
                    isPlaying={engine.isPlaying}
                  />
                </div>
              ) : (
                <InputManager
                  type={inputType}
                  onSubmit={handleLoad}
                  onRandom={['array', 'search'].includes(inputType) ? handleRandom : undefined}
                  isPlaying={engine.isPlaying}
                  play={engine.play}
                />
              )}

              {/* ── START button for auto-run algorithms (DP / Greedy / Backtracking 'none') ── */}
              {inputType === 'none' && (
                <div className="flex gap-3 items-center mb-2">
                  <button
                    onClick={engine.play}
                    disabled={engine.isPlaying}
                    className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    Start Visualization
                  </button>
                  <button
                    onClick={engine.reset}
                    className="px-4 py-3 border border-outline-variant text-secondary rounded-xl hover:bg-surface-container transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-base">replay</span>
                    Reset
                  </button>
                </div>
              )}

              {/* ── Visualization Canvas ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">
                    {isGraphAlgo ? 'Graph Visualization' : 'Live Visualization'}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    {engine.stepIndex + 1} / {engine.steps.length || 1}
                  </div>
                </div>
                {/* Grid-BT: Live Viz + Decision Tree SIDE BY SIDE */}
                {(algoConfig?.panelType === 'grid-bt' || algoConfig?.panelType === 'decision-tree') ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                    {/* Left: board */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Live Visualization</h2>
                      <div className="rounded-2xl overflow-hidden bg-glass border border-white/5 relative" style={{ minHeight: 400 }}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,101,42,0.05)_0%,transparent_100%)] pointer-events-none z-0" />
                        <div className="relative z-10 h-full">{renderVizPanel()}</div>
                      </div>
                    </div>
                    {/* Right: decision tree */}
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                        Decision Tree
                        <span className="ml-2 text-[10px] font-normal text-outline normal-case">(Row, Col) — 1-indexed</span>
                      </h2>
                      <div style={{ minHeight: 400 }}>
                        <DecisionTreePanel treeState={step.treeState || { nodes: [], edges: [] }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* All other algorithms: stack normally */
                  <>
                    <div className="rounded-2xl overflow-hidden bg-glass border border-white/5 relative shadow-glow" style={{ minHeight: 500, height: 500 }}>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,101,42,0.08)_0%,transparent_100%)] pointer-events-none z-0" />
                      <div className="relative z-10 h-full">{renderVizPanel()}</div>
                    </div>

                    {/* Stats panel for sorting / searching */}
                    {algoStats && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 shadow-glass">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-primary">bar_chart</span>
                          {algoStats.type === 'sorting' ? 'Sorting Statistics' : 'Search Statistics'}
                          <span className="ml-auto text-[8px] font-normal text-outline normal-case italic">Live · updates each step</span>
                        </h4>
                        <div className="flex flex-wrap gap-6">
                          {algoStats.type === 'sorting' && (
                            <>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Swaps</span>
                                <span className="text-3xl font-mono font-bold text-primary mt-1">{algoStats.swaps}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Comparisons</span>
                                <span className="text-3xl font-mono font-bold text-primary mt-1">{algoStats.comparisons}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Passes</span>
                                <span className="text-3xl font-mono font-bold text-primary mt-1">{algoStats.passes}</span>
                              </div>
                            </>
                          )}
                          {algoStats.type === 'searching' && (
                            <>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Comparisons</span>
                                <span className="text-3xl font-mono font-bold text-primary mt-1">{algoStats.comparisons}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Passes / Pivots</span>
                                <span className="text-3xl font-mono font-bold text-primary mt-1">{algoStats.passes}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="text-[9px] text-secondary mt-3 italic">Counts accumulated up to current step.</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ── Controls ── */}
              <ControlPanel
                isPlaying={engine.isPlaying}
                stepIndex={engine.stepIndex}
                totalSteps={engine.steps.length}
                speed={engine.speed}
                onPlay={engine.play}
                onPause={engine.pause}
                onNext={engine.next}
                onPrev={engine.prev}
                onReset={engine.reset}
                onSpeedChange={engine.setSpeed}
              />

              {/* ── Explanation ── */}
              <ExplanationPanel
                explanation={step.explanation}
                subExplanation={step.subExplanation}
                action={step.action}
                logs={step.logs}
              />

              {/* ── Step History ── */}
              <div>
                <button
                  onClick={() => setShowHistory(h => !h)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-on-surface transition-colors mb-3"
                >
                  <span className="material-symbols-outlined text-sm">{showHistory ? 'expand_less' : 'expand_more'}</span>
                  Step History
                  <span className="text-[10px] font-mono text-outline ml-1">({engine.steps.length} steps)</span>
                </button>
                {showHistory && (
                  <StepHistoryPanel steps={engine.steps} currentIndex={engine.stepIndex} />
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* Code panel — manages its own language toggle internally */}
              <CodePanel code={codeContent} highlightedLine={step.highlightedLine} />

              {/* ── Complexity Analysis card ── */}
              <div className="rounded-2xl border border-[#222] relative overflow-auto custom-scrollbar" style={{ background: '#0a0a0a', maxHeight: '400px' }}>
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-28 w-28 rounded-full bg-primary/8 blur-2xl pointer-events-none" />
                {/* Orange top-accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(to right, #c2652a, transparent)' }} />

                <div className="p-5 relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(194,101,42,0.12)', border: '1px solid rgba(194,101,42,0.2)' }}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '15px' }}>speed</span>
                    </div>
                    <span className="font-bold text-white text-sm tracking-wide">Complexity Analysis</span>
                  </div>

                  {/* Dynamic complexity rows */}
                  <div className="space-y-3">
                    {/* Best Case — from theory if available */}
                    {theory?.timeComplexity?.best && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Best Case</span>
                        <code className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                          {theory.timeComplexity.best}
                        </code>
                      </div>
                    )}
                    {/* Average Case */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                        {theory?.timeComplexity?.best ? 'Average' : 'Time Complexity'}
                      </span>
                      <code className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: 'rgba(194,101,42,0.1)', color: '#c2652a', border: '1px solid rgba(194,101,42,0.2)' }}>
                        {theory?.timeComplexity?.average || algo.complexity}
                      </code>
                    </div>
                    {/* Worst Case */}
                    {theory?.timeComplexity?.worst && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Worst Case</span>
                        <code className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                          {theory.timeComplexity.worst}
                        </code>
                      </div>
                    )}
                    {/* Space Complexity */}
                    {theory?.spaceComplexity && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Space</span>
                        <code className="text-xs font-mono font-bold px-2 py-1 rounded-md" style={{ background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.15)' }}>
                          {theory.spaceComplexity}
                        </code>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-white/5 pt-3 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Category</span>
                        <span className="text-xs text-zinc-300 font-medium">{category?.title || '—'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Type</span>
                      <span className="text-xs text-zinc-300 font-medium">
                        {algoConfig.panelType?.includes('array') ? 'Array-Based' :
                          algoConfig.panelType === 'graph' ? 'Graph' :
                            algoConfig.panelType === 'dp-matrix' ? 'Dynamic Programming' :
                              algoConfig.panelType === 'grid-bt' ? 'Backtracking' :
                                algoConfig.panelType === 'decision-tree' ? 'Tree-Based' : 'General'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Explore Further card ── */}
              {category && (() => {
                const siblings = category.algorithms.filter(a => a.id !== slug);
                return (
                  <div className="rounded-2xl border border-[#222] relative overflow-auto custom-scrollbar" style={{ background: '#0a0a0a', maxHeight: '350px' }}>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

                    <div className="p-5 relative z-10">
                      {/* Header */}
                      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-white/5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(194,101,42,0.12)', border: '1px solid rgba(194,101,42,0.2)' }}>
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '15px' }}>explore</span>
                        </div>
                        <span className="font-bold text-white text-sm tracking-wide">Explore Further</span>
                        {siblings.length > 0 && (
                          <span className="ml-auto text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                            {siblings.length}
                          </span>
                        )}
                      </div>

                      {/* Empty state */}
                      {siblings.length === 0 ? (
                        <div className="text-center py-6 text-zinc-600">
                          <span className="material-symbols-outlined text-3xl mb-2 block">explore_off</span>
                          <p className="text-xs">No other algorithms in this category yet.</p>
                        </div>
                      ) : (
                        /* Full sibling list without internal scroll restrictions */
                        <div className="flex flex-col gap-2">
                          {siblings.map(a => (
                            <Link
                              key={a.id}
                              to={`/algorithms/${a.id}`}
                              className="flex items-center justify-between p-3 rounded-xl border transition-all group shrink-0"
                              style={{
                                background: 'rgba(255,255,255,0.04)',
                                borderColor: 'rgba(255,255,255,0.06)',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(194,101,42,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(194,101,42,0.25)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                              }}
                            >
                              <div className="min-w-0 flex-1 mr-2">
                                <div className="text-sm font-medium text-zinc-300 group-hover:text-primary transition-colors truncate">{a.name}</div>
                                <div className="text-xs text-zinc-600 font-mono mt-0.5">{a.complexity}</div>
                              </div>
                              <span className="material-symbols-outlined text-zinc-600 group-hover:text-primary transition-colors text-sm shrink-0">arrow_forward</span>
                            </Link>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
