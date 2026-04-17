import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card3DList } from '../components/ui/animated-3d-card';
import { Filter, TrendingUp, LineChart, Network, BarChart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// ── Complexity definitions ──────────────────────────────────────────────────
const COMPLEXITIES = [
  {
    key: 'o1',
    label: 'O(1)',
    color: '#22c55e',
    borderColor: '#22c55e',
    fn: () => 1,
    inputKey: '1',
  },
  {
    key: 'ologn',
    label: 'O(log n)',
    color: '#3b82f6',
    borderColor: '#3b82f6',
    fn: (x) => Math.log2(x),
    inputKey: 'logn',
  },
  {
    key: 'on',
    label: 'O(n)',
    color: '#06b6d4',
    borderColor: '#06b6d4',
    fn: (x) => x,
    inputKey: 'n',
  },
  {
    key: 'onlogn',
    label: 'O(n log n)',
    color: '#eab308',
    borderColor: '#eab308',
    fn: (x) => x * Math.log2(x),
    inputKey: 'nlogn',
  },
  {
    key: 'on2',
    label: 'O(n²)',
    color: '#f97316',
    borderColor: '#f97316',
    fn: (x) => Math.min(x * x, 500),
    inputKey: 'n2',
  },
  {
    key: 'o2n',
    label: 'O(2ⁿ)',
    color: '#ef4444',
    borderColor: '#ef4444',
    fn: (x) => Math.min(Math.pow(2, x), 500),
    inputKey: '2n',
  },
];

const CHART_LABELS = Array.from({ length: 100 }, (_, i) => i + 1);

export default function ComplexityPage() {
  const [n, setN] = useState(10);
  // Default: show everything except O(2ⁿ) (it overwhelms the chart)
  const [selected, setSelected] = useState(
    new Set(['o1', 'ologn', 'on', 'onlogn', 'on2'])
  );

  const toggleComplexity = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't allow deselecting all
        if (next.size === 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // ── Chart data — only selected complexities ──────────────────────────────
  const chartData = useMemo(() => ({
    labels: CHART_LABELS,
    datasets: COMPLEXITIES.filter((c) => selected.has(c.key)).map((c) => ({
      label: c.label,
      data: CHART_LABELS.map((x) => c.fn(x)),
      borderColor: c.borderColor,
      backgroundColor: `${c.borderColor}15`,
      borderWidth: c.key === 'on2' || c.key === 'o2n' ? 2.5 : 2,
      tension: 0.4,
      fill: false,
      pointRadius: 0,
      pointHitRadius: 10,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: c.borderColor,
    })),
  }), [selected]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 500,
        ticks: { display: false },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.08)' },
      },
      x: {
        ticks: { display: false },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.08)' },
      },
    },
    elements: {
      point: { radius: 0, hitRadius: 10, hoverRadius: 5 },
    },
  }), []);

  // ── Input Lab calculation ────────────────────────────────────────────────
  const calculateO = (type, val) => {
    if (!val || isNaN(val)) return '—';
    const v = parseInt(val, 10);
    switch (type) {
      case '1':    return '1';
      case 'logn': return Math.max(0, Math.log2(v)).toFixed(1);
      case 'n':    return v.toLocaleString();
      case 'nlogn': return Math.round(v * Math.log2(v)).toLocaleString();
      case 'n2':   return (v * v).toLocaleString();
      case '2n':   return v > 50 ? 'Overflow' : Math.pow(2, v).toLocaleString();
      default:     return '—';
    }
  };

  // ── Complexity cards definition ──────────────────────────────────────────
  const complexityCards = [
    {
      id: 'o1',
      title: 'Constant Time',
      description: 'Growth is independent of input size. The operation always takes the same amount of time.',
      icon: <Filter className="w-8 h-8 opacity-70" />,
      theme: 'secondary',
      children: (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="font-mono font-bold text-white mb-2">O(1)</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Common Algorithms</div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Array Lookup</span>
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Hash Insertion</span>
          </div>
        </div>
      ),
    },
    {
      id: 'ologn',
      title: 'Logarithmic Time',
      description: 'Growth decreases relative to input size. Typical for algorithms that divide and conquer.',
      icon: <LineChart className="w-8 h-8 opacity-70" />,
      theme: 'info',
      children: (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="font-mono font-bold text-white mb-2">O(log n)</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Common Algorithms</div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Binary Search</span>
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Heap Operations</span>
          </div>
        </div>
      ),
    },
    {
      id: 'on',
      title: 'Linear Time',
      description: 'Growth is directly proportional to input size. The simplest scaling pattern.',
      icon: <TrendingUp className="w-8 h-8 opacity-70" />,
      theme: 'accent',
      children: (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="font-mono font-bold text-white mb-2">O(n)</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Common Algorithms</div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Linear Search</span>
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Tree Traversal</span>
          </div>
        </div>
      ),
    },
    {
      id: 'onlogn',
      title: 'Quasilinear Time',
      description: 'Highly efficient for sorting. Slightly worse than linear, better than quadratic.',
      icon: <Network className="w-8 h-8 opacity-70" />,
      theme: 'primary',
      children: (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="font-mono font-bold text-white mb-2">O(n log n)</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Common Algorithms</div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Merge Sort</span>
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Quick Sort</span>
          </div>
        </div>
      ),
    },
    {
      id: 'on2',
      title: 'Quadratic Time',
      description: 'Growth increases by the square of the input. Common with nested loops.',
      icon: <BarChart className="w-8 h-8 opacity-70" />,
      theme: 'warning',
      children: (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="font-mono font-bold text-white mb-2">O(n²)</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Common Algorithms</div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Bubble Sort</span>
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Insertion Sort</span>
          </div>
        </div>
      ),
    },
    {
      id: 'o2n',
      title: 'Exponential Time',
      description: 'Growth doubles with each addition to input size. Often impractical for large datasets.',
      icon: <Zap className="w-8 h-8 opacity-70" />,
      theme: 'danger',
      children: (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="font-mono font-bold text-white mb-2">O(2ⁿ)</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Common Algorithms</div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Brute Force</span>
            <span className="bg-black/30 backdrop-blur-md px-2 py-1 rounded text-xs border border-white/10">Recursive Fibonacci</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex-1 overflow-x-hidden bg-background">
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="font-headline text-5xl md:text-6xl text-white mb-4 leading-tight">
            Complexity Growth Comparison
          </h1>
          <p className="font-body text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Visualizing the asymptotic behavior of algorithms. Observe how different complexity
            classes scale as input size{' '}
            <span className="font-semibold italic text-primary">n</span> approaches infinity.
          </p>
        </motion.header>

        {/* ── Visualization Area ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-24"
        >
          {/* ── Main Chart ── */}
          <div className="xl:col-span-2 rounded-2xl border border-[#222] overflow-hidden flex flex-col relative w-full" style={{ background: '#0a0a0a' }}>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

            {/* Chart header: title + interactive legend */}
            <div className="p-5 border-b border-white/5 bg-black/40 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="font-headline text-2xl italic text-white">Growth Curves</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                  Click to toggle curves
                </span>
              </div>

              {/* Interactive complexity toggles */}
              <div className="flex flex-wrap gap-2">
                {COMPLEXITIES.map((c) => {
                  const isActive = selected.has(c.key);
                  return (
                    <button
                      key={c.key}
                      onClick={() => toggleComplexity(c.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all select-none btn-interact ${
                        isActive ? 'opacity-100' : 'opacity-30 grayscale'
                      }`}
                      style={{
                        borderColor: `${c.color}50`,
                        color: c.color,
                        background: isActive ? `${c.color}18` : 'transparent',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: c.color }}
                      />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart canvas */}
            <div
              className="flex-1 relative p-6"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.015) 0%, transparent 100%)',
                height: '380px',
              }}
            >
              <div className="w-full h-full relative z-10">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="absolute bottom-3 right-6 text-[10px] uppercase font-bold text-zinc-600 tracking-widest bg-black/80 border border-white/10 px-2 py-1 rounded">
                Input Size (n)
              </div>
              <div className="absolute top-1/2 left-1 text-[10px] uppercase font-bold text-zinc-600 tracking-widest -rotate-90 origin-center bg-black/80 border border-white/10 px-2 py-1 rounded">
                Operations
              </div>
            </div>

          </div>

          {/* ── Input Lab ── */}
          <div
            className="rounded-2xl p-6 border border-[#222] flex flex-col justify-between relative overflow-hidden"
            style={{ background: '#0a0a0a' }}
          >
            <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-headline text-3xl mb-2 text-white italic">The Input Lab</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                Enter a sample size to see how many operations each class performs.
              </p>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                  Sample Size (n)
                </label>
                <div className="relative mb-6">
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-bold text-lg text-white shadow-inner-glow transition-all"
                    type="number"
                    value={n}
                    onChange={(e) => setN(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                    Elements
                  </span>
                </div>

                {/* Results table */}
                <div className="space-y-2.5">
                  {COMPLEXITIES.map((c, i) => {
                    const val = calculateO(c.inputKey, n);
                    const isHighlighted = val === 'Overflow' || (parseInt(val?.replace(/,/g, '')) > 1000);
                    return (
                      <motion.div
                        key={c.key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="flex justify-between items-center border-b border-white/5 pb-2.5 panel-transition"
                      >
                        <span
                          className="text-sm font-bold"
                          style={{ color: c.color }}
                        >
                          {c.label}
                        </span>
                        <span
                          className="font-mono text-sm"
                          style={{
                            color: val === 'Overflow' ? '#ef4444' : isHighlighted ? '#f87171' : '#a1a1aa',
                            fontWeight: isHighlighted ? 700 : 400,
                          }}
                        >
                          {val}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* O(2ⁿ) cap notice */}
              {n > 25 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-zinc-600 mt-4 italic"
                >
                  * O(2ⁿ) shown as "Overflow" for n &gt; 50 to prevent browser freeze
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Complexity Profile Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h3 className="font-headline text-4xl mb-8 border-b border-white/5 pb-4 text-white">
            Complexity Profiles
          </h3>
          <Card3DList
            cards={complexityCards}
            columns={3}
            gap="lg"
            size="md"
            variant="premium"
            className="pb-12"
          />
        </motion.div>

      </div>
    </div>
  );
}
