// src/panels/GraphPanel.jsx — dark background, edge weights, MST highlights
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function GraphPanel({ graphState }) {
  if (!graphState || !graphState.nodes) {
    return (
      <div className="h-full flex items-center justify-center text-secondary text-sm rounded-xl" style={{ background: '#0d0d0d' }}>
        <div className="text-center">
          <span className="material-symbols-outlined text-3xl mb-2 block">hub</span>
          <p>Build a graph above and click Run Algorithm</p>
        </div>
      </div>
    );
  }

  const { nodes, edges, queue, stack, mstEdges } = graphState;
  const W = 500, H = 380;

  const getCoords = (node) => ({
    cx: node.x * W + 40,
    cy: node.y * H + 40,
  });

  return (
    <div className="rounded-xl border border-outline-variant shadow-sm w-full h-full flex flex-col md:flex-row overflow-hidden">
      {/* Graph Canvas */}
      <div className="flex-grow relative" style={{ background: '#0d0d0d', backgroundImage: 'radial-gradient(#2a2420 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        {/* Legend */}
        <div className="absolute top-3 left-3 z-10 flex gap-2 text-[9px] uppercase font-bold">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />Active
          </span>
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-1 rounded text-success">
            <span className="w-2 h-2 rounded-full bg-success inline-block" />Visited
          </span>
          {mstEdges && (
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-1 rounded text-success">
              <span className="inline-block w-4 border-t-2 border-success" /> MST edge
            </span>
          )}
        </div>

        <svg className="w-full h-full" viewBox={`0 0 ${W + 80} ${H + 80}`} preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {edges.map((edge, i) => {
            const sInfo = nodes.find(n => n.id === edge.source);
            const tInfo = nodes.find(n => n.id === edge.target);
            if (!sInfo || !tInfo) return null;
            const p1 = getCoords(sInfo), p2 = getCoords(tInfo);
            const mx = (p1.cx + p2.cx) / 2, my = (p1.cy + p2.cy) / 2;
            const isActive = edge.status === 'active';
            const isMST = edge.status === 'mst';
            const isRejected = edge.status === 'rejected';

            return (
              <g key={`e-${i}`}>
                <line
                  x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy}
                  stroke={isActive ? '#c2652a' : isMST ? '#34a853' : isRejected ? '#c0392b44' : '#3a3028'}
                  strokeWidth={isActive || isMST ? 3.5 : 2}
                  strokeDasharray={isRejected ? '4 3' : 'none'}
                  className="transition-all duration-300"
                />
                {/* Weight label */}
                {edge.weight !== undefined && (
                  <g>
                    <circle cx={mx} cy={my} r="11" fill="#0d0d0d" stroke={isActive ? '#c2652a' : isMST ? '#34a853' : '#3a3028'} strokeWidth="1.5" />
                    <text x={mx} y={my + 4} textAnchor="middle" fontSize="9" fontWeight="bold"
                      fill={isActive ? '#f0a070' : isMST ? '#a0e8b0' : '#7a6a5a'}>
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = getCoords(node);
            const isActive = node.status === 'active';
            const isVisited = node.status === 'visited';
            let fill = '#1e1a16', stroke = '#5a5048', textFill = '#9a8a7a';
            if (isActive) { fill = '#3a1e0a'; stroke = '#c2652a'; textFill = '#f0a070'; }
            else if (isVisited) { fill = '#0a2a14'; stroke = '#34a853'; textFill = '#a0e8b0'; }

            return (
              <g key={`n-${node.id}`} transform={`translate(${pos.cx}, ${pos.cy})`}>
                <circle
                  r={isActive ? 23 : 19}
                  fill={fill} stroke={stroke} strokeWidth="2.5"
                  style={{ filter: isActive ? 'drop-shadow(0 0 8px rgba(194,101,42,0.7))' : isVisited ? 'drop-shadow(0 0 6px rgba(52,168,83,0.5))' : 'none', transition: 'all 0.3s' }}
                />
                <text y="5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={textFill}>{node.label || node.id}</text>
                {node.rank && (
                  <g transform="translate(14,-14)">
                    <circle r="8" fill="#c2652a" />
                    <text y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">{node.rank}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Side panel */}
      <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-outline-variant flex flex-col pt-2 p-3 gap-3 overflow-hidden" style={{ background: '#141210' }}>
        {queue !== undefined && (
          <div className="flex flex-col flex-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-secondary mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">view_list</span>Queue (FIFO)
            </span>
            <div className="flex-1 border border-outline-variant/30 rounded-lg p-2 flex flex-col gap-1.5 overflow-y-auto" style={{ background: '#0d0d0d' }}>
              {queue.length === 0 ? <span className="text-secondary italic text-xs p-1">Empty</span> : null}
              <AnimatePresence>
                {queue.map((item, idx) => (
                  <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    key={`q-${item}-${idx}`}
                    className="text-center py-1.5 px-3 rounded font-mono font-bold text-sm border"
                    style={idx === 0
                      ? { background: '#3a1e0a', color: '#f0a070', borderColor: '#c2652a', borderStyle: 'dashed' }
                      : { background: '#1e1a16', color: '#9a8a7a', borderColor: '#3a3028' }}
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
        {stack !== undefined && (
          <div className="flex flex-col flex-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-secondary mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">layers</span>Stack (LIFO)
            </span>
            <div className="flex-1 border border-outline-variant/30 rounded-lg p-2 flex flex-col-reverse gap-1.5 overflow-y-auto relative" style={{ background: '#0d0d0d' }}>
              {stack.length === 0 ? <span className="text-secondary italic text-xs p-1 text-center">Empty</span> : null}
              <AnimatePresence>
                {stack.map((item, idx) => (
                  <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    key={`s-${item}-${idx}`}
                    className="text-center py-1.5 px-3 rounded font-mono font-bold text-sm border"
                    style={idx === stack.length - 1
                      ? { background: '#1a2a3a', color: '#90c8f0', borderColor: '#5b9bd5', borderStyle: 'dashed' }
                      : { background: '#1e1a16', color: '#9a8a7a', borderColor: '#3a3028' }}
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
        {/* MST info */}
        {mstEdges !== undefined && (
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-success mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">park</span>MST Edges
            </span>
            <div className="text-xs font-mono text-success/80">
              {mstEdges && mstEdges.length === 0 && <span className="text-secondary italic">Building...</span>}
              {mstEdges && mstEdges.map((e, i) => (
                <div key={i} className="py-0.5">{e.source}–{e.target} (w:{e.weight})</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
