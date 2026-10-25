import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Scale, 
  Flame, 
  ShieldAlert, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import MacroNutrientChart from '../components/MacroNutrientChart';
import HealthScoreBadge from '../components/HealthScoreBadge';
import { calculateNutrition } from '../services/api';

export default function NutritionAnalysisPage({ initialDish = 'Mediterranean Salad' }) {
  const [dishQuery, setDishQuery] = useState(initialDish);
  const [portionG, setPortionG] = useState(250);
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);

  const presetDishes = [
    "Mediterranean Salad",
    "Grilled Salmon with Asparagus",
    "Avocado Toast",
    "Chicken Quinoa Bowl",
    "Berry Oatmeal Bowl",
    "Classic Burger and Fries"
  ];

  useEffect(() => {
    fetchNutrition(initialDish, portionG);
  }, [initialDish]);

  const fetchNutrition = async (dish, portion) => {
    setLoading(true);
    try {
      const data = await calculateNutrition(dish, portion);
      setNutritionData(data);
    } catch (err) {
      console.error("Nutrition calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (dishQuery.trim()) {
      fetchNutrition(dishQuery, portionG);
    }
  };

  const handlePortionChange = (e) => {
    const val = Number(e.target.value);
    setPortionG(val);
    fetchNutrition(dishQuery, val);
  };

  const selectPreset = (dish) => {
    setDishQuery(dish);
    fetchNutrition(dish, portionG);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          <span>Nutritional Intelligence & Health Scoring</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Compute calories, macro balance, micronutrient density, and Nutri-Score classification.
        </p>
      </div>

      {/* Query Bar & Presets */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={dishQuery}
              onChange={(e) => setDishQuery(e.target.value)}
              placeholder="Search or enter food item (e.g. Avocado Toast, Grilled Salmon)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition-all shadow-md shadow-emerald-500/20"
          >
            Analyze Nutrition
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Quick Explore:</span>
          {presetDishes.map((dish) => (
            <button
              key={dish}
              onClick={() => selectPreset(dish)}
              className={`px-3 py-1.5 rounded-xl border shrink-0 transition-all ${
                dishQuery.toLowerCase() === dish.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
              }`}
            >
              {dish}
            </button>
          ))}
        </div>
      </div>

      {nutritionData && (
        <div className="space-y-6">
          {/* Portion Size Slider Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portion Serving Size</span>
                <div className="text-xl font-bold text-white">{portionG} grams</div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex items-center gap-3">
              <span className="text-xs text-slate-500">50g</span>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={portionG}
                onChange={handlePortionChange}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs text-slate-500">500g</span>
            </div>
          </div>

          {/* Core Analytics Grid: Macros Chart + Health Score Badge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MacroNutrientChart
              calories={nutritionData.macros.calories}
              protein={nutritionData.macros.protein_g}
              carbs={nutritionData.macros.carbs_g}
              fat={nutritionData.macros.fat_g}
              fiber={nutritionData.macros.fiber_g}
            />

            <HealthScoreBadge
              score={nutritionData.health_assessment.health_score}
              nutriScore={nutritionData.health_assessment.nutri_score}
              label={nutritionData.health_assessment.rating_label}
            />
          </div>

          {/* Micronutrient Details & Daily Values */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Micronutrients */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Essential Micronutrients</span>
              </h3>

              <div className="space-y-3">
                {[
                  { name: "Vitamin A", val: `${nutritionData.micros.vitamin_a_pct}% DV` },
                  { name: "Vitamin C", val: `${nutritionData.micros.vitamin_c_pct}% DV` },
                  { name: "Calcium", val: `${nutritionData.micros.calcium_pct}% DV` },
                  { name: "Iron", val: `${nutritionData.micros.iron_pct}% DV` },
                  { name: "Potassium", val: `${nutritionData.micros.potassium_mg} mg` },
                ].map((m) => (
                  <div key={m.name} className="flex justify-between items-center py-2 border-b border-slate-800/80 text-xs">
                    <span className="text-slate-400">{m.name}</span>
                    <span className="font-semibold text-slate-200">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Pros & Cons */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400" />
                <span>Health Strengths & Considerations</span>
              </h3>

              <div className="space-y-3">
                {nutritionData.health_assessment.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
                {nutritionData.health_assessment.cons.map((con, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diet Compatibility & Allergens */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Dietary Regimens & Allergens</span>
              </h3>

              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Compatibility:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(nutritionData.health_assessment.dietary_compatibility).map(([k, fits]) => (
                    <span
                      key={k}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        fits
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/60 text-slate-500 border border-slate-800 line-through'
                      }`}
                    >
                      {k.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Allergen Warnings:
                  </span>
                  {nutritionData.allergen_alerts.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {nutritionData.allergen_alerts.map((al) => (
                        <span key={al} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          {al}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium">No major allergens flagged.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Dietitian Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">AI Dietitian Synthesis</span>
              <p>{nutritionData.ai_dietitian_note}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
