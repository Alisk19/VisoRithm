import React, { useEffect, useRef, useState } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

/**
 * CategoryShaderBackground
 *
 * A full-bleed animated mesh gradient shader background tuned to the
 * VisoRithm brand palette: deep black cores, warm orange/amber mid-tones,
 * and subtle brown-mahogany accents.
 *
 * No text is rendered — purely a visual depth layer.
 * Children are rendered above it at z-index 10.
 */
export default function CategoryShaderBackground({ children }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', minHeight: '100%', overflow: 'hidden' }}
    >
      {/* ── Primary mesh gradient — site brand palette ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <MeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          colors={[
            '#000000', // pure black base
            '#1a0900', // very dark burnt orange
            '#3d1a05', // deep mahogany
            '#0a0a0a', // near-black
            '#2a1000', // dark amber shadow
          ]}
          speed={isHovered ? 0.5 : 0.18}
          backgroundColor="#000000"
        />
      </div>

      {/* ── Secondary overlay mesh — adds orange/amber shimmer ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          opacity: 0.45,
          mixBlendMode: 'screen',
          transition: 'opacity 0.6s ease',
        }}
      >
        <MeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          colors={[
            '#c2652a', // brand primary orange
            '#000000',
            '#8b3a10', // dark orange
            '#000000',
            '#5a2008', // deep rust
          ]}
          speed={isHovered ? 0.35 : 0.12}
          backgroundColor="transparent"
        />
      </div>

      {/* ── Dark scrim overlay — keeps content legible ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Radial vignette for depth ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3,
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.70) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Subtle top-edge orange line ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(194,101,42,0.5) 40%, rgba(194,101,42,0.5) 60%, transparent)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
