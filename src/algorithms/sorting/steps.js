// src/algorithms/sorting/steps.js
// Selection Sort, Insertion Sort, Merge Sort, Quick Sort

// ── helpers ───────────────────────────────────────────────────────────────
const mkStep = (overrides) => ({
  action: 'idle', explanation: '', subExplanation: '', highlightedLine: -1,
  array: [], indices: [], sortedIndices: [], pointers: [], inactiveIndices: [],
  board: null, treeState: { nodes: [], edges: [] }, logs: [], matrixState: null, graphState: null,
  ...overrides,
});

// ── SELECTION SORT ──────────────────────────────────────────────────────────
export function generateSelectionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const sorted = [];

  steps.push(mkStep({ array: [...a], explanation: 'Starting Selection Sort.', subExplanation: `Find minimum in unsorted part and swap it to the front. Repeat n-1 times.`, highlightedLine: 1 }));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(mkStep({ action: 'scan', array: [...a], indices: [i], sortedIndices: [...sorted], explanation: `Pass ${i + 1}: Scanning unsorted portion [${i}..${n - 1}] for minimum.`, subExplanation: `Current candidate: ${a[minIdx]} at index ${i}.`, highlightedLine: 3 }));

    for (let j = i + 1; j < n; j++) {
      steps.push(mkStep({ action: 'compare', array: [...a], indices: [j, minIdx], sortedIndices: [...sorted], explanation: `Comparing ${a[j]} with current min ${a[minIdx]}.`, subExplanation: a[j] < a[minIdx] ? `${a[j]} < ${a[minIdx]} — new minimum found!` : `${a[j]} ≥ ${a[minIdx]} — keep current min.`, highlightedLine: 4 }));
      if (a[j] < a[minIdx]) { minIdx = j; }
    }

    if (minIdx !== i) {
      steps.push(mkStep({ action: 'swap', array: [...a], indices: [i, minIdx], sortedIndices: [...sorted], explanation: `Swapping ${a[i]} ↔ ${a[minIdx]} (positions ${i} and ${minIdx}).`, subExplanation: `Minimum ${a[minIdx]} moves to position ${i}.`, highlightedLine: 7 }));
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push(mkStep({ action: 'swap-done', array: [...a], indices: [i], sortedIndices: [...sorted], explanation: `Swapped. Position ${i} now holds ${a[i]}.`, subExplanation: '', highlightedLine: 7 }));
    } else {
      steps.push(mkStep({ action: 'no-swap', array: [...a], indices: [i], sortedIndices: [...sorted], explanation: `${a[i]} is already the minimum — no swap needed.`, subExplanation: '', highlightedLine: 7 }));
    }

    sorted.push(i);
    steps.push(mkStep({ action: 'sorted', array: [...a], indices: [], sortedIndices: [...sorted], explanation: `Position ${i} finalized with value ${a[i]}.`, subExplanation: 'Sorted portion grows by one.', highlightedLine: 9 }));
  }

  sorted.push(n - 1);
  steps.push(mkStep({ action: 'final', array: [...a], indices: [], sortedIndices: [...sorted], explanation: 'Array fully sorted!', subExplanation: `Selection Sort complete. ${n - 1} passes performed.`, highlightedLine: 10 }));
  return steps;
}

