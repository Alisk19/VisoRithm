// src/panels/InputManager.jsx
// Handles types: 'array', 'grid_size', 'search', 'knapsack', 'matrix', 'none'
import React, { useState } from 'react';

/* ── Shared styled input ── */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] uppercase font-bold tracking-widest text-secondary">{label}</label>
    {children}
  </div>
);

const TextInput = (props) => (
  <input
    {...props}
    className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-sm font-code text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 w-full"
  />
);

/* ── Knapsack item editor ── */
function KnapsackInput({ onSubmit, isPlaying }) {
  const [capacity, setCapacity] = useState(10);
  const [items, setItems] = useState([
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ]);

  const addItem = () => setItems(p => [...p, { weight: 1, value: 1 }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: Number(val) } : item));

  const handleSubmit = () => {
    if (items.length === 0) return alert('Add at least one item');
    onSubmit({ capacity, weights: items.map(i => i.weight), values: items.map(i => i.value) });
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="Knapsack Capacity">
        <TextInput type="number" min="1" max="50" value={capacity} disabled={isPlaying}
          onChange={e => setCapacity(Number(e.target.value))} />
      </Field>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] uppercase font-bold tracking-widest text-secondary">Items (Weight, Value)</span>
          <button onClick={addItem} disabled={isPlaying}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary/80 disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">add</span>Add Item
          </button>
        </div>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-secondary w-5 shrink-0">#{i + 1}</span>
              <TextInput type="number" min="1" placeholder="Weight" value={item.weight} disabled={isPlaying}
                onChange={e => updateItem(i, 'weight', e.target.value)} />
              <TextInput type="number" min="1" placeholder="Value" value={item.value} disabled={isPlaying}
                onChange={e => updateItem(i, 'value', e.target.value)} />
              <button onClick={() => removeItem(i)} disabled={isPlaying}
                className="text-error/60 hover:text-error shrink-0 disabled:opacity-40">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit} disabled={isPlaying}
        className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg text-sm shadow hover:brightness-110 disabled:opacity-50 flex items-center gap-2 justify-center">
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        Run Knapsack
      </button>
    </div>
  );
}

/* ── Subset Sum input ── */
function SubsetSumInput({ onSubmit, isPlaying }) {
  const [arrStr, setArrStr] = useState('3, 1, 4, 2, 2');
  const [target, setTarget] = useState(6);

  const handleSubmit = () => {
    try {
      const arr = arrStr.split(',').map(s => {
        const n = parseInt(s.trim(), 10);
        if (isNaN(n)) throw new Error(`"${s.trim()}" is not a number`);
        return n;
      });
      if (arr.length < 2) throw new Error('Enter at least 2 numbers');
      if (isNaN(target) || target < 1) throw new Error('Enter a valid target sum');
      onSubmit({ arr, target });
    } catch (err) { alert('Input error: ' + err.message); }
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="Array (comma separated)">
        <TextInput
          type="text" value={arrStr} disabled={isPlaying}
          onChange={e => setArrStr(e.target.value)}
          placeholder="e.g., 3, 1, 4, 2, 2"
        />
      </Field>
      <Field label="Target Sum">
        <TextInput
          type="number" min="1" value={target} disabled={isPlaying}
          onChange={e => setTarget(Number(e.target.value))}
          placeholder="e.g., 6"
        />
      </Field>
      <button onClick={handleSubmit} disabled={isPlaying}
        className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg text-sm shadow hover:brightness-110 disabled:opacity-50 flex items-center gap-2 justify-center">
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        Find Subset
      </button>
    </div>
  );
}

