import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Flame, 
  ShoppingCart, 
  User, 
  Activity, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Filter 
} from 'lucide-react';
import { generatePersonalizedMealPlan } from '../services/api';

export default function MealPlanningPage() {
  const [profile, setProfile] = useState({
    age: 28,
    gender: 'female',
    weight_kg: 64,
    height_cm: 168,
    activity_level: 'Moderate',
    goal: 'Weight Loss',
    dietary_preference: 'Balanced',
    allergies: []
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [checkedGroceries, setCheckedGroceries] = useState({});

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const data = await generatePersonalizedMealPlan(profile);
      setMealPlan(data);
      setActiveDayIndex(0);
    } catch (e) {
      console.error("Meal planning error:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleGrocery = (id) => {
    setCheckedGroceries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeDay = mealPlan?.weekly_schedule[activeDayIndex];

  // Group groceries by aisle category
  const groceryCategories = mealPlan?.grocery_list.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" />
            <span>Personalized Adaptive Meal Planning</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Formulate personalized 7-day nutritional schedules and automated grocery lists tailored to your metabolic requirements.
          </p>
        </div>

        <button
          onClick={generatePlan}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Regenerate 7-Day Plan</span>
        </button>
      </div>

      {/* User Biometric & Dietary Goal Configurator */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span>User Dietary Profile & Goals</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Age */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Age</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Weight (kg)</label>
            <input
              type="number"
              value={profile.weight_kg}
              onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          {/* Height */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Height (cm)</label>
            <input
              type="number"
              value={profile.height_cm}
              onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Activity Level</label>
            <select
              value={profile.activity_level}
              onChange={(e) => setProfile({ ...profile, activity_level: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light Exercise</option>
              <option value="Moderate">Moderate (3-5x/wk)</option>
              <option value="Active">Active Athlete</option>
            </select>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Health Goal</label>
            <select
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Heart Health">Heart Health</option>
            </select>
          </div>

          {/* Dietary Pattern */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Diet Preference</label>
            <select
              value={profile.dietary_preference}
              onChange={(e) => setProfile({ ...profile, dietary_preference: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              <option value="Balanced">Balanced</option>
              <option value="High Protein">High Protein</option>
              <option value="Keto">Keto</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>
      </div>

      {mealPlan && (
        <div className="space-y-6">
          {/* Target Nutrition Dashboard Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Daily Calorie Target</span>
              <div className="text-2xl font-bold text-white mt-1">{mealPlan.daily_calorie_target} kcal</div>
              <span className="text-[10px] text-emerald-400">Mifflin-St Jeor TDEE calibrated</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Target Protein</span>
              <div className="text-2xl font-bold text-blue-400 mt-1">{mealPlan.daily_macros.protein_g}g</div>
              <span className="text-[10px] text-slate-400">Muscle recovery & satiety</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Target Carbohydrates</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{mealPlan.daily_macros.carbs_g}g</div>
              <span className="text-[10px] text-slate-400">Complex, low-glycemic</span>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Target Healthy Fats</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">{mealPlan.daily_macros.fat_g}g</div>
              <span className="text-[10px] text-slate-400">Monounsaturated lipid base</span>
            </div>
          </div>

          {/* 7-Day Plan Navigator & Day View */}
          <div className="space-y-4">
            {/* Days Horizontal Tab Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {mealPlan.weekly_schedule.map((dayPlan, idx) => (
                <button
                  key={dayPlan.day}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold shrink-0 transition-all ${
                    idx === activeDayIndex
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/25'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                >
                  <span>{dayPlan.day}</span>
                  <span className="text-[10px] block opacity-80 font-normal">{dayPlan.target_calories} kcal</span>
                </button>
              ))}
            </div>

            {/* Active Day Meals Grid */}
            {activeDay && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeDay.meals.map((meal) => (
                  <div key={meal.name} className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          meal.meal_type === 'Breakfast' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          meal.meal_type === 'Lunch' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          meal.meal_type === 'Dinner' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        }`}>
                          {meal.meal_type}
                        </span>
                        <span className="text-xs font-bold text-white">{meal.calories} kcal</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{meal.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block mb-1">Key Ingredients:</span>
                      <div className="flex flex-wrap gap-1">
                        {meal.key_ingredients.map((ing) => (
                          <span key={ing} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aggregated Categorized Grocery Shopping List */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Consolidated Supermarket Shopping List</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {mealPlan.grocery_list.length} Total Ingredients
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {Object.entries(groceryCategories).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1">
                    {category} ({items.length})
                  </h4>
                  <div className="space-y-1.5">
                    {items.map((item) => {
                      const isChecked = !!checkedGroceries[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleGrocery(item.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                              : 'bg-slate-900/80 border-slate-800/80 text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'
                            }`}>
                              {isChecked && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span className="font-medium">{item.item}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{item.amount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
