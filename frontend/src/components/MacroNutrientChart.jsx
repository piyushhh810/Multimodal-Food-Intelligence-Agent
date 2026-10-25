import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function MacroNutrientChart({ 
  calories = 420, 
  protein = 24, 
  carbs = 48, 
  fat = 14, 
  fiber = 6 
}) {
  const data = [
    { name: 'Protein', value: Math.max(1, protein), color: '#3b82f6', grams: `${protein}g` },
    { name: 'Carbs', value: Math.max(1, carbs), color: '#10b981', grams: `${carbs}g` },
    { name: 'Fats', value: Math.max(1, fat), color: '#f59e0b', grams: `${fat}g` },
    { name: 'Fiber', value: Math.max(0.5, fiber), color: '#8b5cf6', grams: `${fiber}g` },
  ];

  const totalGrams = protein + carbs + fat + fiber;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-200">Macronutrient Distribution</h4>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          {calories} kcal Total
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut Chart */}
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={44}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val, name) => [`${val}g`, name]}
                contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Breakdown */}
        <div className="flex-1 space-y-2">
          {data.map((item) => {
            const pct = totalGrams > 0 ? Math.round((item.value / totalGrams) * 100) : 0;
            return (
              <div key={item.name} className="space-y-0.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-200">{item.grams} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
