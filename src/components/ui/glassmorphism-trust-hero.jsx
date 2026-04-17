import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Play, 
  Target, 
  Crown, 
  Star,
  BookOpen,
  Code2,
  Cpu,
  Globe2,
  Workflow,
  Network
} from "lucide-react";

// --- MOCK BRANDS ---
const CLIENTS = [
  { name: "Computer Science", icon: Cpu },
  { name: "Data Structures", icon: Workflow },
  { name: "Algorithms", icon: Code2 },
  { name: "Graph Theory", icon: Network },
  { name: "System Design", icon: Globe2 },
  { name: "Logic", icon: BookOpen },
];

const HERO_SLIDES = [
  '/DAA_logos/Backtracking.png',
  '/DAA_logos/Graph Algorithms.png',
  '/DAA_logos/dynamic.png',
  '/DAA_logos/Divide and Conquer.png',
  '/DAA_logos/greedy.png',
  '/DAA_logos/Branch and bound.png',
  '/DAA_logos/MISCELLANEOUS.png',
  '/DAA_logos/Searching .png',
];

const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

const FEATURES = [
  { icon: "code",         label: "Code Tracing",       desc: "Python & C++ step-by-step" },
  { icon: "visibility",   label: "Live Visualization",  desc: "Array, graph & matrix panels" },
  { icon: "menu_book",    label: "Theory Panels",       desc: "In-depth algorithm notes" },
  { icon: "speed",        label: "Complexity Analysis", desc: "Time & space big-O" },
  { icon: "history",      label: "Step History",        desc: "Full replay & rewind" },
  { icon: "account_tree", label: "9 Categories",        desc: "Sort → Graph → DP" },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const timerRef = useRef(null);

  const advance = useCallback(() => {
    setCurrentSlide(c => {
      setPrevSlide(c);
      return (c + 1) % HERO_SLIDES.length;
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, 3500);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  // Clear prev after transition
  useEffect(() => {
    const t = setTimeout(() => setPrevSlide(null), 1000);
    return () => clearTimeout(t);
  }, [currentSlide]);

  return (
    <div className="relative w-full text-white overflow-hidden font-sans">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes herokenburns {
          from { transform: scale(1.00); }
          to   { transform: scale(1.07); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* ── Crossfading slideshow images ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((src, i) => {
          const isActive = i === currentSlide;
          const isPrev  = i === prevSlide;
          if (!isActive && !isPrev) return null;
          return (
            <div
              key={src}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: isActive ? 'herokenburns 7s ease-in-out forwards' : 'none',
                  transformOrigin: 'center center',
                }}
              />
            </div>
          );
        })}
        {/* Dark overlay to keep text legible */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.72) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Radial vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Brand orange glow at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '160px',
          background: 'radial-gradient(ellipse, rgba(194,101,42,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Original background ambience glows on top of images for brand consistency */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#c2652a]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#8b4513]/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">
            
            {/* Badge */}
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  Premium Learning Experience
                  <Star className="w-3.5 h-3.5 text-[#c2652a] fill-[#c2652a]" />
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 
              className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
              }}
            >
              Master Algorithms<br />
              <span className="bg-gradient-to-br from-white via-white to-[#c2652a] bg-clip-text text-transparent">
                Visually
              </span><br />
              Step by Step
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">
              Explore immersive visualizations, dynamic code tracing, and interactive problem solving. The most beautiful way to understand complex data structures.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <Link to="/categories" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]">
                Browse Categories
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link to="/complexity" className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                <Play className="w-4 h-4 fill-current" />
                View Complexity
              </Link>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-5 space-y-6 lg:mt-12">
            
            {/* Stats Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#c2652a]/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c2652a]/15 ring-1 ring-[#c2652a]/30">
                    <Target className="h-6 w-6 text-[#c2652a]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">30+</div>
                    <div className="text-sm text-zinc-400">Interactive Algorithms</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Concept Mastery</span>
                    <span className="text-white font-medium">99%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[99%] rounded-full bg-gradient-to-r from-[#c2652a] to-amber-400" />
                  </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-5" />

                {/* 6-Feature Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {FEATURES.map(f => (
                    <div key={f.label} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#c2652a]/30 hover:bg-[#c2652a]/5 transition-all cursor-default">
                      <span className="material-symbols-outlined text-[#c2652a] shrink-0" style={{ fontSize: '15px', marginTop: '1px' }}>{f.icon}</span>
                      <div>
                        <div className="text-[11px] font-bold text-white leading-tight">{f.label}</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5 leading-snug">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c2652a]/30 bg-[#c2652a]/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-[#e08850]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c2652a] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c2652a]"></span>
                    </span>
                    INTERACTIVE
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wide text-zinc-300">
                    <Crown className="w-3 h-3 text-[#c2652a]" />
                    PREMIUM
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wide text-zinc-300">
                    <Code2 className="w-3 h-3 text-sky-400" />
                    PYTHON + C++
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wide text-zinc-300">
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    THEORY INCLUDED
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee Card */}
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Covering Core Topics</h3>
              
              <div 
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                }}
              >
                <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                    >
                      <client.icon className="h-6 w-6 text-white" />
                      <span className="text-lg font-bold text-white tracking-tight">
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
