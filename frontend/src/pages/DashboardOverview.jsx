import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  Activity, 
  Leaf, 
  ShieldAlert, 
  ChefHat, 
  CalendarCheck, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Flame,
  ShieldCheck
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { fetchDashboardStats } from '../services/api';

export default function DashboardOverview({ setActiveTab, onOpenExportModal }) {
  const [stats, setStats] = useState({
    kpis: {
      total_food_scans: 1428,
      avg_health_score: 84,
      hygiene_compliance_pct: 93.4,
      active_spoilage_alerts: 2,
      recipes_guided: 312,
      weekly_meals_planned: 168
    },
    recent_activity: [],
    safety_alerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (e) {
        console.warn("Using fallback dashboard stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const quickActions = [
    { id: 'recognition', label: 'Scan Food Dish', desc: 'Identify dish & ingredients', icon: ScanLine, color: 'emerald' },
    { id: 'nutrition', label: 'Nutrition & Macros', desc: 'Health score & Nutri-Score', icon: Activity, color: 'cyan' },
    { id: 'freshness', label: 'Freshness Detector', desc: 'Surface decay & shelf life', icon: Leaf, color: 'amber' },
    { id: 'hygiene', label: 'Kitchen CCTV Audit', desc: 'PPE & cross-contamination', icon: ShieldAlert, color: 'rose' },
    { id: 'cooking', label: 'Smart Cooking Studio', desc: 'Hands-free voice assistant', icon: ChefHat, color: 'violet' },
    { id: 'mealplan', label: 'Adaptive Meal Planner', desc: '7-day plan & grocery list', icon: CalendarCheck, color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/60 border border-emerald-500/30 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unified Multimodal AI Food Intelligence Platform</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Holistic Food Safety, Nutrition & Real-Time Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminating fragmented food decision-making through computer vision, automated kitchen video monitoring, hands-free cooking guidance, and personalized nutritional reasoning.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('recognition')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Vision Scanner</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-sm font-medium text-slate-200 border border-slate-700 transition-all"
            >
              <span>Download Executive Audit Report</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Food Scans"
          value={stats.kpis.total_food_scans}
          subtext="Scanned dishes & produce"
          icon={ScanLine}
          trend="up"
          trendValue="+14% this week"
          color="emerald"
        />
        <MetricCard
          title="Avg Health Score"
          value={`${stats.kpis.avg_health_score}/100`}
          subtext="Nutri-Score Grade A/B"
          icon={Activity}
          trend="up"
          trendValue="+3.2 pts"
          color="cyan"
        />
        <MetricCard
          title="Hygiene Compliance"
          value={`${stats.kpis.hygiene_compliance_pct}%`}
          subtext="FDA/HACCP Grade A Pass"
          icon={ShieldCheck}
          trend="up"
          trendValue="98% Hairnet"
          color="emerald"
        />
        <MetricCard
          title="Active Alerts"
          value={stats.kpis.active_spoilage_alerts}
          subtext="Produce near expiry"
          icon={AlertTriangle}
          trend="down"
          trendValue="-2 resolved"
          color="amber"
        />
      </div>

      {/* Quick Launch Operations */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Core Capabilities & Workflows</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <div
                key={qa.id}
                onClick={() => setActiveTab(qa.id)}
                className="glass-card p-5 rounded-2xl border border-slate-800/80 glass-card-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-500 group-hover:text-emerald-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {qa.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{qa.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Stream & Real-Time Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Live Activity Stream</h3>
            <span className="text-xs text-slate-400">Automated AI Logging</span>
          </div>

          <div className="space-y-3">
            {(stats.recent_activity.length > 0 ? stats.recent_activity : [
              { id: '1', time: 'Just now', type: 'RECOGNITION', title: 'Mediterranean Salad Bowl Analyzed', status: 'Nutri-Score A (Score: 92/100)' },
              { id: '2', time: '12 mins ago', type: 'HYGIENE', title: 'CCTV Stream Station 1 Keyframe Audit', status: 'Grade A (93%) Glove/Hairnet Compliant' },
              { id: '3', time: '35 mins ago', type: 'FRESHNESS', title: 'Produce Specimen Freshness Inspection', status: 'Stage: Fresh (Score: 96%)' },
              { id: '4', time: '1 hour ago', type: 'COOKING', title: 'Voice Guided Quinoa Bowl Completed', status: '4 steps completed with timers' },
            ]).map((act) => (
              <div key={act.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:bg-slate-900/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{act.title}</h4>
                    <p className="text-[11px] text-emerald-400/90">{act.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Advisory Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Safety Advisories</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <span className="text-xs font-bold text-amber-300">Produce Shelf-Life Notice</span>
              <p className="text-xs text-slate-300">
                2 produce inventory items are estimated to enter moderate oxidation within 24 hours. Prioritize in upcoming dinner menu.
              </p>
              <button 
                onClick={() => setActiveTab('mealplan')} 
                className="text-[11px] font-semibold text-amber-400 hover:underline pt-1 block"
              >
                Incorporate in Meal Plan &rarr;
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <span className="text-xs font-bold text-emerald-300">Kitchen Sanitization Rating</span>
              <p className="text-xs text-slate-300">
                Temporal video monitoring records 93.4% compliance with FDA Food Code surface & PPE requirements.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">FoodVerse AI Multimodal Core • 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
