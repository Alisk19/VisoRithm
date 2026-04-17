export function generateLinearSearchSteps(array, target) {
  const steps = [];
  const n = array.length;

  steps.push({
    action: 'initial',
    array: [...array],
    indices: [],
    sortedIndices: [],
    inactiveIndices: [],
    pointers: [],
    highlightedLine: 0,
    explanation: 'Algorithm started.',
    subExplanation: `Looking for target value: ${target} sequentially.`
  });

  let found = false;

  for (let i = 0; i < n; i++) {
    steps.push({
      action: 'compare',
      array: [...array],
      indices: [i],
      sortedIndices: [],
      inactiveIndices: [],
      pointers: [{ index: i, label: 'i', color: 'bg-primary/20 text-primary' }],
      highlightedLine: 2,
      explanation: `Checking index ${i}.`,
      subExplanation: `Does array[${i}] (${array[i]}) equal the target (${target})?`
    });

    if (array[i] === target) {
      steps.push({
        action: 'complete',
        array: [...array],
        indices: [i],
        sortedIndices: [i], // Repurpose sortedIndices for 'found'
        inactiveIndices: [],
        pointers: [{ index: i, label: 'Found!', color: 'bg-success/20 text-success' }],
        highlightedLine: 3,
        explanation: `Target found at index ${i}!`,
        subExplanation: `The value ${target} was located.`
      });
      found = true;
      break;
    }
  }

  if (!found) {
    steps.push({
      action: 'complete',
      array: [...array],
      indices: [],
      sortedIndices: [],
      inactiveIndices: [],
      pointers: [],
      highlightedLine: 4,
      explanation: `Target not found.`,
      subExplanation: `Exhausted all elements in the array.`
    });
  }

  return steps;
}

export function generateBinarySearchSteps(array, target) {
  const steps = [];
  // Binary search requires sorted array for visualization to make sense!
  const sortedArray = [...array].sort((a,b) => a - b);
  const n = sortedArray.length;

  let left = 0;
  let right = n - 1;

  const getInactive = (l, r) => {
     let temp = [];
     for (let i = 0; i < n; i++) if (i < l || i > r) temp.push(i);
     return temp;
  };

  steps.push({
    action: 'initial',
    array: sortedArray,
    indices: [],
    sortedIndices: [],
    inactiveIndices: [],
    pointers: [],
    highlightedLine: 0,
    explanation: 'Algorithm started.',
    subExplanation: `Array has been sorted. Looking for target value: ${target}`
  });

  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const inactive = getInactive(left, right);

    steps.push({
      action: 'compare',
      array: sortedArray,
      indices: [mid],
      sortedIndices: [],
      inactiveIndices: inactive,
      pointers: [
        { index: left, label: 'L', color: 'bg-primary/20 text-primary' },
        { index: mid, label: 'M', color: 'bg-tertiary/20 text-tertiary' },
        { index: right, label: 'R', color: 'bg-primary/20 text-primary' }
      ],
      highlightedLine: 3,
      explanation: `Calculating Midpoint.`,
      subExplanation: `Mid = floor((${left} + ${right})/2) = ${mid}. Checking if array[${mid}] (${sortedArray[mid]}) is ${target}.`
    });

    if (sortedArray[mid] === target) {
      steps.push({
        action: 'complete',
        array: sortedArray,
        indices: [mid],
        sortedIndices: [mid],
        inactiveIndices: inactive,
        pointers: [
          { index: mid, label: 'Found!', color: 'bg-success/20 text-success' }
        ],
        highlightedLine: 5,
        explanation: `Target found!`,
        subExplanation: `The value ${target} was located at index ${mid}.`
      });
      found = true;
      break;
    }

    if (sortedArray[mid] < target) {
      steps.push({
        action: 'move',
        array: sortedArray,
        indices: [],
        sortedIndices: [],
        inactiveIndices: inactive,
        pointers: [
          { index: left, label: 'L' },
          { index: mid, label: 'M' },
          { index: right, label: 'R' }
        ],
        highlightedLine: 7,
        explanation: `Value ${sortedArray[mid]} is LESS than ${target}.`,
        subExplanation: `Target must be in the right half. Shifting Left pointer to Mid + 1 (${mid + 1}).`
      });
      left = mid + 1;
    } else {
      steps.push({
        action: 'move',
        array: sortedArray,
        indices: [],
        sortedIndices: [],
        inactiveIndices: inactive,
        pointers: [
          { index: left, label: 'L' },
          { index: mid, label: 'M' },
          { index: right, label: 'R' }
        ],
        highlightedLine: 9,
        explanation: `Value ${sortedArray[mid]} is GREATER than ${target}.`,
        subExplanation: `Target must be in the left half. Shifting Right pointer to Mid - 1 (${mid - 1}).`
      });
      right = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      action: 'complete',
      array: sortedArray,
      indices: [],
      sortedIndices: [],
      inactiveIndices: getInactive(left, right), // everything is basically inactive
      pointers: [],
      highlightedLine: 11,
      explanation: `Search exhausted.`,
      subExplanation: `Left pointer crossed Right pointer. Target is not in the array.`
    });
  }

  return steps;
}

export const linearSearchCode = {
  python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
  cpp: `int linear_search(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`
};

export const binarySearchCode = {
  python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  cpp: `int binary_search(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
};
