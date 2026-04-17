import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/algorithms';
import HeroSection from '../components/ui/glassmorphism-trust-hero';
import HoverRevealCards from '../components/ui/cards';

const getCategoryImageUrl = (id) => {
  const map = {
    'sorting': '/DAA_logos/searching.png',
    'searching': '/DAA_logos/Searching .png',
    'recursion-complexity': '/DAA_logos/MISCELLANEOUS.png',
    'divide-conquer': '/DAA_logos/Divide and Conquer.png',
    'backtracking': '/DAA_logos/Backtracking.png',
    'branch-bound': '/DAA_logos/Branch and bound.png',
    'graph': '/DAA_logos/Graph Algorithms.png',
    'dp': '/DAA_logos/dynamic.png',
    'greedy': '/DAA_logos/greedy.png',
    'miscellaneous': '/DAA_logos/MISCELLANEOUS.png'
  };
  return map[id] || '/DAA_logos/MISCELLANEOUS.png';
};

export default function LandingPage() {
  const cardItems = CATEGORIES.map(cat => ({
    id: cat.id,
    title: cat.title,
    subtitle: `${cat.algorithms.length} Algorithms`,
    description: cat.description,
    icon: cat.icon,
    imageUrl: getCategoryImageUrl(cat.id),
    href: `/category/${cat.id}`
  }));

  return (
    <div className="w-full bg-background min-h-screen">
      <HeroSection />

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-24 bg-background text-on-background border-t border-white/5 relative z-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif italic tracking-tight text-white mb-6"
          >
            Algorithms Library
          </motion.h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Choose a topic to explore interactive animations. Each algorithm includes a live visualization, step-by-step code tracing, and complexity analysis.
          </p>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
           <HoverRevealCards items={cardItems} />
        </div>
      </motion.section>
    </div>
  );
}
