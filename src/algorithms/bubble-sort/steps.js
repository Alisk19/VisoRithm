export function generateBubbleSortSteps(array) {
  const steps = [];
  const arr = [...array];
  let n = arr.length;
  let isSorted = false;

  // Step 0: Initial state
  steps.push({
    action: 'initial',
    array: [...arr],
    indices: [],
    sortedIndices: [],
    highlightedLine: 0,
    explanation: 'Algorithm started.',
    subExplanation: `Array initialized with ${n} elements. Preparing for Bubble Sort.`
  });

  const sortedSet = new Set();

  for (let i = 0; i < n; i++) {
    isSorted = true;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        action: 'compare',
        array: [...arr],
        indices: [j, j + 1],
        sortedIndices: Array.from(sortedSet),
        highlightedLine: 3,
        explanation: `Comparing indices ${j} and ${j + 1}.`,
        subExplanation: `Is ${arr[j]} greater than ${arr[j+1]}?`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        isSorted = false;

        steps.push({
          action: 'swap',
          array: [...arr], // after swap
          indices: [j, j + 1],
          sortedIndices: Array.from(sortedSet),
          highlightedLine: 4,
          explanation: `Swapping ${arr[j+1]} and ${arr[j]}.`,
          subExplanation: `${arr[j+1]} > ${arr[j]}, so they must be swapped to maintain ascending order.`
        });
      }
    }
    
    // Mark last element of this pass as sorted
    sortedSet.add(n - i - 1);
    steps.push({
      action: 'mark_sorted',
      array: [...arr],
      indices: [n - i - 1],
      sortedIndices: Array.from(sortedSet),
      highlightedLine: 6,
      explanation: `Index ${n - i - 1} is now in its final sorted position.`,
      subExplanation: `The largest unsorted element has bubbled up to its correct spot.`
    });

    if (isSorted) {
      break;
    }
  }

  // Mark all remaining unvisited elements
  for(let i = 0; i < n; i++) sortedSet.add(i);

  steps.push({
    action: 'complete',
    array: [...arr],
    indices: [],
    sortedIndices: Array.from(sortedSet),
    highlightedLine: 8,
    explanation: 'Algorithm complete.',
    subExplanation: 'The array is fully sorted.'
  });

  return steps;
}

export const bubbleSortCode = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
        # Element at n-i-1 is sorted
    return arr
# Complete`;
