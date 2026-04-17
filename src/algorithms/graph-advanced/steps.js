// src/algorithms/graph-advanced/steps.js
// DFS, Prim's MST, Kruskal's MST — all accept optional customGraph from GraphBuilder

const DEFAULT_NODES = [
  { id: 'A', x: 0.5,  y: 0.05, label: 'A' },
  { id: 'B', x: 0.15, y: 0.35, label: 'B' },
  { id: 'C', x: 0.85, y: 0.35, label: 'C' },
  { id: 'D', x: 0.15, y: 0.75, label: 'D' },
  { id: 'E', x: 0.5,  y: 0.9,  label: 'E' },
  { id: 'F', x: 0.85, y: 0.75, label: 'F' },
];
const DEFAULT_EDGES = [
  { source:'A', target:'B', weight:4 }, { source:'A', target:'C', weight:2 },
  { source:'B', target:'D', weight:5 }, { source:'B', target:'E', weight:11 },
  { source:'C', target:'F', weight:3 }, { source:'D', target:'E', weight:2 },
  { source:'E', target:'F', weight:1 },
];

function buildState(nodes, edges, visited=[], active=[], activeEdgeKeys=[], mstEdgeKeys=[], isStack=false, queueOrStack=[]) {
  const renderNodes = nodes.map(n => {
    let status = 'default', rank = null;
    if (active.includes(n.id)) status = 'active';
    else if (visited.includes(n.id)) { status = 'visited'; rank = visited.indexOf(n.id) + 1; }
    return { ...n, status, rank };
  });
  const renderEdges = edges.map(e => {
    const k1 = `${e.source}-${e.target}`, k2 = `${e.target}-${e.source}`;
    let status = 'default';
    if (mstEdgeKeys.includes(k1) || mstEdgeKeys.includes(k2)) status = 'mst';
    else if (activeEdgeKeys.includes(k1) || activeEdgeKeys.includes(k2)) status = 'active';
    return { ...e, status };
  });
  const obj = { nodes: renderNodes, edges: renderEdges };
  if (isStack) obj.stack = [...queueOrStack];
  else obj.queue = [...queueOrStack];
  return obj;
}

const mkStep = (o) => ({
  action:'idle', explanation:'', subExplanation:'', highlightedLine:-1,
  array:[], indices:[], sortedIndices:[], pointers:[], inactiveIndices:[],
  board:null, treeState:{nodes:[],edges:[]}, logs:[], matrixState:null, graphState:null,
  ...o,
});

// ── DFS ─────────────────────────────────────────────────────────────────────
export function generateDfsSteps(customGraph = null) {
  const steps = [];
  const nodes = customGraph?.nodes || DEFAULT_NODES;
  const edges = customGraph?.edges || DEFAULT_EDGES;
  const startId = customGraph?.startNodeId || nodes[0]?.id;

  // Build adjacency list (undirected)
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.source]?.push(e.target);
    adj[e.target]?.push(e.source);
  });

  const visited = [], stack = [];
  const snap = (action, active, activeEdges, explanation, sub, line, mst=[]) =>
    mkStep({ action, graphState: buildState(nodes, edges, [...visited], active, activeEdges, mst, true, [...stack]), explanation, subExplanation: sub, highlightedLine: line });

  steps.push(snap('initial', [], [], 'Starting DFS.', `DFS uses a Stack. Starting from ${startId}.`, 1));
  stack.push(startId);
  steps.push(snap('push', [startId], [], `Push start node ${startId}.`, 'Stack top = next to explore.', 2));

  while (stack.length > 0) {
    const u = stack[stack.length - 1];
    steps.push(snap('pop', [u], [], `Peek top: Node ${u}.`, 'Marking visited.', 4));
    if (!visited.includes(u)) {
      visited.push(u);
      stack.pop();
      const unvisitedNeighbors = (adj[u] || []).filter(v => !visited.includes(v));
      for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
        const v = unvisitedNeighbors[i];
        const ek = `${u}-${v}`;
        stack.push(v);
        steps.push(snap('push', [u, v], [ek], `Check neighbor ${v} of ${u}.`, `${v} unvisited — push.`, 7));
      }
    } else {
      stack.pop();
    }
  }
  steps.push(snap('complete', [], [], 'DFS complete!', `Visit order: ${visited.join(' → ')}.`, 10));
  return steps;
}

export const dfsCode = {
  python: `def dfs(graph, start):\n    visited = []\n    stack = [start]\n    while stack:\n        u = stack.pop()\n        if u not in visited:\n            visited.append(u)\n            for v in graph[u]:\n                if v not in visited:\n                    stack.append(v)\n    return visited`,
  cpp: `void dfs(map<string,vector<string>>& g, string s){\n    map<string,bool> vis;\n    stack<string> st;\n    st.push(s);\n    while(!st.empty()){\n        string u=st.top(); st.pop();\n        if(!vis[u]){\n            vis[u]=true;\n            for(auto v:g[u]) if(!vis[v]) st.push(v);\n        }\n    }\n}`,
};

