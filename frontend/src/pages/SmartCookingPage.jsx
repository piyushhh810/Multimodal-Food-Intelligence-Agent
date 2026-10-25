import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Volume2, 
  VolumeX, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Search, 
  Flame, 
  Clock, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import InteractiveCookingTimer from '../components/InteractiveCookingTimer';
import { getRecipeGuide, getSubstitutions } from '../services/api';

export default function SmartCookingPage({ voiceTriggerEvent }) {
  const [recipe, setRecipe] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Substitution Finder
  const [subQuery, setSubQuery] = useState('');
  const [substitutions, setSubstitutions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    loadRecipe("mediterranean bowl");
  }, []);

  // Handle external voice intents
  useEffect(() => {
    if (!voiceTriggerEvent) return;
    const { intent, parameters } = voiceTriggerEvent;
    if (intent === "COOKING_NEXT" && recipe) {
      handleNextStep();
    } else if (intent === "COOKING_PREV") {
      handlePrevStep();
    } else if (intent === "SUBSTITUTE" && parameters?.ingredient) {
      setSubQuery(parameters.ingredient);
      handleSearchSub(parameters.ingredient);
    }
  }, [voiceTriggerEvent]);

  const loadRecipe = async (dishQuery) => {
    setLoading(true);
    try {
      const data = await getRecipeGuide(dishQuery);
      setRecipe(data);
      setCurrentStepIndex(0);
      setCheckedIngredients({});
      if (speechEnabled && data.steps.length > 0) {
        speakInstruction(data.steps[0].voice_guidance);
      }
    } catch (err) {
      console.error("Failed to load recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  const speakInstruction = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    if (!recipe) return;
    if (currentStepIndex < recipe.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      speakInstruction(recipe.steps[nextIdx].voice_guidance);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      speakInstruction(recipe.steps[prevIdx].voice_guidance);
    }
  };

  const toggleIngredient = (name) => {
    setCheckedIngredients((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSearchSub = async (ing) => {
    if (!ing.trim()) return;
    setSubLoading(true);
    try {
      const list = await getSubstitutions(ing);
      setSubstitutions(list);
    } catch (e) {
      console.error(e);
    } finally {
      setSubLoading(false);
    }
  };

  const currentStep = recipe?.steps[currentStepIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-emerald-400" />
            <span>Smart Cooking Studio & Hands-Free Guide</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive step-by-step guidance with speech narration, integrated timers, and smart dietary substitutions.
          </p>
        </div>

        {/* Recipe Switcher Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadRecipe("mediterranean bowl")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              recipe?.recipe_title.includes("Mediterranean")
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Quinoa Power Bowl
          </button>
          <button
            onClick={() => loadRecipe("grilled salmon")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              recipe?.recipe_title.includes("Salmon")
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Pan-Seared Salmon
          </button>
        </div>
      </div>

      {recipe && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Step Navigator (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Main Active Step HUD Card */}
            <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Step Progress Top Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    STEP {currentStepIndex + 1} OF {recipe.steps.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {recipe.difficulty}</span>
                </div>

                {/* Read aloud audio control */}
                <button
                  onClick={() => {
                    const next = !speechEnabled;
                    setSpeechEnabled(next);
                    if (next && currentStep) speakInstruction(currentStep.voice_guidance);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    speechEnabled
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                  title="Toggle Voice Speech Synthesis"
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  <span>{speechEnabled ? "Voice Guidance Active" : "Voice Muted"}</span>
                </button>
              </div>

              {/* Step Heading & Instruction Text */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentStep?.title}
                </h3>
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                  {currentStep?.instruction}
                </p>
              </div>

              {/* Chef Technique & Tip Callout */}
              {currentStep?.chef_tip && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 block mb-0.5">Chef Pro-Tip</span>
                    <p>{currentStep.chef_tip}</p>
                  </div>
                </div>
              )}

              {/* Step Timer if step requires timed cooking */}
              {currentStep?.timer_seconds && (
                <InteractiveCookingTimer
                  key={currentStep.step_number}
                  initialSeconds={currentStep.timer_seconds}
                  label={`Step ${currentStep.step_number} Timer`}
                  autoStart={false}
                />
              )}

              {/* Step Navigation Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentStepIndex === 0
                      ? 'opacity-40 cursor-not-allowed bg-slate-800/50 text-slate-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {recipe.steps.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setCurrentStepIndex(i);
                        speakInstruction(recipe.steps[i].voice_guidance);
                      }}
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        i === currentStepIndex
                          ? 'w-6 bg-emerald-400'
                          : i < currentStepIndex
                          ? 'w-2 bg-emerald-700'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === recipe.steps.length - 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                    currentStepIndex === recipe.steps.length - 1
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/20'
                  }`}
                >
                  <span>{currentStepIndex === recipe.steps.length - 1 ? 'Recipe Complete!' : 'Next Step'}</span>
                  {currentStepIndex < recipe.steps.length - 1 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Smart Dietary Substitution Tool */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Smart Ingredient Substitution Finder</span>
              </h3>
              <p className="text-xs text-slate-400">
                Cooking with allergies, dietary goals, or an empty pantry? Find healthy substitutes instantly.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={subQuery}
                  onChange={(e) => setSubQuery(e.target.value)}
                  placeholder="E.g. egg, dairy milk, butter, all-purpose flour, sugar..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleSearchSub(subQuery)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition-all shadow-md"
                >
                  Find Swaps
                </button>
              </div>

              {/* Substitution Results */}
              {substitutions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {substitutions.map((sub, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300">{sub.substitute}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {sub.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Ratio: <span className="text-slate-200">{sub.ratio}</span></p>
                      <p className="text-[10px] text-slate-400 mt-1">{sub.flavor_impact}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recipe Meta & Ingredients Checklist (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Recipe Overview Card */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recipe Summary</h4>
              <h3 className="text-lg font-extrabold text-white">{recipe.recipe_title}</h3>
              <p className="text-xs text-slate-400">{recipe.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Prep Time</span>
                  <span className="text-xs font-bold text-white">{recipe.prep_time_minutes}m</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Cook Time</span>
                  <span className="text-xs font-bold text-white">{recipe.cook_time_minutes}m</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Calories</span>
                  <span className="text-xs font-bold text-emerald-400">{recipe.estimated_calories_per_serving}</span>
                </div>
              </div>
            </div>

            {/* Interactive Ingredient Checklist */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ingredients ({recipe.ingredients.length})
                </h4>
                <span className="text-[11px] text-slate-500">Tap to cross off</span>
              </div>

              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {recipe.ingredients.map((ing) => {
                  const isChecked = !!checkedIngredients[ing.name];
                  return (
                    <div
                      key={ing.name}
                      onClick={() => toggleIngredient(ing.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                        isChecked
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                          : 'bg-slate-900/80 border-slate-800/80 text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="font-medium">{ing.name}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{ing.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
