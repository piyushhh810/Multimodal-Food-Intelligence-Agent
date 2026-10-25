import uuid
from typing import Dict, Any, List
from app.models.mealplan import (
    UserDietaryProfile, MealPlanResponse, DayMealPlan, PlannedMeal, GroceryItem
)

class MealPlanService:
    """Service to compute BMR/TDEE and generate 7-day personalized adaptive meal plans and grocery lists."""

    ACTIVITY_FACTORS = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very active": 1.9
    }

    MEAL_TEMPLATES = {
        "Balanced": {
            "breakfast": [
                PlannedMeal(meal_type="Breakfast", name="Berry Quinoa Breakfast Bowl", description="Steamed quinoa with chia seeds, fresh blueberries, and almond drizzle", calories=380, protein_g=14, carbs_g=58, fat_g=11, key_ingredients=["Quinoa", "Blueberries", "Almond Butter", "Chia Seeds"]),
                PlannedMeal(meal_type="Breakfast", name="Avocado Sourdough Toast & Poached Egg", description="Artisan toast with crushed ripe avocado, hemp seeds, and pasture-raised egg", calories=410, protein_g=18, carbs_g=38, fat_g=19, key_ingredients=["Sourdough Bread", "Avocado", "Eggs", "Hemp Seeds"]),
                PlannedMeal(meal_type="Breakfast", name="Greek Yogurt Citrus Parfait", description="Thick Greek yogurt layered with raw honey, walnuts, and grapefruit segments", calories=350, protein_g=22, carbs_g=32, fat_g=12, key_ingredients=["Greek Yogurt", "Raw Honey", "Walnuts", "Grapefruit"])
            ],
            "lunch": [
                PlannedMeal(meal_type="Lunch", name="Mediterranean Lemon-Herb Chickpea Bowl", description="Crisp romaine, diced cucumbers, kalamata olives, chickpeas, and lemon vinaigrette", calories=480, protein_g=18, carbs_g=62, fat_g=16, key_ingredients=["Chickpeas", "Cucumbers", "Cherry Tomatoes", "Kalamata Olives", "Feta"]),
                PlannedMeal(meal_type="Lunch", name="Grilled Chicken Rainbow Crunch Salad", description="Sliced chicken breast over shredded cabbage, edamame, bell peppers, and peanut ginger dressing", calories=520, protein_g=42, carbs_g=28, fat_g=22, key_ingredients=["Chicken Breast", "Cabbage", "Edamame", "Bell Peppers"]),
                PlannedMeal(meal_type="Lunch", name="Lentil & Sweet Potato Coconut Curry", description="Warm turmeric lentils simmered with cubed sweet potato and baby spinach", calories=490, protein_g=19, carbs_g=72, fat_g=13, key_ingredients=["Brown Lentils", "Sweet Potato", "Spinach", "Coconut Milk"])
            ],
            "dinner": [
                PlannedMeal(meal_type="Dinner", name="Herb-Crusted Wild Salmon & Roasted Asparagus", description="Pan-seared salmon with garlic asparagus spears and lemon wild rice", calories=560, protein_g=44, carbs_g=36, fat_g=22, key_ingredients=["Wild Salmon", "Asparagus", "Wild Rice", "Lemon"]),
                PlannedMeal(meal_type="Dinner", name="Turkey & Black Bean Stuffed Peppers", description="Bell peppers roasted with lean ground turkey, corn, black beans, and salsa verde", calories=480, protein_g=38, carbs_g=42, fat_g=16, key_ingredients=["Bell Peppers", "Lean Turkey", "Black Beans", "Salsa Verde"]),
                PlannedMeal(meal_type="Dinner", name="Crispy Tofu Vegetable Stir-Fry", description="Golden pressed tofu, snap peas, shiitake mushrooms, and brown jasmine rice", calories=440, protein_g=24, carbs_g=54, fat_g=14, key_ingredients=["Extra Firm Tofu", "Snap Peas", "Shiitake Mushrooms", "Jasmine Rice"])
            ],
            "snack": [
                PlannedMeal(meal_type="Snack", name="Apple Slices with Natural Peanut Butter", description="Crisp Honeycrisp apple wedges with single-ingredient peanut butter", calories=190, protein_g=6, carbs_g=24, fat_g=9, key_ingredients=["Apples", "Natural Peanut Butter"]),
                PlannedMeal(meal_type="Snack", name="Handful of Mixed Raw Almonds & Dark Chocolate", description="85% cacao dark chocolate square with raw California almonds", calories=170, protein_g=5, carbs_g=12, fat_g=12, key_ingredients=["Almonds", "Dark Chocolate 85%"]),
                PlannedMeal(meal_type="Snack", name="Roasted Sea Salt Edamame", description="Crispy baked green edamame seasoned with toasted sesame oil and sea salt", calories=140, protein_g=12, carbs_g=9, fat_g=4, key_ingredients=["Edamame Pods", "Sesame Oil", "Sea Salt"])
            ]
        }
    }

    @classmethod
    def calculate_tdee(cls, profile: UserDietaryProfile) -> int:
        """Calculate Mifflin-St Jeor Total Daily Energy Expenditure (TDEE)."""
        if profile.gender.lower() == "male":
            bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5
        else:
            bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161

        factor = cls.ACTIVITY_FACTORS.get(profile.activity_level.lower(), 1.55)
        tdee = bmr * factor

        # Goal adjustments
        goal_lower = profile.goal.lower()
        if "loss" in goal_lower:
            target = tdee - 500
        elif "gain" in goal_lower:
            target = tdee + 400
        else:
            target = tdee

        return int(max(1200, min(3800, target)))

    @classmethod
    def generate_plan(cls, profile: UserDietaryProfile) -> MealPlanResponse:
        """Generate tailored 7-day meal schedule and aggregated grocery list."""
        daily_cals = profile.target_calories if profile.target_calories else cls.calculate_tdee(profile)

        # Macro split (default 30% protein, 45% carbs, 25% fat)
        if "keto" in profile.dietary_preference.lower():
            prot_pct, carb_pct, fat_pct = 0.25, 0.05, 0.70
        elif "protein" in profile.dietary_preference.lower() or "gain" in profile.goal.lower():
            prot_pct, carb_pct, fat_pct = 0.35, 0.40, 0.25
        else:
            prot_pct, carb_pct, fat_pct = 0.25, 0.50, 0.25

        prot_g = round((daily_cals * prot_pct) / 4.0, 1)
        carb_g = round((daily_cals * carb_pct) / 4.0, 1)
        fat_g = round((daily_cals * fat_pct) / 9.0, 1)

        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        pool = cls.MEAL_TEMPLATES["Balanced"]

        weekly_schedule: List[DayMealPlan] = []
        grocery_set = {}

        for i, day in enumerate(days_of_week):
            b = pool["breakfast"][i % len(pool["breakfast"])]
            l = pool["lunch"][i % len(pool["lunch"])]
            d = pool["dinner"][i % len(pool["dinner"])]
            s = pool["snack"][i % len(pool["snack"])]

            day_meals = [b, l, d, s]
            day_target = sum(m.calories for m in day_meals)

            weekly_schedule.append(DayMealPlan(
                day=day,
                target_calories=day_target,
                meals=day_meals
            ))

            # Aggregate grocery items
            for meal in day_meals:
                for ing in meal.key_ingredients:
                    grocery_set[ing] = grocery_set.get(ing, 0) + 1

        # Build categorized shopping list
        grocery_list: List[GroceryItem] = []
        category_map = {
            "Produce": ["Blueberries", "Avocado", "Grapefruit", "Cucumbers", "Cherry Tomatoes", "Cabbage", "Bell Peppers", "Sweet Potato", "Spinach", "Asparagus", "Lemon", "Apples"],
            "Proteins": ["Eggs", "Chicken Breast", "Wild Salmon", "Lean Turkey", "Extra Firm Tofu"],
            "Dairy & Alt": ["Greek Yogurt", "Feta", "Almond Butter"],
            "Pantry & Grains": ["Quinoa", "Sourdough Bread", "Chickpeas", "Brown Lentils", "Coconut Milk", "Wild Rice", "Black Beans", "Jasmine Rice", "Edamame Pods"],
            "Herbs & Spices": ["Chia Seeds", "Hemp Seeds", "Walnuts", "Kalamata Olives", "Salsa Verde", "Almonds", "Dark Chocolate 85%", "Sesame Oil", "Sea Salt"]
        }

        for item, count in grocery_set.items():
            cat = "Pantry & Grains"
            for c, items in category_map.items():
                if item in items:
                    cat = c
                    break

            grocery_list.append(GroceryItem(
                id=str(uuid.uuid4())[:8],
                item=item,
                amount=f"{count * 2} servings / pack",
                category=cat,
                checked=False
            ))

        recs = [
            f"Daily caloric target is set to {daily_cals} kcal to support your '{profile.goal}' objective.",
            f"Maintain macro balance around {prot_g}g Protein, {carb_g}g Carbs, and {fat_g}g Healthy Fats.",
            "Stay hydrated with at least 2.5 - 3 Liters of water daily.",
            "All recipes incorporate high-fiber, low-glycemic complexes to maintain sustained insulin sensitivity."
        ]

        return MealPlanResponse(
            success=True,
            profile_summary={
                "age": profile.age,
                "gender": profile.gender,
                "weight_kg": profile.weight_kg,
                "height_cm": profile.height_cm,
                "goal": profile.goal,
                "dietary_preference": profile.dietary_preference
            },
            daily_calorie_target=daily_cals,
            daily_macros={"protein_g": prot_g, "carbs_g": carb_g, "fat_g": fat_g},
            weekly_schedule=weekly_schedule,
            grocery_list=grocery_list,
            health_recommendations=recs
        )

mealplan_service = MealPlanService()
