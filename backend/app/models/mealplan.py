from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class UserDietaryProfile(BaseModel):
    age: int = 28
    gender: str = "female" # male, female, other
    weight_kg: float = 65.0
    height_cm: float = 170.0
    activity_level: str = "Moderate" # Sedentary, Light, Moderate, Active, Very Active
    goal: str = "Weight Loss" # Weight Loss, Muscle Gain, Maintenance, Diabetic Friendly, Heart Healthy
    dietary_preference: str = "Balanced" # Balanced, High Protein, Keto, Mediterranean, Vegan, Vegetarian
    allergies: List[str] = [] # Nuts, Dairy, Gluten, Shellfish, Eggs, Soy
    target_calories: Optional[int] = None

class PlannedMeal(BaseModel):
    meal_type: str # Breakfast, Lunch, Dinner, Snack
    name: str
    description: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    key_ingredients: List[str] = []

class DayMealPlan(BaseModel):
    day: str # Monday, Tuesday, etc.
    target_calories: int
    meals: List[PlannedMeal]

class GroceryItem(BaseModel):
    id: str
    item: str
    amount: str
    category: str # "Produce", "Proteins", "Dairy & Alt", "Pantry & Grains", "Herbs & Spices"
    checked: bool = False

class MealPlanResponse(BaseModel):
    success: bool = True
    profile_summary: Dict[str, Any]
    daily_calorie_target: int
    daily_macros: Dict[str, float] # protein_g, carbs_g, fat_g
    weekly_schedule: List[DayMealPlan]
    grocery_list: List[GroceryItem]
    health_recommendations: List[str]
