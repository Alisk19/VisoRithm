import React, { useState, useEffect, useCallback, useRef } from 'react';

// All images from /public/DAA_logos/
const SLIDES = [
  '/DAA_logos/Backtracking.png',
  '/DAA_logos/Graph Algorithms.png',
  '/DAA_logos/dynamic.png',
  '/DAA_logos/Divide and Conquer.png',
  '/DAA_logos/greedy.png',
  '/DAA_logos/Branch and bound.png',
  '/DAA_logos/MISCELLANEOUS.png',
  '/DAA_logos/Searching .png',
];

const INTERVAL_MS = 3500;

/**
 * SlideshowBackground
 *
 * Renders a full-screen crossfading image slideshow behind its children.
 * Each slide gets a Ken Burns zoom, dark gradient overlay, and radial vignette.
 * Dot indicators at the bottom allow manual slide navigation.
 *
 * Props:
 *   children   — rendered above the background at z-index 5
 *   images     — optional override array of image paths
 *   interval   — optional ms between slides (default 3500)
 */
export default function SlideshowBackground({
  children,
  images = SLIDES,
  interval = INTERVAL_MS,
}) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (idx === current) return;
      setPrev(current);
      setCurrent(idx);
      setFading(true);
    },
    [current]
  );

  const advance = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, goTo, images.length]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(advance, interval);
    return () => clearInterval(timerRef.current);
  }, [advance, interval]);

  // Clear "fading" flag after transition
  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => {
      setPrev(null);
      setFading(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [fading]);

  // Restart timer when user clicks a dot
  const handleDot = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(advance, interval);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ── Slide layers ── */}
      {images.map((src, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        if (!isActive && !isPrev) return null;

        return (
          <div
            key={src}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              willChange: 'opacity',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // Ken Burns animation
                animation: isActive
                  ? 'kenburns 7s ease-in-out forwards'
                  : 'none',
                transformOrigin: 'center center',
              }}
            />
          </div>
        );
      })}

      {/* ── Dark gradient overlay ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: [
            'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(5,3,2,0.72) 50%, rgba(0,0,0,0.88) 100%)',
          ].join(','),
          pointerEvents: 'none',
        }}
      />

      {/* ── Radial vignette for depth ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Orange accent ambience (brand-consistent glow) ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(194,101,42,0.12) 0%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Dot indicators ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.35s ease, background 0.35s ease, opacity 0.35s ease',
              background: i === current ? '#c2652a' : 'rgba(255,255,255,0.35)',
              opacity: i === current ? 1 : 0.6,
            }}
          />
        ))}
      </div>

      {/* ── Content layer ── */}
      <div style={{ position: 'relative', zIndex: 5, minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
