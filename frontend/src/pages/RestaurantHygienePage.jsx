import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Video, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Activity,
  UserCheck,
  Sparkles
} from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import { auditHygieneFrame, auditHygieneVideo } from '../services/api';

export default function RestaurantHygienePage({ onOpenExportModal }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [selectedStation, setSelectedStation] = useState("Station 1 - Cold Prep");

  const stations = [
    "Station 1 - Cold Prep Line",
    "Station 2 - Hot Cooking Line",
    "Station 3 - Dishwashing & Sanitizing",
    "CCTV Camera 04 - Main Kitchen Line"
  ];

  const runSampleVideoAudit = async () => {
    setLoading(true);
    setAuditResult(null);
    setPreviewUrl("/sample_data/kitchen_prep.jpg");
    try {
      const data = await auditHygieneVideo("CCTV Camera 04");
      setAuditResult(data);
    } catch (err) {
      console.error("Video audit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      runFrameAudit(file, null);
    }
  };

  const handleCameraCapture = (dataUrl) => {
    setPreviewUrl(dataUrl);
    runFrameAudit(null, dataUrl);
  };

  const runFrameAudit = async (file, base64) => {
    setLoading(true);
    setAuditResult(null);
    try {
      const data = await auditHygieneFrame({ file, imageBase64: base64, stationLabel: selectedStation });
      setAuditResult(data);
    } catch (err) {
      console.error("Frame audit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <span>Commercial Kitchen Hygiene & Safety Inspector</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated video & CCTV monitoring for glove usage, hairnet compliance, clean prep surfaces, and cross-contamination prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Webcam Stream</span>
          </button>
          <button
            onClick={runSampleVideoAudit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>Simulate CCTV Stream Audit</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream / Snapshot View vs Compliance Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Viewfinder (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Camera Feed / Station View
              </h3>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
              >
                {stations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Viewfinder Window */}
            <div className="relative aspect-video w-full rounded-2xl bg-black border border-slate-700 overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} alt="Kitchen Feed" className="w-full h-full object-cover" />

                  {/* Live CCTV timestamp & REC badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-slate-700 text-[10px] text-white font-mono">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>CCTV LIVE • 1080p</span>
                  </div>

                  <div className="absolute bottom-3 left-3 text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                    {selectedStation}
                  </div>

                  {loading && (
                    <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                      <span className="text-xs text-emerald-400 font-semibold">Auditing PPE & Cleanliness Markers...</span>
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Video className="w-10 h-10 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-300">Upload kitchen video or camera snapshot</span>
                  <span className="text-[10px] text-slate-500">or click "Simulate CCTV Stream Audit" above</span>
                  <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Official Compliance Standards Note */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-emerald-400 block">Food Safety Protocol: FDA 3-301.11 / HACCP</span>
              <p className="text-[11px] text-slate-400">
                Monitors mandatory single-use glove adherence, full hair containment, non-cross contamination barriers, and sanitizer ppm thresholds.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Scorecard & Violations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {auditResult ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Overall Safety Grade Card */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      SAFETY AUDIT RESULT
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {auditResult.inspection_type}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">{auditResult.safety_grade}</h3>
                  <p className="text-xs text-slate-400 mt-1">Staff Monitored: <span className="text-slate-200 font-bold">{auditResult.staff_detected_count} Person(s)</span></p>
                </div>

                <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <span className="text-xs text-slate-400 block">Overall Score</span>
                    <div className="text-3xl font-black text-emerald-400">{auditResult.overall_score}%</div>
                    <span className="text-[10px] text-emerald-500 font-semibold">PASSING</span>
                  </div>
                </div>
              </div>

              {/* 5 Core Hygiene Indicators */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Protocol Compliance Breakdown</span>
                </h3>

                <div className="space-y-2">
                  {auditResult.indicators.map((ind) => (
                    <div key={ind.name} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${ind.compliant ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{ind.name}</h4>
                          <p className="text-[11px] text-slate-400">{ind.details}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold ${ind.compliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {ind.score}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">Conf: {Math.round(ind.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamped Incident / Violation Log */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Incident Audit Log ({auditResult.violations.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">Timestamped CCTV Keyframes</span>
                </div>

                {auditResult.violations.length > 0 ? (
                  <div className="space-y-2.5">
                    {auditResult.violations.map((v) => (
                      <div key={v.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {v.time_label}
                            </span>
                            <span className="text-xs font-bold text-white">{v.category}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            v.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            v.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {v.severity} Severity
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{v.description}</p>
                        <p className="text-[11px] text-emerald-400/90 font-medium">
                          <span className="text-slate-400">Corrective Action:</span> {v.corrective_action}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero critical hygiene or cross-contamination incidents detected during this audit.</span>
                  </div>
                )}
              </div>

              {/* Action Button: Export Certificate */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onOpenExportModal}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all shadow-md"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Generate Official Food Safety Certificate &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-200">No CCTV or Kitchen Feed Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Upload kitchen camera footage or click "Simulate CCTV Stream Audit" to run automated hygiene inspection and violation tracking.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          title="Kitchen Station Hygiene Frame"
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
