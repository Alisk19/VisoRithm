// src/panels/GraphBuilder.jsx
// Interactive graph builder for BFS, DFS, Prim's, Kruskal's
import React, { useState, useRef, useCallback } from 'react';

const NODE_RADIUS = 22;

function generateNodeId(nodes) {
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const used = new Set(nodes.map(n => n.label));
  for (let l of labels) if (!used.has(l)) return l;
  return `N${nodes.length}`;
}

export function GraphBuilder({ onRun, showWeights = false, isPlaying }) {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([
    { id: 'A', label: 'A', x: 0.5, y: 0.15 },
    { id: 'B', label: 'B', x: 0.2, y: 0.5 },
    { id: 'C', label: 'C', x: 0.8, y: 0.5 },
    { id: 'D', label: 'D', x: 0.35, y: 0.85 },
    { id: 'E', label: 'E', x: 0.65, y: 0.85 },
  ]);
  const [edges, setEdges] = useState([
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'D', weight: 5 },
    { source: 'C', target: 'E', weight: 3 },
    { source: 'D', target: 'E', weight: 2 },
    { source: 'B', target: 'C', weight: 11 },
  ]);
  const [mode, setMode] = useState('select'); // 'select' | 'addNode' | 'addEdge' | 'delete'
  const [edgeStart, setEdgeStart] = useState(null);
  const [dragNode, setDragNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [startNodeId, setStartNodeId] = useState('A');
  const [error, setError] = useState('');

  const W = 500, H = 340;

  const getSVGCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0.5, y: 0.5 };
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height)),
    };
  };

  const handleSVGClick = (e) => {
    if (mode !== 'addNode') return;
    const coords = getSVGCoords(e);
    const label = generateNodeId(nodes);
    setNodes(prev => [...prev, { id: label, label, x: coords.x, y: coords.y }]);
    setError('');
  };

  const handleNodeClick = (nodeId, e) => {
    e.stopPropagation();
    if (mode === 'delete') {
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
      if (startNodeId === nodeId) setStartNodeId(nodes.find(n => n.id !== nodeId)?.id || '');
    } else if (mode === 'addEdge') {
      if (!edgeStart) {
        setEdgeStart(nodeId);
        setError(`Edge from ${nodeId} — now click target node`);
      } else {
        if (edgeStart === nodeId) {
          setEdgeStart(null);
          setError('Self-loops not allowed');
          return;
        }
        const dup = edges.find(e => (e.source === edgeStart && e.target === nodeId) || (e.source === nodeId && e.target === edgeStart));
        if (dup) { setEdgeStart(null); setError('Edge already exists'); return; }
        setEdges(prev => [...prev, { source: edgeStart, target: nodeId, weight: edgeWeight }]);
        setEdgeStart(null);
        setError('');
      }
    }
  };

  const handleEdgeClick = (idx, e) => {
    e.stopPropagation();
    if (mode === 'delete') {
      setEdges(prev => prev.filter((_, i) => i !== idx));
    } else if (showWeights) {
      // Edit weight inline
      const w = window.prompt('Enter new edge weight:', String(edges[idx].weight ?? 1));
      const parsed = parseInt(w, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setEdges(prev => prev.map((ed, i) => i === idx ? { ...ed, weight: parsed } : ed));
      }
    }
  };

  const handleMouseDown = (nodeId, e) => {
    if (mode !== 'select') return;
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    const coords = getSVGCoords(e);
    setDragNode(nodeId);
    setDragOffset({ x: coords.x - node.x, y: coords.y - node.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragNode) return;
    const coords = getSVGCoords(e);
    setNodes(prev => prev.map(n => n.id === dragNode
      ? { ...n, x: Math.max(0.05, Math.min(0.95, coords.x - dragOffset.x)), y: Math.max(0.05, Math.min(0.95, coords.y - dragOffset.y)) }
      : n
    ));
  }, [dragNode, dragOffset]);

  const handleMouseUp = useCallback(() => setDragNode(null), []);

  const handleRun = () => {
    if (nodes.length < 2) { setError('Add at least 2 nodes'); return; }
    const start = nodes.find(n => n.id === startNodeId);
    if (!start) { setError('Select a valid start node'); return; }
    setError('');
    onRun({ nodes, edges, startNodeId });
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setEdgeStart(null);
  };

  const modeBtn = (m, icon, label, active) => (
    <button
      onClick={() => { setMode(m); setEdgeStart(null); setError(''); }}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
        mode === m ? 'bg-primary text-white shadow' : 'bg-surface-container text-secondary hover:bg-surface-container-high'
      }`}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-outline-variant bg-surface-container-low/40">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary mr-1">Graph Builder</span>
        {modeBtn('select', 'pan_tool', 'Move')}
        {modeBtn('addNode', 'add_circle', 'Add Node')}
        {modeBtn('addEdge', 'merge', 'Add Edge')}
        {modeBtn('delete', 'delete', 'Delete')}
        {showWeights && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-secondary">New edge weight:</span>
            <input
              type="number" min="1" max="99" value={edgeWeight}
              onChange={e => setEdgeWeight(Number(e.target.value))}
              className="w-14 border border-outline-variant rounded px-2 py-1 text-xs text-center font-mono bg-surface-container focus:outline-none focus:border-primary"
            />
          </div>
        )}
        <button onClick={clearGraph} className="ml-auto px-3 py-2 rounded-lg text-xs font-bold text-error border border-error/30 hover:bg-error/5 transition-colors">
          Clear
        </button>
      </div>

      {error && (
        <div className="text-xs text-primary font-medium py-1.5 px-4 bg-primary/5 border-b border-primary/10">{error}</div>
      )}
      {showWeights && (
        <div className="text-[10px] text-secondary px-4 py-1.5 bg-surface-container-low/30 border-b border-outline-variant/40 italic">
          💡 Click any edge weight badge to edit it • Set the weight above before adding new edges
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full cursor-crosshair"
        style={{ height: 260, background: '#1a1614', cursor: mode === 'addNode' ? 'crosshair' : mode === 'select' ? 'default' : 'pointer' }}
        onClick={handleSVGClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid dots */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="#3a3028" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Edges */}
        {edges.map((edge, i) => {
          const s = nodes.find(n => n.id === edge.source);
          const t = nodes.find(n => n.id === edge.target);
          if (!s || !t) return null;
          const x1 = s.x * W, y1 = s.y * H, x2 = t.x * W, y2 = t.y * H;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          return (
          <g key={i} onClick={(e) => handleEdgeClick(i, e)} style={{ cursor: mode === 'delete' ? 'pointer' : showWeights ? 'pointer' : 'default' }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={mode === 'delete' ? '#c0392b' : '#5a5048'} strokeWidth="2.5" />
              {/* Always show weights for weighted graph */}
              {showWeights && (
                <g>
                  <circle cx={mx} cy={my} r="11" fill="#2a2420" stroke="#c2652a" strokeWidth="1.5" />
                  <text x={mx} y={my + 4} textAnchor="middle" fontSize="9" fill="#c2652a" fontWeight="bold">{edge.weight ?? 1}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Edge-in-progress line */}
        {edgeStart && (() => {
          const sNode = nodes.find(n => n.id === edgeStart);
          if (!sNode) return null;
          return (
            <circle cx={sNode.x * W} cy={sNode.y * H} r={NODE_RADIUS + 6} fill="none" stroke="#c2652a" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
          );
        })()}

        {/* Nodes */}
        {nodes.map(node => {
          const cx = node.x * W, cy = node.y * H;
          const isEdgeStart = edgeStart === node.id;
          const isStart = startNodeId === node.id;
          return (
            <g key={node.id}
              transform={`translate(${cx},${cy})`}
              onClick={(e) => handleNodeClick(node.id, e)}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              style={{ cursor: mode === 'select' ? 'grab' : 'pointer' }}
            >
              <circle r={NODE_RADIUS} fill={isEdgeStart ? '#c2652a' : isStart ? '#1e3a5f' : '#2a2420'} stroke={isEdgeStart ? '#f0a070' : isStart ? '#5b9bd5' : '#5a5048'} strokeWidth="2.5" />
              <text y="5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={isEdgeStart ? '#fff' : isStart ? '#90c8f0' : '#d8d0c8'} className="select-none">{node.label}</text>
              {isStart && (
                <text y={-NODE_RADIUS - 5} textAnchor="middle" fontSize="8" fill="#5b9bd5" fontWeight="bold">START</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 border-t border-outline-variant bg-surface-container-low/40">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-secondary font-medium">Start:</span>
          <select
            value={startNodeId}
            onChange={e => setStartNodeId(e.target.value)}
            className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-primary"
          >
            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-secondary">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> Start Node
          <span className="w-2 h-2 rounded-full bg-primary inline-block ml-2"></span> Edge source
        </div>
        <button
          onClick={handleRun}
          disabled={isPlaying || nodes.length < 2}
          className="ml-auto px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          Run Algorithm
        </button>
      </div>
    </div>
  );
}