// ── PRIM'S MST ───────────────────────────────────────────────────────────────
export function generatePrimsSteps(customGraph = null) {
  const steps = [];
  const nodes = customGraph?.nodes || DEFAULT_NODES;
  const edges = (customGraph?.edges || DEFAULT_EDGES).map(e => ({ ...e }));
  const startId = customGraph?.startNodeId || nodes[0]?.id;
  const n = nodes.length;

  const visited = [], mstKeys = [];
  const key = {};
  const parent = {};
  nodes.forEach(nd => { key[nd.id] = Infinity; parent[nd.id] = null; });
  key[startId] = 0;

  const snap = (action, active, activeEdgeKeys, mst, explanation, sub, line) =>
    mkStep({ action, graphState: buildState(nodes, edges, [...visited], active, activeEdgeKeys, [...mst], false, []), explanation, subExplanation: sub, highlightedLine: line });

  steps.push(snap('initial', [], [], [], "Starting Prim's MST.", `Greedy: always pick minimum weight edge to unvisited node. Start: ${startId}.`, 1));

  for (let iter = 0; iter < n; iter++) {
    // Find min-key unvisited node
    let u = null;
    nodes.forEach(nd => {
      if (!visited.includes(nd.id) && (u === null || key[nd.id] < key[u])) u = nd.id;
    });
    if (u === null) break;
    visited.push(u);

    if (parent[u] !== null) {
      const ek = `${parent[u]}-${u}`;
      const ekR = `${u}-${parent[u]}`;
      mstKeys.push(ek);
      steps.push(snap('add-edge', [u], [ek, ekR], [...mstKeys], `Add edge (${parent[u]}–${u}, w=${key[u]}) to MST.`, `MST has ${mstKeys.length} edge(s).`, 7));
    } else {
      steps.push(snap('start', [u], [], [], `Start node: ${u}.`, 'MST root — no parent.', 3));
    }

    // Relax neighbors
    edges.forEach(e => {
      let v = null;
      if (e.source === u) v = e.target;
      else if (e.target === u) v = e.source;
      if (!v || visited.includes(v)) return;
      const ek = `${u}-${v}`;
      const w = e.weight ?? 1;
      steps.push(snap('relax', [u, v], [ek], [...mstKeys], `Relax edge to ${v} (w=${w}).`, w < key[v] ? `${w} < key[${v}]=${key[v]===Infinity?'∞':key[v]} → update.` : `No update needed.`, 9));
      if (w < key[v]) { key[v] = w; parent[v] = u; }
    });
  }

  steps.push(snap('complete', [], [], [...mstKeys], "Prim's MST complete!", `${n-1} edges span all ${n} nodes.`, 12));
  return steps;
}

export const primsCode = {
  python: `def prims(graph, start):\n    key = {v: float('inf') for v in graph}\n    parent = {v: None for v in graph}\n    key[start] = 0\n    unvisited = set(graph.keys())\n    while unvisited:\n        u = min(unvisited, key=lambda x: key[x])\n        unvisited.remove(u)\n        for v, w in graph[u]:\n            if v in unvisited and w < key[v]:\n                parent[v] = u\n                key[v] = w`,
  cpp: `// See Prim's MST implementation with priority queue`,
};

// ── KRUSKAL'S MST ─────────────────────────────────────────────────────────────
export function generateKruskalSteps(customGraph = null) {
  const steps = [];
  const nodes = customGraph?.nodes || DEFAULT_NODES;
  const baseEdges = (customGraph?.edges || DEFAULT_EDGES).map(e => ({ ...e }));
  const n = nodes.length;

  // Union-Find
  const par = {};
  nodes.forEach(nd => { par[nd.id] = nd.id; });
  function find(x) { return par[x] === x ? x : (par[x] = find(par[x])); }
  function union(x, y) { par[find(x)] = find(y); }

  const sorted = [...baseEdges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
  const mstKeys = [], visited = [];

  const snap = (action, active, activeEdgeKeys, explanation, sub, line) =>
    mkStep({ action, graphState: buildState(nodes, baseEdges, [...visited], active, activeEdgeKeys, [...mstKeys], false, []), explanation, subExplanation: sub, highlightedLine: line });

  steps.push(snap('initial', [], [], "Starting Kruskal's MST.", `Sort ${baseEdges.length} edges by weight, add if no cycle.`, 1));
  steps.push(snap('sorted', [], [], `Sorted edges: ${sorted.map(e=>`${e.source}-${e.target}(${e.weight??1})`).join(', ')}.`, 'Processing each edge...', 2));

  for (const e of sorted) {
    const { source: u, target: v, weight: w = 1 } = e;
    const pu = find(u), pv = find(v);
    const ek = `${u}-${v}`;
    steps.push(snap('examine', [u, v], [ek], `Examine edge ${u}–${v} (w=${w}).`, pu === pv ? `Same component — cycle! Skip.` : `Different components — add to MST!`, 4));

    if (pu !== pv) {
      union(u, v);
      mstKeys.push(ek);
      if (!visited.includes(u)) visited.push(u);
      if (!visited.includes(v)) visited.push(v);
      steps.push(snap('add-edge', [u, v], [ek], `Added ${u}–${v} (w=${w}) to MST.`, `MST: ${mstKeys.length} edge(s).`, 6));
      if (mstKeys.length === n - 1) break;
    }
  }

  steps.push(snap('complete', [], [], "Kruskal's MST complete!", `${n-1} MST edges found.`, 9));
  return steps;
}

export const kruskalCode = {
  python: `def kruskal(vertices, edges):\n    edges.sort(key=lambda e: e[2])\n    parent = {v:v for v in vertices}\n    def find(v):\n        if parent[v]!=v: parent[v]=find(parent[v])\n        return parent[v]\n    mst = []\n    for u,v,w in edges:\n        if find(u)!=find(v):\n            parent[find(u)]=find(v)\n            mst.append((u,v,w))\n    return mst`,
  cpp: `// See Kruskal's with Union-Find implementation`,
};
