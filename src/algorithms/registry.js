// src/algorithms/registry.js — updated with new inputTypes
import { generateBubbleSortSteps, bubbleSortCode } from './bubble-sort/steps';
import { generateLinearSearchSteps, generateBinarySearchSteps, linearSearchCode, binarySearchCode } from './linear-search/steps';
import { generate4QueensSteps, queensCode } from './4-queens/steps';
import { generateKnapsackSteps, knapsackCode } from './0-1-knapsack-dp/steps';
import { generateBfsSteps, bfsCode } from './bfs/steps';

import {
  generateSelectionSortSteps, selectionSortCode,
  generateInsertionSortSteps, insertionSortCode,
  generateMergeSortSteps, mergeSortCode,
  generateQuickSortSteps, quickSortCode,
} from './sorting/steps';

import {
  generateDfsSteps, dfsCode,
  generatePrimsSteps, primsCode,
  generateKruskalSteps, kruskalCode,
} from './graph-advanced/steps';

import {
  generateFibonacciDpSteps, fibonacciDpCode,
  generateLcsSteps, lcsCode,
  generateKnapsackBbSteps, knapsackBbCode,
  generateJobAssignmentSteps, jobAssignmentCode,
  generateWarshallSteps, warshallCode,
  generateFloydSteps, floydCode,
} from './dp-advanced/steps';

import {
  generateRatInMazeSteps, ratInMazeCode,
  generateSubsetSumSteps, subsetSumCode,
  generatePermutationsSteps, permutationsCode,
  generateNQueensOptimizedSteps, nQueensOptimizedCode,
} from './backtracking-extras/steps';

import {
  generateActivitySelectionSteps, activitySelectionCode,
  generateFractionalKnapsackSteps, fractionalKnapsackCode,
} from './greedy/steps';

function randomArray(len = 8, max = 90) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * max) + 10);
}

// inputType values:
//  'array'          → comma-separated numbers
//  'search'         → array + target value
//  'grid_size'      → single integer (N for NxN board)
//  'graph'          → GraphBuilder (BFS/DFS)
//  'weighted-graph' → GraphBuilder with weights (Prim's/Kruskal's)
//  'knapsack'       → item list (weight, value) + capacity
//  'matrix'         → adjacency matrix (Warshall)
//  'weighted-matrix'→ distance matrix (Floyd)
//  'none'           → no input, auto-run

