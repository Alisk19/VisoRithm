import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/algorithms';
import { RevealCardContainer } from '../components/ui/animated-profile-card';
import { cn } from '../lib/utils';
import CategoryShaderBackground from '../components/ui/CategoryShaderBackground';

const DetailedCategoryContent = ({ cat, isAccent }) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full p-8 transition-colors duration-300",
        // When not accent (base), use default backgrounds
        !isAccent && "bg-surface-container-lowest",
        // When accent (overlay), use dark background. 
        isAccent && "bg-[#2a1a0f]" 
      )}
    >
      <div 
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors",
          !isAccent ? "bg-primary/5" : "bg-[#c2652a]"
        )}
      >
        <span 
          className={cn(
            "material-symbols-outlined text-2xl transition-colors",
            !isAccent ? "text-primary" : "text-white"
          )}
        >
          {cat.icon}
        </span>
      </div>
      
      <h2 
        className={cn(
          "text-xl font-serif mb-2 transition-colors",
          !isAccent ? "text-on-surface" : "text-white"
        )}
      >
        {cat.title}
      </h2>
      
      <p 
        className={cn(
          "text-sm leading-relaxed flex-grow mb-5",
          !isAccent ? "text-secondary" : "text-zinc-300"
        )}
      >
        {cat.description}
      </p>
      
      <div 
        className={cn(
          "flex items-center justify-between mt-auto pt-4 border-t",
          !isAccent ? "border-outline-variant/30" : "border-white/10"
        )}
      >
        <div className="flex flex-wrap gap-1">
          {cat.algorithms.slice(0, 3).map(a => (
            <span 
              key={a.id} 
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded",
                !isAccent ? "bg-surface-container-high text-secondary" : "bg-white/10 text-zinc-300"
              )}
            >
              {a.name}
            </span>
          ))}
          {cat.algorithms.length > 3 && (
            <span 
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded",
                !isAccent ? "bg-primary/5 text-primary" : "bg-white/10 text-[#d4844d]"
              )}
            >
              +{cat.algorithms.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <span 
        className={cn(
          "text-sm font-bold tracking-wide mt-4 block transition-transform",
          !isAccent ? "text-primary" : "text-[#d4844d]"
        )}
      >
        Browse {cat.algorithms.length} algorithms →
      </span>
    </div>
  );
};

export default function CategoriesPage() {
  return (
    <CategoryShaderBackground>
      <div className="w-full flex-grow pb-24 pt-12 max-w-[1400px] mx-auto px-8 font-body">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Categories</span>
        </nav>

        {/* Headings */}
        <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">All Categories</h1>
        <p className="text-lg text-secondary mb-14 max-w-2xl">
          10 algorithm families covering the full DAA curriculum — from sorting fundamentals to dynamic programming and graph theory.
        </p>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background"
            >
              <RevealCardContainer
                accent="#2a1a0f"
                className="h-full w-full border border-outline-variant/30 hover:border-[#c2652a]/50 shadow-[0_2px_16px_rgba(58,48,42,0.04)] hover:shadow-lg transition-all duration-300"
                base={<DetailedCategoryContent cat={cat} isAccent={false} />}
                overlay={<DetailedCategoryContent cat={cat} isAccent={true} />}
              />
            </Link>
          ))}
        </div>
      </div>
    </CategoryShaderBackground>
  );
}
