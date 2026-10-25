from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class Macronutrients(BaseModel):
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    sodium_mg: float

class Micronutrients(BaseModel):
    vitamin_a_pct: float = 0.0
    vitamin_c_pct: float = 0.0
    calcium_pct: float = 0.0
    iron_pct: float = 0.0
    potassium_mg: float = 0.0

class HealthAssessment(BaseModel):
    health_score: int = Field(..., ge=0, le=100, description="Health score 0 to 100")
    nutri_score: str = Field(..., description="Nutri-Score grade A to E")
    rating_label: str # e.g. "Highly Nutritious", "Balanced", "Moderate", "Treat with Moderation"
    glycemic_index: str = "Medium" # Low, Medium, High
    pros: List[str] = []
    cons: List[str] = []
    dietary_compatibility: Dict[str, bool] = {} # e.g. {"keto": False, "high_protein": True, "vegan": True}

class NutritionAnalysisResponse(BaseModel):
    success: bool = True
    food_name: str
    portion_size_g: float = 100.0
    macros: Macronutrients
    micros: Micronutrients
    health_assessment: HealthAssessment
    daily_value_percentages: Dict[str, float] = {}
    allergen_alerts: List[str] = []
    ai_dietitian_note: str = ""
