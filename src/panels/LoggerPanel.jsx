import React, { useRef, useEffect } from 'react';

export function LoggerPanel({ logs }) {
  const scrollRef = useRef(null);

  // Auto-scroll to the bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-surface-container-high rounded-xl border border-outline-variant p-4 h-48 flex flex-col mt-6 shadow-inner">
      <div className="flex items-center gap-2 mb-3 text-secondary tracking-widest text-[10px] uppercase font-bold border-b border-outline-variant/30 pb-2">
        <span className="material-symbols-outlined text-[14px]">history</span>
        Logic Stream
      </div>
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto pr-2 space-y-2 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="text-stone-400 italic">Awaiting execution...</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index}
              className={`px-3 py-2 rounded border-l-2 ${
                index === logs.length - 1 
                  ? 'bg-primary/10 border-primary text-on-surface font-semibold translate-x-1 transition-transform' 
                  : 'border-outline-variant/50 text-secondary'
              }`}
            >
              <span className="opacity-50 mr-2">[{index + 1}]</span>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
