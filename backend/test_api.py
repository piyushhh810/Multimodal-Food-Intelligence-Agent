import sys
import asyncio
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.routers.recognition_router import analyze_food_image, get_sample_dishes
from app.routers.nutrition_router import calculate_nutrition, NutritionQuery
from app.routers.freshness_router import inspect_food_freshness
from app.routers.hygiene_router import audit_kitchen_frame, audit_kitchen_video
from app.routers.cooking_router import get_recipe_guide, RecipeQuery, get_substitutions, SubstitutionQuery
from app.routers.mealplan_router import generate_meal_plan, UserDietaryProfile
from app.routers.multimodal_router import process_voice_command, VoiceCommandRequest
from app.routers.reports_router import get_dashboard_stats

async def run_direct_tests():
    print("=== Testing Food Verse AI Backend Directly ===")

    # 1. Nutrition
    nut = calculate_nutrition(NutritionQuery(dish_name="grilled salmon", portion_g=200))
    assert nut.success and nut.macros.calories > 0
    print(f"[PASS] Nutrition Service -> {nut.food_name} ({nut.macros.calories} kcal, Nutri-Score {nut.health_assessment.nutri_score})")

    # 2. Recognition
    rec = await analyze_food_image()
    assert rec.success and len(rec.detected_items) > 0
    print(f"[PASS] Recognition Service -> {rec.dish_name} ({len(rec.detected_items)} items detected)")

    # 3. Freshness
    fresh = await inspect_food_freshness(item_hint="apple")
    assert fresh.success and fresh.stage in ["Fresh", "Moderately Fresh", "Spoiled"]
    print(f"[PASS] Freshness Service -> Stage: {fresh.stage} (Score: {fresh.freshness_score}%)")

    # 4. Hygiene Frame & Video
    hyg_frame = await audit_kitchen_frame(station_label="Station Alpha")
    assert hyg_frame.success and hyg_frame.overall_score > 0
    print(f"[PASS] Hygiene Frame Audit -> Safety: {hyg_frame.safety_grade} ({hyg_frame.overall_score}%)")

    hyg_video = await audit_kitchen_video()
    assert hyg_video.success and len(hyg_video.violations) > 0
    print(f"[PASS] Hygiene Video Audit -> {hyg_video.inspection_type} ({len(hyg_video.violations)} violations logged)")

    # 5. Cooking
    cook = get_recipe_guide(RecipeQuery(recipe_query="mediterranean bowl"))
    assert cook.success and len(cook.steps) > 0
    print(f"[PASS] Cooking Assistant -> {cook.recipe_title} ({len(cook.steps)} steps with timers)")

    subs = get_substitutions(SubstitutionQuery(ingredient="egg"))
    assert len(subs) > 0
    print(f"[PASS] Cooking Substitutions -> {len(subs)} alternatives found for egg")

    # 6. Meal Planning
    prof = UserDietaryProfile(age=28, gender="female", weight_kg=62, height_cm=168, goal="Weight Loss", dietary_preference="Balanced")
    mp = generate_meal_plan(prof)
    assert mp.success and len(mp.weekly_schedule) == 7 and len(mp.grocery_list) > 0
    print(f"[PASS] Meal Plan Generator -> Target {mp.daily_calorie_target} kcal, {len(mp.weekly_schedule)} days, {len(mp.grocery_list)} groceries")

    # 7. Multimodal Audio Voice Command
    cmd = process_voice_command(VoiceCommandRequest(transcript="Set timer for 10 minutes"))
    assert cmd["intent"] == "SET_TIMER" and cmd["parameters"]["minutes"] == 10
    print(f"[PASS] Multimodal Voice Command -> Intent {cmd['intent']} ({cmd['parameters']['minutes']} mins)")

    # 8. Reports Dashboard
    stats = get_dashboard_stats()
    assert stats["kpis"]["total_food_scans"] > 0
    print(f"[PASS] Dashboard Stats -> Total Scans: {stats['kpis']['total_food_scans']}, Avg Health: {stats['kpis']['avg_health_score']}")

    print("\nALL BACKEND CORE SERVICES AND ROUTERS TESTED AND VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_direct_tests())
