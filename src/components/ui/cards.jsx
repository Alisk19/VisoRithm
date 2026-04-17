import React from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { RevealCardContainer } from './animated-profile-card';

/**
 * The inner content of the category card.
 * @param {Object} props
 * @param {string} props.title - Category title
 * @param {string} props.subtitle - Algorithm count
 * @param {string} props.imageUrl - URL of the category background image
 * @param {boolean} props.isAccent - Whether this is the overlay (accent) version
 */
const CategoryCardContent = ({ title, subtitle, imageUrl, isAccent }) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-2xl w-full text-left transition-colors duration-300",
        isAccent ? "bg-primary text-white" : "bg-glass-card text-white"
      )}
    >
      {/* 1. Image Container (Fixed Aspect Ratio 4:3) with explicit hidden overflow to maintain rounded borders */}
      <div className="w-full aspect-[4/3] rounded-t-2xl overflow-hidden relative border-b border-white/5 bg-black/40">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        {/* Subtle gradient so the image isn't totally flat, but no text overlay here */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Text Content Container */}
      <div className="flex flex-col p-6 flex-grow justify-center relative">
        <p className={cn(
          "text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5",
          isAccent ? "text-white/80" : "text-primary drop-shadow-md"
        )}>
          {subtitle}
        </p>
        <h3 className={cn(
          "text-2xl font-serif tracking-tight leading-none",
          isAccent ? "text-white" : "text-white text-shadow-sm"
        )}>
          {title}
        </h3>
      </div>
    </div>
  );
};

/**
 * A component that displays a grid of cards with an animated GSAP reveal effect.
 */
const HoverRevealCards = ({ items, className }) => {
  return (
    <div
      role="list"
      className={cn(
        'grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {items.map((item) => {
        const CardWrapper = item.href ? Link : 'div';
        const wrapperProps = item.href ? { to: item.href } : {};

        return (
          <CardWrapper
            key={item.id}
            {...wrapperProps}
            role="listitem"
            aria-label={`${item.title}, ${item.subtitle}`}
            tabIndex={0}
            className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-transform hover:-translate-y-2 hover:shadow-glow duration-300"
          >
            <RevealCardContainer
              accent="#c2652a" 
              className="h-full w-full shadow-lg group-hover:border-[#c2652a]/50 transition-colors"
              base={
                <CategoryCardContent
                  title={item.title}
                  subtitle={item.subtitle}
                  imageUrl={item.imageUrl}
                  isAccent={false}
                />
              }
              overlay={
                <CategoryCardContent
                  title={item.title}
                  subtitle={item.subtitle}
                  imageUrl={item.imageUrl}
                  isAccent={true}
                />
              }
            />
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default HoverRevealCards;