/* ── Matrix input (Warshall / Floyd) ── */
function MatrixInput({ onSubmit, isPlaying, isWeighted = false }) {
  const [size, setSize] = useState(4);
  const defMatrix = (n, weighted) =>
    Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        if (i === j) return weighted ? 0 : 0;
        // Default connectivity: sparse
        const connected = [[0,1],[0,3],[1,2],[2,3],[3,0]];
        const edge = connected.find(([a,b]) => a===i && b===j);
        if (!edge) return weighted ? 999 : 0; // 999 = infinity for Floyd
        return weighted ? Math.floor(Math.random()*9)+1 : 1;
      })
    );
  const [matrix, setMatrix] = useState(() => defMatrix(4, isWeighted));

  const changeSize = (n) => {
    const clamped = Math.max(2, Math.min(8, n));
    setSize(clamped);
    setMatrix(defMatrix(clamped, isWeighted));
  };

  const updateCell = (r, c, v) => {
    const val = v === '' ? 0 : Number(v);
    setMatrix(p => p.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? val : cell)));
  };

  const handleSubmit = () => onSubmit(matrix);

  const cellW = Math.min(54, Math.floor(360 / (size + 0.5)));

  return (
    <div className="flex flex-col gap-4">
      <Field label={`Matrix Size (${size}×${size})`}>
        <div className="flex items-center gap-3">
          <input type="range" min="2" max="8" value={size} disabled={isPlaying}
            onChange={e => changeSize(Number(e.target.value))} className="w-full accent-primary" />
          <span className="font-mono text-sm text-on-surface w-8 text-center">{size}</span>
        </div>
      </Field>
      <div>
        <span className="text-[9px] uppercase font-bold tracking-widest text-secondary block mb-2">
          {isWeighted ? 'Distance Matrix (999 = no direct path)' : 'Adjacency Matrix (1=edge, 0=no edge)'}
        </span>
        <div className="overflow-auto">
          <table className="border-separate" style={{ borderSpacing: '2px' }}>
            <thead>
              <tr>
                <td style={{ width: 20 }} />
                {Array.from({ length: size }, (_, c) => (
                  <th key={c} style={{ width: cellW, textAlign: 'center', fontSize: 9, color: '#7a6a5a', fontWeight: 700 }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  <td style={{ fontSize: 9, color: '#7a6a5a', fontWeight: 700, textAlign: 'right', paddingRight: 4 }}>{r}</td>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <input
                        type="number"
                        value={cell}
                        disabled={isPlaying || (r === c)}
                        onChange={e => updateCell(r, c, e.target.value)}
                        style={{
                          width: cellW, height: cellW,
                          textAlign: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
                          background: r === c ? '#141210' : '#1e1a16',
                          border: '1.5px solid #2a2420',
                          borderRadius: 4, color: '#c8b8a8',
                          outline: 'none',
                        }}
                        onFocus={e => e.target.style.borderColor = '#c2652a'}
                        onBlur={e => e.target.style.borderColor = '#2a2420'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={isPlaying}
        className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg text-sm shadow hover:brightness-110 disabled:opacity-50 flex items-center gap-2 justify-center">
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        Load Matrix & Run
      </button>
    </div>
  );
}

/* ── Main InputManager ── */
export function InputManager({ type, onSubmit, onRandom, isPlaying, play }) {
  const [inputValue, setInputValue] = useState('');
  const [targetValue, setTargetValue] = useState('');

  const handleArraySubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    try {
      const arr = inputValue.split(',').map(s => {
        const n = parseInt(s.trim(), 10);
        if (isNaN(n)) throw new Error(`"${s.trim()}" is not a valid number`);
        return n;
      });
      if (arr.length < 2) throw new Error('Enter at least 2 numbers');

      if (type === 'search') {
        const tgt = parseInt(targetValue.trim(), 10);
        if (isNaN(tgt)) throw new Error('Enter a valid target number');
        onSubmit({ array: arr, target: tgt });
      } else {
        onSubmit(arr);
      }
    } catch (err) { alert('Input error: ' + err.message); }
  };

  const handleGridSubmit = (e) => {
    e?.preventDefault();
    try {
      const n = parseInt(inputValue.trim(), 10);
      if (isNaN(n) || n < 4 || n > 12) throw new Error('Enter a size between 4 and 12');
      onSubmit(n);
    } catch (err) { alert('Input error: ' + err.message); }
  };

  /* — Knapsack — */
  if (type === 'knapsack') {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm mb-6">
        <KnapsackInput onSubmit={onSubmit} isPlaying={isPlaying} />
      </div>
    );
  }

  /* — Subset Sum — */
  if (type === 'subset-sum') {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm mb-6">
        <SubsetSumInput onSubmit={onSubmit} isPlaying={isPlaying} />
      </div>
    );
  }

  /* — Matrix (Warshall / Floyd) — */
  if (type === 'matrix') {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm mb-6">
        <MatrixInput onSubmit={onSubmit} isPlaying={isPlaying} isWeighted={false} />
      </div>
    );
  }
  if (type === 'weighted-matrix') {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm mb-6">
        <MatrixInput onSubmit={onSubmit} isPlaying={isPlaying} isWeighted={true} />
      </div>
    );
  }

  /* — None — */
  if (type === 'none') return null;

  /* — Array / Search / Grid size — */
  const isSearch = type === 'search';
  const isGrid = type === 'grid_size';

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm mb-6">
      <form onSubmit={isGrid ? handleGridSubmit : handleArraySubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Main input */}
          <Field label={isGrid ? 'Board Size (NxN)' : 'Input Array (comma separated)'}>
            <TextInput
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={isGrid ? 'e.g., 6' : 'e.g., 42, 16, 85, 34, 7'}
              disabled={isPlaying}
            />
          </Field>

          {/* Target value for search */}
          {isSearch && (
            <Field label="Target Value to Search">
              <TextInput
                type="number"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
                placeholder="e.g., 42"
                disabled={isPlaying}
              />
            </Field>
          )}

          {/* Buttons */}
          <div className="flex shrink-0 gap-2 mt-1">
            <button type="submit" disabled={isPlaying}
              className="px-5 py-2.5 bg-surface-container text-primary font-bold rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors text-sm disabled:opacity-50">
              Load
            </button>
            {onRandom && (
              <button type="button" onClick={() => { onRandom(); setInputValue(''); setTargetValue(''); }} disabled={isPlaying}
                className="px-5 py-2.5 bg-secondary-container text-on-secondary-container font-bold rounded-lg hover:bg-secondary hover:text-white transition-colors text-sm disabled:opacity-50">
                Random
              </button>
            )}
            {play && (
              <button type="button" onClick={play}
                className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow hover:brightness-110 active:scale-95 transition-all text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                START
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
