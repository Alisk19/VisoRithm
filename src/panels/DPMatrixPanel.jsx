// src/panels/DPMatrixPanel.jsx — dark background, improved cell visibility
import React from 'react';
import { motion } from 'framer-motion';

export function DPMatrixPanel({ matrixState }) {
  if (!matrixState || !matrixState.grid) {
    return (
      <div className="h-full flex items-center justify-center text-secondary text-sm" style={{ background: '#0d0d0d', borderRadius: 12 }}>
        <div className="text-center">
          <span className="material-symbols-outlined text-3xl mb-2 block">table_chart</span>
          <p>Matrix will appear when algorithm runs</p>
        </div>
      </div>
    );
  }

  const { grid, activeCell, dependencyCells = [], rowLabels, colLabels } = matrixState;
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const isActive = (r, c) => activeCell && activeCell[0] === r && activeCell[1] === c;
  const isDep = (r, c) => dependencyCells.some(d => d[0] === r && d[1] === c);

  const cellSize = Math.min(54, Math.max(30, Math.floor(460 / Math.max(cols + 1, 1))));
  const fontSize = cellSize > 40 ? 13 : 10;

  return (
    <div className="w-full h-full flex flex-col rounded-xl overflow-hidden" style={{ background: '#0d0d0d' }}>
      <div className="overflow-auto flex-1 flex items-center justify-center p-4">
        <table className="border-separate" style={{ borderSpacing: '2px' }}>
          <thead>
            <tr>
              {/* Top-left corner */}
              <th style={{ width: cellSize, height: 28, background: '#1a1614', borderRadius: 4 }} />
              {colLabels?.map((l, c) => (
                <th key={c} style={{ width: cellSize, height: 28, textAlign: 'center', fontSize: 9, fontWeight: 700, color: '#7a6a5a', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {/* Row label */}
                <td style={{ width: cellSize, height: cellSize, textAlign: 'right', paddingRight: 8, fontSize: 9, fontWeight: 600, color: '#7a6a5a', whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {rowLabels?.[r] ?? r}
                </td>
                {row.map((val, c) => {
                  const active = isActive(r, c);
                  const dep = isDep(r, c);
                  let bg = '#1a1614', border = '#2a2420', color = '#5a5048';
                  if (active) { bg = '#3a1e0a'; border = '#c2652a'; color = '#f0a070'; }
                  else if (dep) { bg = '#1a2a14'; border = '#34a85366'; color = '#a0e8b0'; }
                  else if (val !== null && val !== 0 && val !== Infinity) { bg = '#1e1a16'; border = '#3a3028'; color = '#c8b8a8'; }

                  const dispVal = val === null ? '—' : val === Infinity || val === 999999 ? '∞' : val;

                  return (
                    <td key={c} style={{ width: cellSize, height: cellSize, padding: 0 }}>
                      <motion.div
                        layout
                        animate={{ scale: active ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          width: cellSize, height: cellSize,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: bg, border: `1.5px solid ${border}`, borderRadius: 5,
                          color, fontSize, fontWeight: 700, fontFamily: 'monospace',
                          boxShadow: active ? '0 0 10px rgba(194,101,42,0.5)' : dep ? '0 0 6px rgba(52,168,83,0.3)' : 'none',
                          transition: 'background 0.25s, border-color 0.25s',
                        }}
                      >
                        {dispVal}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
