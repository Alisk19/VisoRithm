import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAlgorithms } from '../data/algorithms';
import { Search, User, ChevronRight } from 'lucide-react';

function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const allAlgorithms = getAllAlgorithms();
  const filtered = searchQuery.trim().length > 0
    ? allAlgorithms.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Complexity', path: '/complexity' },
  ];

  const checkActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-glass">
      <nav className="flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-[1400px] mx-auto relative">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-glow"
          >
            <span className="text-white font-bold font-serif italic text-lg leading-none">V</span>
          </motion.div>
          <span className="text-2xl font-serif italic text-on-surface tracking-tight group-hover:text-white transition-colors">
            VisoRithm
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = checkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                onDragStart={(e) => e.preventDefault()}
              >
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block relative">
            <motion.div 
              animate={{ 
                width: isFocused ? 280 : 220,
                borderColor: isFocused ? 'rgba(194, 101, 42, 0.5)' : 'rgba(255, 255, 255, 0.1)'
              }}
              className="flex items-center overflow-hidden bg-black border rounded-full px-3 py-1.5 transition-colors shadow-inner-glow"
            >
              <Search size={16} className={`mr-2 ${isFocused ? 'text-primary' : 'text-zinc-500'}`} />
              <input 
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
                placeholder="Search algorithms..." 
                type="text"
              />
            </motion.div>

            <AnimatePresence>
              {filtered.length > 0 && isFocused && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-12 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl py-2 z-50 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar"
                >
                   {filtered.map(algo => (
                     <Link 
                       key={algo.id} 
                       to={algo.isDashboard ? '/complexity' : `/algorithms/${algo.id}`}
                       onClick={() => setSearchQuery('')}
                       className="group px-4 py-3 hover:bg-white/5 flex items-center justify-between transition-colors"
                     >
                       <div>
                         <div className="text-sm font-medium text-zinc-200 group-hover:text-white">{algo.name}</div>
                         <div className="text-xs font-normal text-zinc-500 mt-0.5">{algo.category}</div>
                       </div>
                       <ChevronRight size={14} className="text-zinc-600 group-hover:text-primary transition-colors" />
                     </Link>
                   ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
            <User size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Glow effect at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="w-full py-16 px-8 flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center">
              <span className="text-white font-bold font-serif italic text-xs leading-none">V</span>
            </div>
            <span className="text-xl font-serif italic text-white tracking-tight">VisoRithm</span>
          </Link>
          <p className="font-sans text-sm tracking-wide text-zinc-500">© 2026 VisoRithm. The ultimate DAA explorer.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Github</a>
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">Resources</a>
        </div>
      </div>
    </footer>
  );
}

// -- NO AnimatePresence mode="wait" --
// That pattern holds back rendering the new page until the old page's exit
// animation finishes, which creates the blank-screen gap on first navigation.
// Instead, each page just fades in on its own when it mounts.
function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div className="flex-grow flex flex-col" key={location.pathname}>
      {children}
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body selection:bg-primary/30 selection:text-white">
      <Header />
      <main className="flex-grow w-full flex flex-col relative">
        <PageWrapper>{children}</PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
