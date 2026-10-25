import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, BellRing, Plus, Minus } from 'lucide-react';

export default function InteractiveCookingTimer({ initialSeconds = 300, label = "Cooking Timer", autoStart = false }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setHasFinished(false);
  }, [initialSeconds]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setHasFinished(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Audio synthesis chime using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio chime not allowed without prior user interaction:", e);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const addTime = (secs) => {
    setTimeLeft((prev) => prev + secs);
    setHasFinished(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialSeconds);
    setHasFinished(false);
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      hasFinished 
        ? 'bg-rose-500/10 border-rose-500/40 glow-rose animate-pulse'
        : 'bg-slate-900/60 border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${hasFinished ? 'text-rose-400' : 'text-emerald-400'}`} />
          <span className="text-xs font-semibold text-slate-300">{label}</span>
        </div>
        {hasFinished && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
            <BellRing className="w-3.5 h-3.5 animate-bounce" /> Time's Up!
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Countdown Digits */}
        <div className="text-3xl font-mono font-extrabold text-white tracking-widest">
          {formattedTime}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addTime(60)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="+1 Minute"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-xl text-white font-semibold transition-all shadow-md ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