export const ALGORITHM_REGISTRY = {
  /* ── Sorting ── */
  'bubble-sort': {
    generateSteps: (d) => generateBubbleSortSteps(d || randomArray()),
    code: { python: bubbleSortCode, cpp: '// See Python code above' },
    panelType: 'array-bars', inputType: 'array', defaultData: randomArray,
  },
  'selection-sort': {
    generateSteps: (d) => generateSelectionSortSteps(d || randomArray()),
    code: selectionSortCode, panelType: 'array-bars', inputType: 'array', defaultData: randomArray,
  },
  'insertion-sort': {
    generateSteps: (d) => generateInsertionSortSteps(d || randomArray()),
    code: insertionSortCode, panelType: 'array-bars', inputType: 'array', defaultData: randomArray,
  },
  'merge-sort': {
    generateSteps: (d) => generateMergeSortSteps(d || randomArray(6)),
    code: mergeSortCode, panelType: 'array-bars', inputType: 'array', defaultData: () => randomArray(6),
  },
  'quick-sort': {
    generateSteps: (d) => generateQuickSortSteps(d || randomArray()),
    code: quickSortCode, panelType: 'array-bars', inputType: 'array', defaultData: randomArray,
  },

  /* ── Searching ── */
  'linear-search': {
    generateSteps: (d) => {
      const arr = d?.array || randomArray();
      const target = d?.target ?? arr[Math.floor(Math.random() * arr.length)];
      return generateLinearSearchSteps(arr, target);
    },
    code: linearSearchCode, panelType: 'array-boxes', inputType: 'search', defaultData: () => {
      const arr = randomArray();
      return { array: arr, target: arr[Math.floor(Math.random() * arr.length)] };
    },
  },
  'binary-search': {
    generateSteps: (d) => {
      const arr = d?.array
        ? [...d.array].sort((a, b) => a - b)
        : [...randomArray()].sort((a, b) => a - b);
      const target = d?.target ?? arr[Math.floor(Math.random() * arr.length)];
      return generateBinarySearchSteps(arr, target);
    },
    code: binarySearchCode, panelType: 'array-boxes', inputType: 'search', defaultData: () => {
      const arr = [...randomArray()].sort((a, b) => a - b);
      return { array: arr, target: arr[Math.floor(Math.random() * arr.length)] };
    },
  },

  /* ── Divide & Conquer ── */
  'dc-merge-sort': {
    generateSteps: (d) => generateMergeSortSteps(d || randomArray(6)),
    code: mergeSortCode, panelType: 'array-bars', inputType: 'array', defaultData: () => randomArray(6),
  },
  'dc-quick-sort': {
    generateSteps: (d) => generateQuickSortSteps(d || randomArray()),
    code: quickSortCode, panelType: 'array-bars', inputType: 'array', defaultData: randomArray,
  },
  'dc-binary-search': {
    generateSteps: (d) => {
      const arr = d?.array ? [...d.array].sort((a,b)=>a-b) : [...randomArray()].sort((a,b)=>a-b);
      const target = d?.target ?? arr[Math.floor(Math.random()*arr.length)];
      return generateBinarySearchSteps(arr, target);
    },
    code: binarySearchCode, panelType: 'array-boxes', inputType: 'search', defaultData: () => {
      const arr = [...randomArray()].sort((a,b)=>a-b);
      return { array: arr, target: arr[Math.floor(Math.random()*arr.length)] };
    },
  },

  /* ── Backtracking ── */
  'n-queens': {
    generateSteps: (d) => generate4QueensSteps(typeof d === 'number' ? d : 4),
    code: queensCode, panelType: 'grid-bt', inputType: 'grid_size', defaultData: () => 4,
  },
  'rat-in-maze': {
    generateSteps: () => generateRatInMazeSteps(),
    code: ratInMazeCode, panelType: 'grid-bt', inputType: 'none', defaultData: () => null,
  },
  'subset-sum': {
    generateSteps: (d) => generateSubsetSumSteps(d?.arr ?? [3,1,4,2,2], d?.target ?? 6),
    code: subsetSumCode, panelType: 'decision-tree', inputType: 'subset-sum', defaultData: () => null,
  },
  'permutations': {
    generateSteps: () => generatePermutationsSteps(),
    code: permutationsCode, panelType: 'decision-tree', inputType: 'none', defaultData: () => null,
  },

  /* ── Branch & Bound ── */
  'n-queens-optimized': {
    generateSteps: (d) => generateNQueensOptimizedSteps(typeof d === 'number' ? d : 4),
    code: nQueensOptimizedCode, panelType: 'grid-bt', inputType: 'grid_size', defaultData: () => 4,
  },
  '0-1-knapsack-bb': {
    generateSteps: (d) => {
      if (d?.capacity) return generateKnapsackBbSteps();
      return generateKnapsackBbSteps();
    },
    code: knapsackBbCode, panelType: 'dp-matrix', inputType: 'none', defaultData: () => null,
  },
  'job-assignment': {
    generateSteps: () => generateJobAssignmentSteps(),
    code: jobAssignmentCode, panelType: 'dp-matrix', inputType: 'none', defaultData: () => null,
  },

  /* ── Graph ── */
  'bfs': {
    generateSteps: (d) => generateBfsSteps(d || null),
    code: bfsCode, panelType: 'graph', inputType: 'graph', defaultData: () => null,
  },
  'dfs': {
    generateSteps: (d) => generateDfsSteps(d || null),
    code: dfsCode, panelType: 'graph', inputType: 'graph', defaultData: () => null,
  },
  'prims': {
    generateSteps: (d) => generatePrimsSteps(d || null),
    code: primsCode, panelType: 'graph', inputType: 'weighted-graph', defaultData: () => null,
  },
  'kruskal': {
    generateSteps: (d) => generateKruskalSteps(d || null),
    code: kruskalCode, panelType: 'graph', inputType: 'weighted-graph', defaultData: () => null,
  },

  /* ── Dynamic Programming ── */
  '0-1-knapsack-dp': {
    generateSteps: (d) => {
      if (d?.capacity && d?.weights) return generateKnapsackSteps(d.capacity, d.weights, d.values);
      return generateKnapsackSteps(10, [2,3,4,5], [3,4,5,8]);
    },
    code: knapsackCode, panelType: 'dp-matrix', inputType: 'knapsack', defaultData: () => null,
  },
  'fibonacci-dp': {
    generateSteps: () => generateFibonacciDpSteps(9),
    code: fibonacciDpCode, panelType: 'dp-matrix', inputType: 'none', defaultData: () => null,
  },
  'lcs': {
    generateSteps: () => generateLcsSteps('ABCD', 'ACBD'),
    code: lcsCode, panelType: 'dp-matrix', inputType: 'none', defaultData: () => null,
  },

  /* ── Greedy ── */
  'activity-selection': {
    generateSteps: () => generateActivitySelectionSteps(),
    code: activitySelectionCode, panelType: 'array-bars', inputType: 'none', defaultData: () => null,
  },
  'fractional-knapsack': {
    generateSteps: () => generateFractionalKnapsackSteps(),
    code: fractionalKnapsackCode, panelType: 'array-bars', inputType: 'none', defaultData: () => null,
  },

  /* ── Miscellaneous ── */
  'warshalls': {
    generateSteps: (d) => generateWarshallSteps(d || null),
    code: warshallCode, panelType: 'dp-matrix', inputType: 'matrix', defaultData: () => null,
  },
  'floyds': {
    generateSteps: (d) => generateFloydSteps(d || null),
    code: floydCode, panelType: 'dp-matrix', inputType: 'weighted-matrix', defaultData: () => null,
  },
};

export function getAlgorithmConfig(slug) {
  return ALGORITHM_REGISTRY[slug] || null;
}
