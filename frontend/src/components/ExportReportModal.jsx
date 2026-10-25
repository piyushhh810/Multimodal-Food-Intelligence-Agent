import React from 'react';
import { X, Printer, Download, CheckCircle, Shield, Award, Leaf } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 p-6 lg:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AUDIT REPORT
              </span>
              <span className="text-xs text-slate-400 font-mono">FV-AUDIT-2026-X89</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Executive Food Intelligence & Safety Report</h2>
            <p className="text-xs text-slate-400">Generated on October 25, 2026 • FoodVerse AI Core System</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Executive Summary</h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            Multimodal AI audit completed across visual food recognition, nutrient profiling, surface freshness degradation, and kitchen hygiene compliance. The evaluated facilities and food preparations demonstrate an overall safety rating of <span className="font-bold text-emerald-400">93.4% (Grade A - Pass)</span> with peak nutritional density.
          </p>
        </div>

        {/* 3 Pillars Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Hygiene */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-semibold">Hygiene Audit</span>
            </div>
            <div className="text-2xl font-bold text-white">93.4%</div>
            <p className="text-xs text-emerald-400 font-medium">Grade A Optimal Pass</p>
            <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
              <li>• Glove Compliance: 91%</li>
              <li>• Hairnet Protocol: 98%</li>
              <li>• Cross-Contam: Clear</li>
            </ul>
          </div>

          {/* Nutrition */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold">Nutritional Index</span>
            </div>
            <div className="text-2xl font-bold text-white">84 / 100</div>
            <p className="text-xs text-emerald-400 font-medium">Nutri-Score Grade A/B</p>
            <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
              <li>• Calorie Target: On Track</li>
              <li>• Protein Density: High</li>
              <li>• Low Simple Sugars</li>
            </ul>
          </div>

          {/* Freshness */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Leaf className="w-4 h-4" />
              <span className="text-xs font-semibold">Freshness Status</span>
            </div>
            <div className="text-2xl font-bold text-white">88.5%</div>
            <p className="text-xs text-emerald-400 font-medium">Active Inventory Fresh</p>
            <ul className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
              <li>• Spoilage Alerts: 2 Flagged</li>
              <li>• Waste Reduction: 18.2%</li>
              <li>• Storage Temp: 2-4°C</li>
            </ul>
          </div>
        </div>

        {/* Corrective Actions */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Compliance Directives</h4>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Maintain automated 30-minute glove exchange notification for food handlers during rush periods.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Prioritize 2 moderately fresh produce batches in upcoming soup/smoothie meal schedules to minimize wastage.</span>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">FoodVerse AI Verified Inspector Signature: #88029-AGY</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