export const selectionSortCode = {
  python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):          # 1
        min_idx = i                  # 2 — assume first is min
        for j in range(i+1, n):     # 3
            if arr[j] < arr[min_idx]:# 4
                min_idx = j          # 5
        arr[i], arr[min_idx] = \\    # 6 — place min
            arr[min_idx], arr[i]     # 7
    return arr                       # 8`,
  cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {     // 1
        int min_idx = i;                 // 2
        for (int j = i+1; j < n; j++) { // 3
            if (arr[j] < arr[min_idx])   // 4
                min_idx = j;             // 5
        }
        swap(arr[i], arr[min_idx]);      // 6
    }
}`,
};

// ── INSERTION SORT ──────────────────────────────────────────────────────────
export function generateInsertionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  let sorted = [0];

  steps.push(mkStep({ array: [...a], sortedIndices: [...sorted], explanation: 'Starting Insertion Sort.', subExplanation: `Element at index 0 (${a[0]}) is trivially sorted.`, highlightedLine: 1 }));

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push(mkStep({ action: 'pick', array: [...a], indices: [i], sortedIndices: [...sorted], explanation: `Key = ${key} (index ${i}). Insert into sorted left portion.`, subExplanation: `Sorted so far: [${a.slice(0, i).join(', ')}].`, highlightedLine: 2 }));

    while (j >= 0 && a[j] > key) {
      steps.push(mkStep({ action: 'shift', array: [...a], indices: [j, j + 1], sortedIndices: [...sorted], explanation: `${a[j]} > ${key} — shift ${a[j]} right to index ${j + 1}.`, subExplanation: 'Making room for the key.', highlightedLine: 4 }));
      a[j + 1] = a[j];
      steps.push(mkStep({ action: 'shifted', array: [...a], indices: [j + 1], sortedIndices: [...sorted], explanation: `Shifted. Gap now at index ${j}.`, subExplanation: '', highlightedLine: 4 }));
      j--;
    }

    a[j + 1] = key;
    sorted = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push(mkStep({ action: 'insert', array: [...a], indices: [j + 1], sortedIndices: [...sorted], explanation: `Inserting key ${key} at index ${j + 1}.`, subExplanation: `Sorted portion: [${a.slice(0, i + 1).join(', ')}].`, highlightedLine: 6 }));
  }

  steps.push(mkStep({ action: 'final', array: [...a], indices: [], sortedIndices: Array.from({ length: n }, (_, k) => k), explanation: 'Array fully sorted!', subExplanation: 'Insertion Sort complete.', highlightedLine: 8 }));
  return steps;
}

export const insertionSortCode = {
  python: `def insertion_sort(arr):
    for i in range(1, len(arr)):    # 1
        key = arr[i]                # 2 — element to insert
        j = i - 1                  # 3
        while j >= 0 and arr[j] > key: # 4
            arr[j+1] = arr[j]      # 5 — shift right
            j -= 1                 # 6
        arr[j+1] = key             # 7 — insert
    return arr`,
  cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {   // 1
        int key = arr[i];            // 2
        int j = i - 1;              // 3
        while (j >= 0 && arr[j] > key) { // 4
            arr[j+1] = arr[j];      // 5
            j--;                    // 6
        }
        arr[j+1] = key;             // 7
    }
}`,
};

// ── MERGE SORT (iterative bottom-up) ───────────────────────────────────────
export function generateMergeSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const fullyS = new Set();

  steps.push(mkStep({ array: [...a], explanation: 'Starting Merge Sort.', subExplanation: 'Bottom-up: merge pairs of width 1, then 2, then 4...', highlightedLine: 1 }));

  for (let width = 1; width < n; width *= 2) {
    for (let left = 0; left < n; left += 2 * width) {
      const mid = Math.min(left + width - 1, n - 1);
      const right = Math.min(left + 2 * width - 1, n - 1);
      if (mid >= right) continue;

      const span = Array.from({ length: right - left + 1 }, (_, k) => left + k);
      steps.push(mkStep({ action: 'merge-start', array: [...a], indices: span, sortedIndices: [...fullyS], explanation: `Merging [${left}..${mid}] with [${mid + 1}..${right}].`, subExplanation: `Left: [${a.slice(left, mid + 1).join(',')}] Right: [${a.slice(mid + 1, right + 1).join(',')}]`, highlightedLine: 3 }));

      const L = a.slice(left, mid + 1);
      const R = a.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      while (i < L.length && j < R.length) {
        steps.push(mkStep({ action: 'compare', array: [...a], indices: [left + i, mid + 1 + j], sortedIndices: [...fullyS], explanation: `Comparing ${L[i]} and ${R[j]}.`, subExplanation: `Picking smaller: ${Math.min(L[i], R[j])}.`, highlightedLine: 6 }));
        a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
        steps.push(mkStep({ action: 'place', array: [...a], indices: [k - 1], sortedIndices: [...fullyS], explanation: `Placed ${a[k - 1]} at index ${k - 1}.`, subExplanation: '', highlightedLine: 7 }));
      }
      while (i < L.length) a[k++] = L[i++];
      while (j < R.length) a[k++] = R[j++];

      if (width * 2 >= n) span.forEach(x => fullyS.add(x));
      steps.push(mkStep({ action: 'merged', array: [...a], indices: span, sortedIndices: [...fullyS], explanation: `Merged segment [${left}..${right}] = [${a.slice(left, right + 1).join(',')}].`, subExplanation: '', highlightedLine: 8 }));
    }
  }

  steps.push(mkStep({ action: 'final', array: [...a], sortedIndices: Array.from({ length: n }, (_, k) => k), explanation: 'Array fully sorted!', subExplanation: 'Merge Sort complete.', highlightedLine: 10 }));
  return steps;
}

