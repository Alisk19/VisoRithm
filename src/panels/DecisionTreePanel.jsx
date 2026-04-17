// src/panels/DecisionTreePanel.jsx
// Fixed: proper hierarchical layout (no overlaps), fullscreen expand button
import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';

// Compute non-overlapping x positions using tree layout
function computeLayout(nodes, edges) {
  if (!nodes.length) return {};

  // Build children map
  const children = {};
  const inDegree = {};
  nodes.forEach(n => { children[n.id] = []; inDegree[n.id] = 0; });
  edges.forEach(e => {
    if (children[e.source] !== undefined) children[e.source].push(e.target);
    if (inDegree[e.target] !== undefined) inDegree[e.target]++;
  });

  // Find roots (nodes with no incoming edges)
  const roots = nodes.filter(n => inDegree[n.id] === 0);
  if (!roots.length) roots.push(nodes[0]);

  const positions = {};

  // Recursive post-order layout
  const NODE_W = 50; // horizontal space per node
  let xCounter = 0;

  function layout(nodeId) {
    const ch = children[nodeId] || [];
    if (ch.length === 0) {
      positions[nodeId] = positions[nodeId] || {};
      positions[nodeId].x = xCounter * NODE_W;
      xCounter++;
      return positions[nodeId].x;
    }
    const childXs = ch.map(c => layout(c));
    const cx = (childXs[0] + childXs[childXs.length - 1]) / 2;
    positions[nodeId] = positions[nodeId] || {};
    positions[nodeId].x = cx;
    return cx;
  }

  roots.forEach(r => layout(r.id));

  // Assign y from node.dy
  nodes.forEach(n => {
    if (!positions[n.id]) positions[n.id] = { x: xCounter++ * NODE_W };
    positions[n.id].y = (n.dy || 0) * 80 + 40;
  });

  return positions;
}

function TreeSVG({ nodes, edges, width, height }) {
  const positions = useMemo(() => computeLayout(nodes, edges), [nodes, edges]);

  return (
    <svg
      width="100%" height="100%"
      viewBox={`-30 0 ${Math.max(width, 200)} ${Math.max(height, 200)}`}
      style={{ overflow: 'visible' }}
    >
      {/* Edges */}
      {edges.map((edge, i) => {
        const s = positions[edge.source];
        const t = positions[edge.target];
        const tNode = nodes.find(n => n.id === edge.target);
        if (!s || !t) return null;
        return (
          <line
            key={`edge-${i}`}
            x1={s.x} y1={s.y}
            x2={t.x} y2={t.y}
            stroke={tNode?.status === 'failed' ? '#c0392b55' : tNode?.status === 'success' ? '#34a85366' : '#5a5048'}
            strokeWidth="1.5"
            strokeDasharray={tNode?.status === 'failed' ? '4 3' : 'none'}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const pos = positions[node.id];
        if (!pos) return null;

        let fill = '#1e1a16', stroke = '#5a5048', textFill = '#9a8a7a';
        if (node.status === 'active') { fill = '#3a1e0a'; stroke = '#c2652a'; textFill = '#f0a070'; }
        else if (node.status === 'failed') { fill = '#2a1010'; stroke = '#c0392b'; textFill = '#e07070'; }
        else if (node.status === 'success') { fill = '#0a2a14'; stroke = '#34a853'; textFill = '#a0e8b0'; }

        return (
          <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
            <circle r="16" fill={fill} stroke={stroke} strokeWidth="2" />
            <text y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill={textFill}>
              {String(node.label).slice(0, 6)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DecisionTreePanel({ treeState }) {
  const [fullscreen, setFullscreen] = useState(false);
  const nodes = treeState?.nodes || [];
  const edges = treeState?.edges || [];

  const { maxDepth, treeWidth } = useMemo(() => {
    let md = 0;
    nodes.forEach(n => { if ((n.dy || 0) > md) md = n.dy || 0; });
    const leaves = nodes.filter(n => !edges.some(e => e.source === n.id)).length;
    return { maxDepth: Math.max(md, 3), treeWidth: Math.max(leaves * 50, 300) };
  }, [nodes, edges]);

  const canvasH = maxDepth * 80 + 80;

  const inner = (
    <div className="w-full h-full overflow-auto" style={{ background: '#0d0d0d', backgroundImage: 'radial-gradient(#2a2420 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div style={{ width: treeWidth + 60, height: canvasH, minWidth: '100%', minHeight: '100%' }}>
        <TreeSVG nodes={nodes} edges={edges} width={treeWidth + 60} height={canvasH} />
      </div>
    </div>
  );

  const panel = (
    <div
      className={`rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden ${fullscreen ? 'fixed inset-4 z-[999] rounded-2xl shadow-2xl' : 'w-full h-full'}`}
      style={fullscreen ? {} : {}}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-outline-variant bg-[#0d0d0d]/95 backdrop-blur z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-label uppercase tracking-widest text-secondary font-semibold">Decision Tree</span>
          <div className="flex gap-2 text-[9px] uppercase font-bold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" />Active</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error inline-block" />Pruned</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" />Solution</span>
          </div>
        </div>
        <button
          onClick={() => setFullscreen(f => !f)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-secondary hover:text-on-surface"
          title={fullscreen ? 'Exit fullscreen' : 'Expand tree'}
        >
          <span className="material-symbols-outlined text-base">{fullscreen ? 'close_fullscreen' : 'open_in_full'}</span>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-secondary text-sm" style={{ background: '#0d0d0d' }}>
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl mb-2 block text-outline">account_tree</span>
              <p>Tree updates as algorithm runs</p>
            </div>
          </div>
        ) : inner}
      </div>
    </div>
  );

  if (fullscreen) {
    return ReactDOM.createPortal(panel, document.body);
  }
  return panel;
}
