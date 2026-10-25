import React from 'react';
import { Sparkles, Utensils, Mic, MicOff, Download, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  backendOnline, 
  isListening, 
  toggleVoiceAssistant,
  onOpenExportModal 
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/25">
            <Utensils className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                FoodVerse AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Multimodal Food Intelligence & Safety Platform</p>
          </div>
        </div>

        {/* Center / Right: Live Status & Controls */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">AI Engine:</span>
            <span className="font-medium text-emerald-400">Gemini + Vision Heuristics</span>
          </div>

          {/* Backend Health Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            {backendOnline ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium hidden sm:inline">API Online</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-amber-400 font-medium hidden sm:inline">Offline Mode</span>
              </>
            )}
          </div>

          {/* Hands-free Voice Assistant Button */}
          <button
            onClick={toggleVoiceAssistant}
            title={isListening ? "Voice Assistant Listening..." : "Click to Speak (Hands-free Voice Command)"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isListening
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 glow-rose animate-pulse"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
                <span className="hidden sm:inline">Listening...</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <div className="w-1 bg-rose-400 rounded-full sound-bar-1"></div>
                  <div className="w-1 bg-rose-400 rounded-full sound-bar-2"></div>
                  <div className="w-1 bg-rose-400 rounded-full sound-bar-3"></div>
                </div>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Voice Assistant</span>
              </>
            )}
          </button>

          {/* Export Report Action */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
