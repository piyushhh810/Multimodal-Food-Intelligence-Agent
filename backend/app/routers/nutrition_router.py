from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.nutrition import NutritionAnalysisResponse
from app.services.nutrition_service import nutrition_service

router = APIRouter(prefix="/nutrition", tags=["Nutrition Analysis"])

class NutritionQuery(BaseModel):
    dish_name: str
    portion_g: float = 250.0

@router.post("/calculate", response_model=NutritionAnalysisResponse)
def calculate_nutrition(query: NutritionQuery):
    """
    Generate estimated calories, protein, carbohydrates, fats, glycemic index,
    Health Score, and Nutri-Score for a specific food or dish.
    """
    return nutrition_service.get_nutrition_for_dish(query.dish_name, query.portion_g)

@router.get("/samples")
def get_nutrition_samples():
    """Returns sample nutrition items for instant exploration."""
    samples = []
    for dish_name in ["avocado toast", "mediterranean salad", "grilled salmon with asparagus", "chicken quinoa bowl", "berry oatmeal bowl"]:
        samples.append(nutrition_service.get_nutrition_for_dish(dish_name, 250.0))
    return samples
