import React from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  Activity, 
  Leaf, 
  ShieldAlert, 
  ChefHat, 
  CalendarCheck, 
  Settings,
  Flame,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
    { id: 'recognition', label: 'Food Recognition', icon: ScanLine },
    { id: 'nutrition', label: 'Nutrition Analysis', icon: Activity },
    { id: 'freshness', label: 'Freshness Detector', icon: Leaf, badge: 'AI' },
    { id: 'hygiene', label: 'Kitchen Hygiene', icon: ShieldAlert, badge: 'CCTV' },
    { id: 'cooking', label: 'Smart Cooking', icon: ChefHat, badge: 'Voice' },
    { id: 'mealplan', label: 'Personalized Plans', icon: CalendarCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-2">
            Intelligence Modules
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${
                        item.badge === 'Live' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        item.badge === 'AI' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        item.badge === 'Voice' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
                        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Safety Quick Widget */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/60 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Daily Calorie Target</span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-bold text-emerald-400">1,850</span>
            <span className="text-xs text-slate-400">/ 2,100 kcal</span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full" style={{ width: '88%' }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Macro balance: 130g Protein goal on track</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
        <span>FoodVerse AI Platform</span>
        <span className="text-emerald-500 font-mono">2026.10</span>
      </div>
    </aside>
  );
}
