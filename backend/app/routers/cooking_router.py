from typing import Optional, List
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.cooking import RecipeGuideResponse, IngredientSubstitution
from app.services.cooking_service import cooking_service

router = APIRouter(prefix="/cooking", tags=["Smart Cooking Assistance"])

class RecipeQuery(BaseModel):
    recipe_query: str = "mediterranean bowl"

class SubstitutionQuery(BaseModel):
    ingredient: str

@router.post("/recipe-guide", response_model=RecipeGuideResponse)
def get_recipe_guide(query: RecipeQuery):
    """
    Get interactive recipe steps, timers, chef tips, and voice prompts for hands-free cooking.
    """
    return cooking_service.get_recipe_guide(query.recipe_query)

@router.post("/substitute", response_model=List[IngredientSubstitution])
def get_substitutions(query: SubstitutionQuery):
    """
    Find smart dietary, vegan, allergy-friendly, or low-calorie ingredient substitutions.
    """
    return cooking_service.find_substitutions(query.ingredient)

@router.get("/featured")
def get_featured_recipes():
    """List featured interactive cooking guides."""
    return [
        {"id": "mediterranean bowl", "title": "Zesty Mediterranean Quinoa Power Bowl", "time": "20 mins", "difficulty": "Easy", "calories": 420},
        {"id": "grilled salmon", "title": "Pan-Seared Crispy Salmon with Garlic Asparagus", "time": "12 mins", "difficulty": "Intermediate", "calories": 460}
    ]
