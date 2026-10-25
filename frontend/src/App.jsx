import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExportReportModal from './components/ExportReportModal';
import AudioController from './components/AudioController';

// Page Views
import DashboardOverview from './pages/DashboardOverview';
import FoodRecognitionPage from './pages/FoodRecognitionPage';
import NutritionAnalysisPage from './pages/NutritionAnalysisPage';
import FreshnessDetectionPage from './pages/FreshnessDetectionPage';
import RestaurantHygienePage from './pages/RestaurantHygienePage';
import SmartCookingPage from './pages/SmartCookingPage';
import MealPlanningPage from './pages/MealPlanningPage';
import SettingsPage from './pages/SettingsPage';

import { checkBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOnline, setBackendOnline] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTriggerEvent, setVoiceTriggerEvent] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDishForNutrition, setSelectedDishForNutrition] = useState('Mediterranean Salad');

  // Verify backend on startup
  useEffect(() => {
    async function testBackend() {
      const res = await checkBackendHealth();
      setBackendOnline(res?.status === 'healthy');
    }
    testBackend();
    const interval = setInterval(testBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // Voice assistant intent routing
  const handleIntentTrigger = (event) => {
    setVoiceTriggerEvent(event);
    const intent = event.intent;

    if (intent === 'RECOGNIZE_FOOD') {
      setActiveTab('recognition');
    } else if (intent === 'NUTRITION_LOOKUP') {
      setActiveTab('nutrition');
    } else if (intent === 'ANALYZE_FRESHNESS') {
      setActiveTab('freshness');
    } else if (intent === 'HYGIENE_CHECK') {
      setActiveTab('hygiene');
    } else if (intent === 'COOKING_NEXT' || intent === 'COOKING_PREV' || intent === 'SET_TIMER' || intent === 'SUBSTITUTE') {
      setActiveTab('cooking');
    }
  };

  const handleSelectDishForNutrition = (dishName) => {
    setSelectedDishForNutrition(dishName);
    setActiveTab('nutrition');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        isListening={isListening}
        toggleVoiceAssistant={() => setIsListening(!isListening)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Workspace */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              setActiveTab={setActiveTab} 
              onOpenExportModal={() => setIsExportModalOpen(true)} 
            />
          )}

          {activeTab === 'recognition' && (
            <FoodRecognitionPage 
              onSelectDishForNutrition={handleSelectDishForNutrition} 
            />
          )}

          {activeTab === 'nutrition' && (
            <NutritionAnalysisPage 
              initialDish={selectedDishForNutrition} 
            />
          )}

          {activeTab === 'freshness' && (
            <FreshnessDetectionPage />
          )}

          {activeTab === 'hygiene' && (
            <RestaurantHygienePage 
              onOpenExportModal={() => setIsExportModalOpen(true)} 
            />
          )}

          {activeTab === 'cooking' && (
            <SmartCookingPage 
              voiceTriggerEvent={voiceTriggerEvent} 
            />
          )}

          {activeTab === 'mealplan' && (
            <MealPlanningPage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Persistent Audio Assistant Floating Drawer */}
      <div className="fixed bottom-4 right-4 z-30 max-w-sm w-full hidden sm:block">
        <AudioController
          onIntentTrigger={handleIntentTrigger}
          isListening={isListening}
          setIsListening={setIsListening}
        />
      </div>

      {/* Printable Executive Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
