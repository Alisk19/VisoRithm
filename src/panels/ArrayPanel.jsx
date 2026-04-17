// src/panels/ArrayPanel.jsx — Full bar chart style, pixel-computed heights
import React from 'react';
import { motion } from 'framer-motion';

const CANVAS_HEIGHT = 460; // fixed pixel height for the bars canvas

export function ArrayPanel({ array, currentIndices, isSortedIndices, action, mode = 'bars', pointers = [], inactiveIndices = [] }) {
  const maxVal = Math.max(...array, 1);

  return (
    <div className="w-full rounded-xl overflow-hidden flex flex-col items-center" style={{ background: '#0d0d0d' }}>
      {mode === 'bars' ? (
        <div
          style={{
            width: '100%',
            height: `${CANVAS_HEIGHT}px`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: array.length > 15 ? '3px' : '5px',
            padding: '16px 24px 36px 24px',
            boxSizing: 'border-box',
          }}
        >
          {array.map((value, i) => {
            const isActive = currentIndices.includes(i);
            const isSorted = isSortedIndices.includes(i);
            const isSwapping = action === 'swap' && isActive;

            let barColor = '#4a3a2e';
            if (isSwapping)      barColor = '#e07b39';
            else if (isActive)   barColor = '#c2652a';
            else if (isSorted)   barColor = '#34a853';

            // Pixel height: max bar fills (CANVAS_HEIGHT - padding)
            const usableHeight = CANVAS_HEIGHT - 52; // subtract top+bottom padding
            const barH = Math.max(Math.round((value / maxVal) * usableHeight * 0.92), 20);

            return (
              <motion.div
                layout
                key={i}
                animate={isSwapping ? { y: [0, -20, 0] } : { y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  flex: '1 1 0',
                  maxWidth: array.length > 16 ? '44px' : array.length > 10 ? '60px' : '80px',
                  minWidth: '18px',
                  height: `${barH}px`,
                  background: barColor,
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '6px',
                  position: 'relative',
                  boxShadow: isActive || isSwapping
                    ? `0 0 20px ${barColor}aa, 0 -2px 0 ${barColor}`
                    : isSorted
                      ? '0 0 8px #34a85340'
                      : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
              >
                <span style={{
                  color: '#fff',
                  fontSize: array.length > 14 ? '9px' : array.length > 9 ? '11px' : '13px',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  lineHeight: 1,
                  textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                  opacity: barH < 30 ? 0 : 1, // hide label if bar too short
                }}>
                  {value}
                </span>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* BOXES mode — searching algorithms */
        <div
          style={{
            width: '100%',
            minHeight: `${CANVAS_HEIGHT}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '24px 16px',
            boxSizing: 'border-box',
          }}
        >
          {array.map((value, i) => {
            const isActive = currentIndices.includes(i);
            const isFound = isSortedIndices.includes(i);
            const isInactive = inactiveIndices.includes(i);
            const activePointers = pointers.filter(p => p.index === i);

            let bg = '#1e1a16', border = '#3a3028', text = '#9a8a7a', shadow = 'none';
            if (isFound) {
              bg = '#1a3a22'; border = '#34a853'; text = '#a8eab8';
              shadow = '0 0 16px rgba(52,168,83,0.5)';
            } else if (isActive) {
              bg = '#3a1e0a'; border = '#c2652a'; text = '#ffd4b0';
              shadow = '0 0 16px rgba(194,101,42,0.6)';
            } else if (isInactive) {
              bg = '#141210'; border = '#2a2420'; text = '#4a3a2a';
            }

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  layout
                  style={{
                    width: 64, height: 64,
                    background: bg, border: `2px solid ${border}`, color: text,
                    boxShadow: shadow, borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'monospace', fontWeight: 'bold', fontSize: '18px',
                    opacity: isInactive ? 0.35 : 1,
                    transition: 'all 0.2s',
                  }}
                  animate={{ scale: isActive ? 1.12 : 1, opacity: isInactive ? 0.35 : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {value}
                </motion.div>
                <span style={{ color: '#4a3a2a', fontSize: '9px', fontWeight: 600 }}>[{i}]</span>
                <div style={{ height: 20, display: 'flex', gap: 4 }}>
                  {activePointers.map((p, pIdx) => (
                    <motion.div
                      key={pIdx}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '2px 6px', borderRadius: 4,
                        background: '#3a1e0a', color: '#f0a070', border: '1px solid #c2652a',
                      }}
                    >
                      {p.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
