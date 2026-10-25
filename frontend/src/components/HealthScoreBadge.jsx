import React from 'react';
import { Award, ShieldCheck, Heart } from 'lucide-react';

export default function HealthScoreBadge({ score = 85, nutriScore = 'A', label = 'Nutritious & Balanced' }) {
  const grades = [
    { grade: 'A', bg: 'bg-emerald-600', activeBg: 'bg-emerald-500 ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-900', desc: 'Highest Quality' },
    { grade: 'B', bg: 'bg-teal-600', activeBg: 'bg-teal-500 ring-2 ring-teal-300 ring-offset-2 ring-offset-slate-900', desc: 'High Quality' },
    { grade: 'C', bg: 'bg-amber-600', activeBg: 'bg-amber-500 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900', desc: 'Moderate' },
    { grade: 'D', bg: 'bg-orange-600', activeBg: 'bg-orange-500 ring-2 ring-orange-300 ring-offset-2 ring-offset-slate-900', desc: 'Low' },
    { grade: 'E', bg: 'bg-rose-600', activeBg: 'bg-rose-500 ring-2 ring-rose-300 ring-offset-2 ring-offset-slate-900', desc: 'Treat with Caution' },
  ];

  const normalizedNutri = nutriScore.toUpperCase();

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-200">Health & Nutri-Score</h4>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          FSANZ Certified Scale
        </span>
      </div>

      {/* Main Score Dial Display */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
          <span className="text-sm font-medium text-slate-400 ml-1">/ 100</span>
          <p className="text-xs font-medium text-emerald-400 mt-0.5">{label}</p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              className="text-slate-800"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              className="text-emerald-400 transition-all duration-1000 ease-out"
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 22}
              strokeDashoffset={(2 * Math.PI * 22) * (1 - score / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <Heart className="w-5 h-5 text-emerald-400 absolute" />
        </div>
      </div>

      {/* Official Nutri-Score Horizontal Scale */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Nutri-Score Classification:
        </p>
        <div className="flex items-center rounded-xl p-1 bg-slate-950/60 border border-slate-800/80 gap-1">
          {grades.map((g) => {
            const isCurrent = g.grade === normalizedNutri;
            return (
              <div
                key={g.grade}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg text-xs font-black transition-all ${
                  isCurrent ? `${g.activeBg} text-white shadow-md scale-105 z-10` : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{g.grade}</span>
                {isCurrent && <span className="text-[8px] font-medium tracking-tight">ACTIVE</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
