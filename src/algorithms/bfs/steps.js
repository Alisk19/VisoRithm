// src/algorithms/bfs/steps.js — accepts custom graph from GraphBuilder
export function generateBfsSteps(customGraph = null) {
  const steps = [];

  // Use custom graph or default
  let baseNodes, adj, edges;

  if (customGraph && customGraph.nodes && customGraph.nodes.length > 0) {
    baseNodes = customGraph.nodes.map(n => ({ id: n.id, x: n.x, y: n.y, label: n.label }));
    adj = {};
    baseNodes.forEach(n => { adj[n.id] = []; });
    edges = [];
    customGraph.edges.forEach(e => {
      adj[e.source]?.push(e.target);
      adj[e.target]?.push(e.source); // undirected
      edges.push({ source: e.source, target: e.target, weight: e.weight, status: 'default' });
    });
  } else {
    baseNodes = [
      { id: 'A', x: 0.5, y: 0.1, label: 'A' },
      { id: 'B', x: 0.2, y: 0.4, label: 'B' },
      { id: 'C', x: 0.8, y: 0.4, label: 'C' },
      { id: 'D', x: 0.2, y: 0.8, label: 'D' },
      { id: 'E', x: 0.65, y: 0.85, label: 'E' },
    ];
    adj = { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'E'], D: ['B'], E: ['B', 'C'] };
    edges = [
      { source: 'A', target: 'B', status: 'default' },
      { source: 'A', target: 'C', status: 'default' },
      { source: 'B', target: 'D', status: 'default' },
      { source: 'B', target: 'E', status: 'default' },
      { source: 'C', target: 'E', status: 'default' },
    ];
  }

  const startId = customGraph?.startNodeId || baseNodes[0]?.id;

  const getGraphState = (activeIds = [], visitedIds = [], activeEdgeKeys = [], queue = []) => {
    const renderNodes = baseNodes.map(n => {
      let status = 'default', rank = null;
      if (activeIds.includes(n.id)) status = 'active';
      else if (visitedIds.includes(n.id)) { status = 'visited'; rank = visitedIds.indexOf(n.id) + 1; }
      return { ...n, status, rank };
    });
    const renderEdges = edges.map(e => {
      const k1 = `${e.source}-${e.target}`, k2 = `${e.target}-${e.source}`;
      return { ...e, status: (activeEdgeKeys.includes(k1) || activeEdgeKeys.includes(k2)) ? 'active' : 'default' };
    });
    return { nodes: renderNodes, edges: renderEdges, queue: [...queue] };
  };

  steps.push({
    action: 'initial', graphState: getGraphState([], [], [], []),
    explanation: 'Starting BFS.', subExplanation: `Begin from node ${startId}.`, highlightedLine: 2,
  });

  const visited = [];
  const queue = [];
  visited.push(startId);
  queue.push(startId);

  steps.push({
    action: 'enqueue', graphState: getGraphState([startId], [], [], queue),
    explanation: `Enqueue start node ${startId}.`, subExplanation: 'Mark it visited.', highlightedLine: 4,
  });

  while (queue.length > 0) {
    const u = queue.shift();
    steps.push({
      action: 'dequeue', graphState: getGraphState([u], visited, [], queue),
      explanation: `Dequeue node ${u}.`, subExplanation: 'Examine all neighbors.', highlightedLine: 7,
    });
    for (const v of (adj[u] || [])) {
      const edgeKey = `${u}-${v}`;
      steps.push({
        action: 'check_neighbor', graphState: getGraphState([u, v], visited, [edgeKey], queue),
        explanation: `Check neighbor ${v}.`,
        subExplanation: visited.includes(v) ? `${v} already visited — skip.` : `${v} not yet visited.`,
        highlightedLine: 9,
      });
      if (!visited.includes(v)) {
        visited.push(v);
        queue.push(v);
        steps.push({
          action: 'enqueue_neighbor', graphState: getGraphState([u, v], visited, [edgeKey], queue),
          explanation: `Enqueue ${v}.`, subExplanation: 'Marked visited.', highlightedLine: 11,
        });
      }
    }
    steps.push({
      action: 'finish_node', graphState: getGraphState([], visited, [], queue),
      explanation: `Done with node ${u}.`, subExplanation: 'Next node in queue.', highlightedLine: 7,
    });
  }

  steps.push({
    action: 'complete', graphState: getGraphState([], visited, [], []),
    explanation: 'BFS complete!', subExplanation: `Visit order: ${visited.join(' → ')}.`, highlightedLine: 14,
  });
  return steps;
}

export const bfsCode = {
  python: `def bfs(graph, start):\n    visited = [start]\n    queue = [start]\n\n    while queue:\n        u = queue.pop(0)\n        for v in graph[u]:\n            if v not in visited:\n                visited.append(v)\n                queue.append(v)\n    return visited`,
  cpp: `void bfs(map<int,vector<int>>& g, int start) {\n    map<int,bool> visited;\n    queue<int> q;\n    visited[start] = true;\n    q.push(start);\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : g[u])\n            if (!visited[v]) { visited[v]=true; q.push(v); }\n    }\n}`,
};
