from fastapi import APIRouter
from app.models.mealplan import UserDietaryProfile, MealPlanResponse
from app.services.mealplan_service import mealplan_service

router = APIRouter(prefix="/mealplan", tags=["Personalized Meal Planning"])

@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan(profile: UserDietaryProfile):
    """
    Generate personalized 7-day adaptive meal plan and aggregated grocery shopping list
    tailored to user's BMR, dietary goal, preferences, and allergens.
    """
    return mealplan_service.generate_plan(profile)

@router.get("/default-plan", response_model=MealPlanResponse)
def get_default_plan():
    """Retrieve pre-computed standard healthy meal plan."""
    default_profile = UserDietaryProfile()
    return mealplan_service.generate_plan(default_profile)
