from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CookingStep(BaseModel):
    step_number: int
    title: str
    instruction: str
    voice_guidance: str
    timer_seconds: Optional[int] = None
    chef_tip: Optional[str] = None
    technique: Optional[str] = None

class IngredientItem(BaseModel):
    name: str
    amount: str
    notes: Optional[str] = None

class IngredientSubstitution(BaseModel):
    original: str
    substitute: str
    ratio: str
    category: str # "Vegan", "Dairy-Free", "Gluten-Free", "Low-Calorie", "Pantry Quick Swap"
    flavor_impact: str

class RecipeGuideResponse(BaseModel):
    success: bool = True
    recipe_title: str
    description: str
    cuisine: str
    difficulty: str # "Easy", "Intermediate", "Chef-Level"
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    ingredients: List[IngredientItem]
    steps: List[CookingStep]
    substitutions: List[IngredientSubstitution] = []
    chef_notes: str = ""
    estimated_calories_per_serving: int = 350
