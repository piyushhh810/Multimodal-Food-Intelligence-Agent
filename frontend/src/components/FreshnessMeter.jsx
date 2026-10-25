import React from 'react';
import { Leaf, Clock, AlertTriangle, ShieldCheck, Thermometer, Wind } from 'lucide-react';

export default function FreshnessMeter({ 
  freshnessScore = 92, 
  stage = 'Fresh', 
  shelfLifeDays = 5,
  safetyStatus = 'Safe to Consume',
  optimalTemp = '2-4°C, high humidity drawer',
  discolorationIndex = 12,
  textureDegradation = 8
}) {
  const getStageColor = () => {
    if (stage === 'Fresh') return {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
      bar: 'bg-emerald-500'
    };
    if (stage === 'Moderately Fresh') return {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
      bar: 'bg-amber-500'
    };
    return {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      text: 'text-rose-400',
      bar: 'bg-rose-500'
    };
  };

  const scheme = getStageColor();

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-200">Freshness & Spoilage Index</h4>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${scheme.badge}`}>
          {stage}
        </span>
      </div>

      {/* Main Score Bar */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-2xl font-bold text-white">{freshnessScore}%</span>
          <span className={`text-xs font-medium ${scheme.text}`}>{safetyStatus}</span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${scheme.bar}`}
            style={{ width: `${Math.max(5, Math.min(100, freshnessScore))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>0% Spoiled</span>
          <span>50% Moderate</span>
          <span>100% Peak Fresh</span>
        </div>
      </div>

      {/* Shelf Life & Storage Specs */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Est. Shelf Life</span>
          </div>
          <span className="text-lg font-bold text-white">{shelfLifeDays} Days</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Remaining safe window</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Optimal Climate</span>
          </div>
          <span className="text-xs font-semibold text-slate-200 line-clamp-1">{optimalTemp}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Refrigerated preservation</p>
        </div>
      </div>

      {/* Discoloration & Texture metrics */}
      <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div>
          <span>Discoloration: </span>
          <span className="font-semibold text-slate-200">{discolorationIndex}%</span>
        </div>
        <div>
          <span>Texture Decay: </span>
          <span className="font-semibold text-slate-200">{textureDegradation}%</span>
        </div>
      </div>
    </div>
  );
}