export const mergeSortCode = {
  python: `def merge_sort(arr):          # 1
    if len(arr) <= 1: return arr # 2
    mid = len(arr) // 2          # 3
    L = merge_sort(arr[:mid])    # 4
    R = merge_sort(arr[mid:])    # 5
    return merge(L, R)           # 6

def merge(L, R):                 # 7
    res, i, j = [], 0, 0         # 8
    while i<len(L) and j<len(R): # 9
        if L[i]<=R[j]: res.append(L[i]); i+=1
        else:           res.append(R[j]); j+=1
    res+=L[i:]; res+=R[j:]
    return res`,
  cpp: `void merge(int a[],int l,int m,int r){
    int L[m-l+1], R[r-m];
    for(int i=0;i<m-l+1;i++) L[i]=a[l+i];
    for(int j=0;j<r-m;  j++) R[j]=a[m+1+j];
    int i=0,j=0,k=l;
    while(i<m-l+1&&j<r-m)
        a[k++]=(L[i]<=R[j])?L[i++]:R[j++];
    while(i<m-l+1) a[k++]=L[i++];
    while(j<r-m)   a[k++]=R[j++];
}
void mergeSort(int a[],int l,int r){
    if(l<r){ int m=l+(r-l)/2;
        mergeSort(a,l,m); mergeSort(a,m+1,r);
        merge(a,l,m,r); }
}`,
};

// ── QUICK SORT ──────────────────────────────────────────────────────────────
export function generateQuickSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = new Set();

  const addStep = (action, idxs, pivotIdx, explanation, sub, line) => {
    steps.push(mkStep({
      action, array: [...a], indices: idxs, sortedIndices: [...sorted],
      pointers: pivotIdx !== null ? [{ index: pivotIdx, label: 'P', color: 'bg-amber-400/20 text-amber-700 border-amber-500' }] : [],
      explanation, subExplanation: sub, highlightedLine: line,
    }));
  };

  function partition(low, high) {
    const pivot = a[high];
    let i = low - 1;
    addStep('pivot', [high], high, `Pivot = ${pivot} at index ${high}.`, `Partitioning range [${low}..${high}].`, 3);

    for (let j = low; j < high; j++) {
      addStep('compare', [j, high], high, `Comparing ${a[j]} with pivot ${pivot}.`, a[j] <= pivot ? `${a[j]} ≤ ${pivot} → move left side.` : `${a[j]} > ${pivot} → stays right.`, 5);
      if (a[j] <= pivot) {
        i++;
        if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; addStep('swap', [i, j], high, `Swapping ${a[j]} ↔ ${a[i]}.`, `i = ${i}.`, 6); }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    sorted.add(i + 1);
    addStep('pivot-placed', [i + 1], i + 1, `Pivot ${a[i + 1]} placed at final position ${i + 1}.`, 'All left < pivot, all right > pivot.', 8);
    return i + 1;
  }

  addStep('idle', [], null, 'Starting Quick Sort.', 'Using Lomuto partition scheme (last element as pivot).', 1);
  const stack = [[0, a.length - 1]];

  while (stack.length) {
    const [low, high] = stack.pop();
    if (low >= high) { if (low === high) sorted.add(low); continue; }
    const pi = partition(low, high);
    if (pi - 1 > low) stack.push([low, pi - 1]); else if (pi - 1 === low) sorted.add(low);
    if (pi + 1 < high) stack.push([pi + 1, high]); else if (pi + 1 === high) sorted.add(high);
  }

  steps.push(mkStep({ action: 'final', array: [...a], sortedIndices: Array.from({ length: a.length }, (_, k) => k), explanation: 'Array fully sorted!', subExplanation: 'Quick Sort complete.', highlightedLine: 12 }));
  return steps;
}

export const quickSortCode = {
  python: `def quick_sort(arr, lo, hi):    # 1
    if lo < hi:                     # 2
        pi = partition(arr,lo,hi)   # 3
        quick_sort(arr,lo,pi-1)     # 4
        quick_sort(arr,pi+1,hi)     # 5

def partition(arr, lo, hi):         # 6
    pivot = arr[hi]                 # 7
    i = lo - 1                     # 8
    for j in range(lo, hi):        # 9
        if arr[j] <= pivot:         # 10
            i += 1
            arr[i],arr[j]=arr[j],arr[i]
    arr[i+1],arr[hi]=arr[hi],arr[i+1]
    return i+1`,
  cpp: `int partition(int a[],int lo,int hi){
    int pivot=a[hi], i=lo-1;
    for(int j=lo;j<hi;j++)
        if(a[j]<=pivot){i++;swap(a[i],a[j]);}
    swap(a[i+1],a[hi]); return i+1;
}
void quickSort(int a[],int lo,int hi){
    if(lo<hi){
        int pi=partition(a,lo,hi);
        quickSort(a,lo,pi-1);
        quickSort(a,pi+1,hi);
    }
}`,
};
