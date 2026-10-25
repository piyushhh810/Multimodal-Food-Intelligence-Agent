import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, value, subtext, icon: Icon, trend, trendValue, color = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bgIcon: 'bg-emerald-500/10 text-emerald-400',
      accent: 'text-emerald-400'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      bgIcon: 'bg-amber-500/10 text-amber-400',
      accent: 'text-amber-400'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      bgIcon: 'bg-cyan-500/10 text-cyan-400',
      accent: 'text-cyan-400'
    },
    violet: {
      border: 'border-violet-500/20 hover:border-violet-500/40',
      bgIcon: 'bg-violet-500/10 text-violet-400',
      accent: 'text-violet-400'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      bgIcon: 'bg-rose-500/10 text-rose-400',
      accent: 'text-rose-400'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`glass-card p-5 rounded-2xl border ${scheme.border} glass-card-hover`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${scheme.bgIcon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`inline-flex items-center text-xs font-semibold ${
            trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trendValue}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400">{subtext}</p>
    </div>
  );
}
