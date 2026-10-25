const API_BASE = "http://localhost:8000/api";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return { status: "offline", error: err.message };
  }
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/reports/dashboard-stats`);
  if (!res.ok) throw new Error("Failed to load dashboard metrics");
  return await res.json();
}

export async function recognizeFoodImage({ file, imageBase64, apiKey }) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (imageBase64) formData.append("image_base64", imageBase64);

  const headers = {};
  if (apiKey) headers["X-Gemini-Key"] = apiKey;

  const res = await fetch(`${API_BASE}/recognition/analyze`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error("Food recognition failed");
  return await res.json();
}

export async function calculateNutrition(dishName, portionG = 250) {
  const res = await fetch(`${API_BASE}/nutrition/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dish_name: dishName, portion_g: portionG }),
  });
  if (!res.ok) throw new Error("Nutrition calculation failed");
  return await res.json();
}

export async function inspectFreshness({ file, imageBase64, itemHint = "produce" }) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (imageBase64) formData.append("image_base64", imageBase64);
  formData.append("item_hint", itemHint);

  const res = await fetch(`${API_BASE}/freshness/inspect`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Freshness inspection failed");
  return await res.json();
}

export async function auditHygieneFrame({ file, imageBase64, stationLabel = "Station 1" }) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  if (imageBase64) formData.append("image_base64", imageBase64);
  formData.append("station_label", stationLabel);

  const res = await fetch(`${API_BASE}/hygiene/audit-frame`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Hygiene audit failed");
  return await res.json();
}

export async function auditHygieneVideo(cameraName = "CCTV Camera 04") {
  const formData = new FormData();
  formData.append("camera_name", cameraName);

  const res = await fetch(`${API_BASE}/hygiene/audit-video`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Hygiene video audit failed");
  return await res.json();
}

export async function getRecipeGuide(recipeQuery) {
  const res = await fetch(`${API_BASE}/cooking/recipe-guide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe_query: recipeQuery }),
  });
  if (!res.ok) throw new Error("Failed to retrieve cooking guide");
  return await res.json();
}

export async function getSubstitutions(ingredient) {
  const res = await fetch(`${API_BASE}/cooking/substitute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredient }),
  });
  if (!res.ok) throw new Error("Failed to fetch substitutions");
  return await res.json();
}

export async function generatePersonalizedMealPlan(profile) {
  const res = await fetch(`${API_BASE}/mealplan/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Failed to generate personalized meal plan");
  return await res.json();
}

export async function sendVoiceCommand(transcript) {
  const res = await fetch(`${API_BASE}/multimodal/voice-command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  if (!res.ok) throw new Error("Voice command processing failed");
  return await res.json();
}

export async function exportExecutiveAuditReport(options) {
  const res = await fetch(`${API_BASE}/reports/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error("Failed to generate executive report");
  return await res.json();
}
