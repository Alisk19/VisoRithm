import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export function ControlPanel({
  isPlaying,
  play, onPlay,
  pause, onPause,
  next, onNext,
  prev, onPrev,
  reset, onReset,
  speed, setSpeed, onSpeedChange,
}) {
  const _play  = play  || onPlay  || (() => {});
  const _pause = pause || onPause || (() => {});
  const _next  = next  || onNext  || (() => {});
  const _prev  = prev  || onPrev  || (() => {});
  const _reset = reset || onReset || (() => {});
  const _setSpeed = setSpeed || onSpeedChange || (() => {});

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-black/70 backdrop-blur-xl border border-white/10 p-2.5 rounded-full shadow-glow-lg flex items-center justify-between gap-6 transition-all hover:bg-black/80 hover:border-white/20">

      {/* Playback Controls */}
      <div className="flex items-center gap-1.5 pl-2">
        <button 
          onClick={_reset} 
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90" 
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
        <button 
          onClick={_prev} 
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90" 
          title="Previous Step"
        >
          <SkipBack size={18} />
        </button>
        
        <button
          onClick={isPlaying ? _pause : _play}
          className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full transition-all active:scale-90 shadow-glow mx-1 group"
        >
          {isPlaying ? (
            <Pause size={22} className="group-hover:scale-110 transition-transform" />
          ) : (
            <Play size={22} className="ml-1 group-hover:scale-110 transition-transform" />
          )}
        </button>
        
        <button 
          onClick={_next} 
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90" 
          title="Next Step"
        >
          <SkipForward size={18} />
        </button>
      </div>

      <div className="w-px h-8 bg-white/10"></div>

      {/* Speed Slider */}
      <div className="flex items-center gap-3 pr-4 w-48">
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Slow</span>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={1050 - (speed || 500)}
          onChange={(e) => _setSpeed(1050 - Number(e.target.value))}
          className="w-full appearance-none h-1.5 bg-white/10 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary hover:[&::-webkit-slider-thumb]:scale-125 transition-all cursor-pointer"
        />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Fast</span>
      </div>

    </div>
  );
}
