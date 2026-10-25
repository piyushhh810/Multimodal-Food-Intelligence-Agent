import React, { useState } from 'react';
import { 
  Leaf, 
  Upload, 
  Camera, 
  Thermometer, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  FileText
} from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import FreshnessMeter from '../components/FreshnessMeter';
import { inspectFreshness } from '../services/api';

export default function FreshnessDetectionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [freshnessResult, setFreshnessResult] = useState(null);

  const sampleItems = [
    { label: "Fresh Apple Specimen", file: "/sample_data/fresh_apple.jpg", hint: "fresh apple fruit" },
    { label: "Decaying / Spoiled Banana", file: "/sample_data/decaying_banana.jpg", hint: "spoiled decaying fruit" }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      analyzeFreshness(file, null, "produce");
    }
  };

  const handleCameraCapture = (dataUrl) => {
    setPreviewUrl(dataUrl);
    analyzeFreshness(null, dataUrl, "produce");
  };

  const handleSelectSample = async (sample) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000${sample.file}`);
      const blob = await res.blob();
      const file = new File([blob], `${sample.label}.jpg`, { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      await analyzeFreshness(file, null, sample.hint);
    } catch (e) {
      console.warn("Using sample hint direct call:", e);
      await analyzeFreshness(null, null, sample.hint);
    }
  };

  const analyzeFreshness = async (file, base64, hint) => {
    setLoading(true);
    setFreshnessResult(null);
    try {
      const data = await inspectFreshness({ file, imageBase64: base64, itemHint: hint });
      setFreshnessResult(data);
    } catch (err) {
      console.error("Freshness inspection failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <span>Food Freshness & Spoilage Detection</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Detect surface discoloration, fungal mold signatures, texture degradation, and predict remaining shelf-life.
          </p>
        </div>

        <button
          onClick={() => setShowCamera(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>Scan Live Produce</span>
        </button>
      </div>

      {/* Main Grid: Upload & Viewfinder vs Spoilage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Specimen (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Produce Specimen Photo
            </h3>

            {/* Upload Box */}
            <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 overflow-hidden flex flex-col items-center justify-center transition-all group">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} alt="Freshness Specimen" className="w-full h-full object-cover" />

                  {/* Visual Decay Overlays if mold/spot detected */}
                  {freshnessResult && freshnessResult.metrics.spot_mold_detected && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-rose-950/90 text-rose-300 border border-rose-500/50 text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Decay / Necrotic Spot Detected</span>
                    </div>
                  )}

                  {loading && (
                    <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold text-emerald-400 animate-pulse">
                        Scanning Color Histogram & Surface Texture...
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">Upload fruit, veggie or meat photo</span>
                    <span className="text-xs text-slate-400">Computer vision will grade decay index</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Quick 1-Click Samples */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Test pre-loaded specimens:</span>
              <div className="grid grid-cols-2 gap-2">
                {sampleItems.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSelectSample(s)}
                    className="p-2.5 rounded-xl text-left bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all hover:border-emerald-500/40"
                  >
                    <span className="text-xs font-semibold text-slate-200 block truncate">{s.label}</span>
                    <span className="text-[10px] text-slate-400">{s.hint.includes("decaying") ? "High Spoilage" : "Optimal Fresh"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Freshness Metrics & Safety Verdict (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {freshnessResult ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Dynamic Freshness Meter */}
              <FreshnessMeter
                freshnessScore={freshnessResult.freshness_score}
                stage={freshnessResult.stage}
                shelfLifeDays={freshnessResult.estimated_shelf_life_days}
                safetyStatus={freshnessResult.safety_status}
                optimalTemp={freshnessResult.optimal_storage_conditions}
                discolorationIndex={freshnessResult.metrics.discoloration_index}
                textureDegradation={freshnessResult.metrics.texture_degradation}
              />

              {/* Visual Breakdown Indicators */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Visual Degradation & Microbial Markers</span>
                </h3>

                <div className="space-y-2">
                  {freshnessResult.visual_indicators.map((ind, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>

                {/* Health Risk & Safety Warnings */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Biological Safety & Consumption Advice:
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    {freshnessResult.health_risks.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                          freshnessResult.stage === 'Spoiled' ? 'text-rose-400' : 'text-amber-400'
                        }`} />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Recommendations */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Storage Preservative Protocols:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {freshnessResult.storage_recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-200">No Specimen Analyzed</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Upload an image or select a test specimen to classify freshness, detect mold/browning, and forecast shelf-life.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          title="Produce Freshness Snapshot"
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
