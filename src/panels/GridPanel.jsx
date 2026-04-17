// src/panels/GridPanel.jsx — dark theme, proper board rendering for N-Queens / Rat in Maze
import React from 'react';
import { motion } from 'framer-motion';

// cellValue meanings:
//  0 = blocked (maze), 1 = open / queen placed, 2 = current path, 3 = backtracked
export function GridPanel({ boardState, board, action, conflictCell }) {
  // Support both props for compatibility
  const grid = boardState || board;

  if (!grid || grid.length === 0) {
    // Placeholder 4x4 empty grid
    const n = 4;
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">State Canvas</span>
        <div className="grid gap-[2px] rounded-lg overflow-hidden border border-outline-variant/40"
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, background: '#1a1614', borderColor: '#3a3028' }}>
          {Array.from({ length: n * n }).map((_, idx) => {
            const r = Math.floor(idx / n), c = idx % n;
            const isDark = (r + c) % 2 === 1;
            return (
              <div key={idx} style={{ width: 52, height: 52, background: isDark ? '#1e1a16' : '#141210', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#3a3028', fontSize: 22 }}>·</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-secondary text-center">Load data to see the chessboard</p>
      </div>
    );
  }

  const n = grid.length;
  const cellSize = Math.min(60, Math.floor(480 / n));

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">State Canvas</span>
      <div
        className="rounded-lg overflow-hidden border-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
          gap: '1px',
          background: '#2a2420',
          borderColor: '#5a5048',
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isDark = (rIdx + cIdx) % 2 === 1;
            const isConflict = action === 'conflict' && conflictCell?.[0] === rIdx && conflictCell?.[1] === cIdx;
            const isAttempt = action === 'attempt' && conflictCell?.[0] === rIdx && conflictCell?.[1] === cIdx;

            // Maze cell colors
            let bg = isDark ? '#1e1a16' : '#141210';
            if (cell === 0) bg = '#0a0807'; // blocked
            else if (cell === 2) bg = '#1a2a14'; // path
            else if (cell === 3) bg = '#2a1a10'; // backtracked

            const border = isConflict ? '#c0392b' : isAttempt ? '#c2652a' : 'transparent';

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                style={{
                  width: cellSize, height: cellSize,
                  background: bg,
                  border: `2px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {/* Queen */}
                {cell === 1 && grid[0].length === n && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ fontSize: cellSize * 0.6, lineHeight: 1, color: '#f0c060' }}
                  >
                    ♛
                  </motion.div>
                )}

                {/* Maze: open path */}
                {cell === 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ width: cellSize * 0.4, height: cellSize * 0.4, borderRadius: '50%', background: '#34a853', boxShadow: '0 0 8px rgba(52,168,83,0.8)' }}
                  />
                )}

                {/* Maze: backtracked */}
                {cell === 3 && (
                  <div style={{ width: cellSize * 0.3, height: cellSize * 0.3, borderRadius: '50%', background: '#c0392b44' }} />
                )}

                {/* Maze: blocked */}
                {cell === 0 && (
                  <div style={{ width: '80%', height: '80%', background: '#0d0b0a', borderRadius: 2 }} />
                )}

                {isConflict && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ position: 'absolute', inset: 0, background: '#c0392b22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ color: '#c0392b', fontSize: 16 }}>✕</span>
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
