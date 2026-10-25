import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  Globe 
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [model, setModel] = useState('gemini-1.5-flash');
  const [healthStatus, setHealthStatus] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('GEMINI_API_KEY') || '';
    setApiKey(key);
    testConnection();
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const testConnection = async () => {
    setTestingConnection(true);
    const health = await checkBackendHealth();
    setHealthStatus(health);
    setTestingConnection(false);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>System Settings & Multimodal Configuration</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure AI reasoning engines, API keys, hardware acceleration, and backend connectivity.
        </p>
      </div>

      {/* Gemini API Key Configuration Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
            Optional • Offline Engine Always Active
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Food Verse AI contains a built-in intelligent offline vision heuristic engine that runs 100% locally without any external credentials. If you wish to use Google Gemini Multimodal Vision API directly, enter your API key below.
        </p>

        <div className="space-y-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Stored safely in your browser's local sandbox storage</span>
            <button
              onClick={handleSaveKey}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Saved!</span>
                </>
              ) : (
                <span>Save API Key</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Model Architecture & Offline Fallback */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Dual-Engine AI Architecture</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Cloud Multimodal Model</span>
              <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Active</span>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Low Latency)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen Multimodal)</option>
            </select>
            <p className="text-[11px] text-slate-400">Used for deep vision reasoning when API key is provided.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Offline Heuristic Vision Engine</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Always Ready</span>
            </div>
            <div className="text-xs text-slate-300 font-mono">OpenCV / Pillow + Color Histogram & Entropy</div>
            <p className="text-[11px] text-slate-400">
              Guarantees 100% demo uptime and offline execution without cloud dependency.
            </p>
          </div>
        </div>
      </div>

      {/* Backend Connectivity Status & Diagnostics */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Backend Health Diagnostics</h3>
          </div>
          <button
            onClick={testConnection}
            disabled={testingConnection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>Ping Backend</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {healthStatus?.status === 'healthy' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <span className="font-bold text-white block">
                {healthStatus?.status === 'healthy' ? 'FastAPI Server Active' : 'Connecting to Backend...'}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Endpoint: http://localhost:8000/api</span>
            </div>
          </div>
          <span className="font-mono text-emerald-400 font-bold">Port 8000</span>
        </div>
      </div>

      {/* Hardware Requirements Verification */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">Platform Hardware Alignment</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">CPU Support</span>
            <span className="font-bold text-white">i5 / Ryzen 5+</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">System RAM</span>
            <span className="font-bold text-white">8GB - 16GB</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">Web Speech</span>
            <span className="font-bold text-emerald-400">Supported</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block">Webcam Media</span>
            <span className="font-bold text-emerald-400">Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
