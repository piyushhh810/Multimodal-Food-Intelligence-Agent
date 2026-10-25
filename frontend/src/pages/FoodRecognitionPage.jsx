import React, { useState } from 'react';
import { 
  ScanLine, 
  Upload, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  ChefHat, 
  Tag, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import { recognizeFoodImage, BACKEND_URL } from '../services/api';

export default function FoodRecognitionPage({ onSelectDishForNutrition }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const sampleDishes = [
    { label: "Mediterranean Salad", sampleHint: "leafy_greens", file: "/sample_data/mediterranean_salad.jpg", category: "Salad" },
    { label: "Fresh Apple", sampleHint: "fruit", file: "/sample_data/fresh_apple.jpg", category: "Fruit" },
    { label: "Grilled Salmon", sampleHint: "balanced", file: "/sample_data/kitchen_prep.jpg", category: "Seafood" }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      analyzeImage(file, null);
    }
  };

  const handleCameraCapture = (dataUrl) => {
    setPreviewUrl(dataUrl);
    analyzeImage(null, dataUrl);
  };

  const handleSelectSample = async (sample) => {
    setLoading(true);
    try {
      // Fetch sample image from backend static mount
      const res = await fetch(`${BACKEND_URL}${sample.file}`);
      const blob = await res.blob();
      const file = new File([blob], `${sample.label}.jpg`, { type: "image/jpeg" });
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      await analyzeImage(file, null);
    } catch (e) {
      console.warn("Could not load backend static sample directly, using direct recognition call:", e);
      await analyzeImage(null, null);
    }
  };

  const analyzeImage = async (file, base64) => {
    setLoading(true);
    setResult(null);
    try {
      const apiKey = localStorage.getItem("GEMINI_API_KEY") || "";
      const data = await recognizeFoodImage({ file, imageBase64: base64, apiKey });
      setResult(data);
      if (data.detected_items && data.detected_items.length > 0) {
        setActiveItemIndex(0);
      }
    } catch (err) {
      console.error("Recognition failed:", err);
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
            <ScanLine className="w-6 h-6 text-emerald-400" />
            <span>Multimodal Food Recognition</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Identify dishes, ingredients, portion sizes, and dietary classifications with computer vision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Open Webcam</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload & Viewfinder vs Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Food Image Input
            </h3>

            {/* Drag & Drop Upload Zone */}
            <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 overflow-hidden flex flex-col items-center justify-center transition-all group">
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img src={previewUrl} alt="Food Preview" className="w-full h-full object-cover" />
                  
                  {/* Bounding Box Overlays if available */}
                  {result && result.detected_items && result.detected_items.map((item, idx) => {
                    const box = item.bounding_box;
                    if (!box) return null;
                    const isActive = idx === activeItemIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveItemIndex(idx)}
                        style={{
                          left: `${box.x}%`,
                          top: `${box.y}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                        }}
                        className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
                          isActive
                            ? 'border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-400/30 ring-2 ring-emerald-300'
                            : 'border-cyan-400/80 bg-cyan-400/10 hover:border-emerald-400'
                        }`}
                      >
                        <span className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/90 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                          {item.name} ({Math.round(item.confidence * 100)}%)
                        </span>
                      </div>
                    );
                  })}

                  {/* Scanning scanline animation if loading */}
                  {loading && (
                    <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold text-emerald-400 animate-pulse">Running Neural Vision Model...</span>
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">Drop food photo or browse</span>
                    <span className="text-xs text-slate-400">PNG, JPG, WebP supported</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Quick 1-Click Samples */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Or test with 1-click sample:</span>
              <div className="flex flex-wrap gap-2">
                {sampleDishes.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSelectSample(s)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all hover:border-emerald-500/40"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 animate-in fade-in duration-300">
              {/* Dish Header & Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {result.primary_category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">• {result.cuisine_type}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">{result.dish_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Preparation: <span className="text-slate-200 font-medium">{result.preparation_state}</span></p>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                  <span className="text-xs text-slate-400 block">Vision Confidence</span>
                  <span className="text-2xl font-bold text-emerald-400">{Math.round(result.confidence_score * 100)}%</span>
                  <span className="text-[10px] text-slate-500 block font-mono">{result.engine_used}</span>
                </div>
              </div>

              {/* Visual Tags & Dietary Badges */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Dietary & Visual Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.dietary_suitability.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {tag}
                    </span>
                  ))}
                  {result.visual_tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Items & Components List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Identified Food Items ({result.detected_items.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.detected_items.map((item, idx) => {
                    const isSelected = idx === activeItemIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveItemIndex(idx)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-emerald-500/40 glow-emerald'
                            : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-xs font-semibold text-emerald-400">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Portion: ~{item.estimated_portion_g}g</span>
                          <span className="text-slate-500">{item.category}</span>
                        </div>
                        {item.ingredients.length > 0 && (
                          <p className="text-[10px] text-slate-400 mt-2 truncate">
                            Nutrients: {item.ingredients.join(', ')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Reasoning Narrative */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Reasoning Summary</span>
                </div>
                <p className="leading-relaxed">{result.ai_reasoning}</p>
              </div>

              {/* Next Action: Compute Full Nutrition */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onSelectDishForNutrition(result.dish_name)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Activity className="w-4 h-4" />
                  <span>Calculate Deep Nutrition for "{result.dish_name}" &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <ScanLine className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-200">No Food Specimen Analyzed Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Upload an image from your device, take a live webcam snapshot, or pick a 1-click sample to run multimodal food recognition.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Camera Modal */}
      {showCamera && (
        <CameraCapture
          title="Food Recognition Snapshot"
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
