from typing import Dict, Any, List, Optional
from app.models.nutrition import (
    NutritionAnalysisResponse, Macronutrients, Micronutrients, HealthAssessment
)

class NutritionService:
    """Service to compute nutrition profiles, Nutri-Score, Health Score, and allergen alerts."""

    # Baseline 100g nutritional database
    FOOD_DATABASE: Dict[str, Dict[str, Any]] = {
        "avocado toast": {
            "calories": 195, "protein": 4.5, "carbs": 21.0, "fat": 11.2, "fiber": 5.8, "sugar": 1.2, "sodium": 280,
            "vit_a": 4, "vit_c": 12, "calcium": 4, "iron": 9, "potassium": 380,
            "category": "Breakfast", "allergens": ["Gluten (wheat bread)"]
        },
        "mediterranean salad": {
            "calories": 115, "protein": 3.8, "carbs": 8.5, "fat": 7.9, "fiber": 3.2, "sugar": 3.1, "sodium": 340,
            "vit_a": 28, "vit_c": 45, "calcium": 12, "iron": 8, "potassium": 310,
            "category": "Salad", "allergens": ["Dairy (feta cheese)"]
        },
        "grilled salmon with asparagus": {
            "calories": 182, "protein": 22.4, "carbs": 3.1, "fat": 8.9, "fiber": 1.8, "sugar": 1.1, "sodium": 210,
            "vit_a": 16, "vit_c": 14, "calcium": 3, "iron": 7, "potassium": 520,
            "category": "Main Course", "allergens": ["Fish (salmon)"]
        },
        "chicken quinoa bowl": {
            "calories": 165, "protein": 18.5, "carbs": 16.2, "fat": 3.8, "fiber": 3.5, "sugar": 1.4, "sodium": 260,
            "vit_a": 22, "vit_c": 30, "calcium": 5, "iron": 14, "potassium": 440,
            "category": "Bowl", "allergens": []
        },
        "paneer tikka": {
            "calories": 240, "protein": 14.2, "carbs": 8.0, "fat": 16.5, "fiber": 2.1, "sugar": 3.5, "sodium": 390,
            "vit_a": 18, "vit_c": 22, "calcium": 25, "iron": 6, "potassium": 280,
            "category": "Appetizer", "allergens": ["Dairy (paneer)"]
        },
        "berry oatmeal bowl": {
            "calories": 128, "protein": 4.2, "carbs": 24.5, "fat": 2.1, "fiber": 4.6, "sugar": 6.2, "sodium": 45,
            "vit_a": 3, "vit_c": 18, "calcium": 6, "iron": 11, "potassium": 220,
            "category": "Breakfast", "allergens": []
        },
        "fresh apple": {
            "calories": 52, "protein": 0.3, "carbs": 13.8, "fat": 0.2, "fiber": 2.4, "sugar": 10.4, "sodium": 1,
            "vit_a": 2, "vit_c": 8, "calcium": 1, "iron": 1, "potassium": 107,
            "category": "Fruit", "allergens": []
        },
        "mixed green salad": {
            "calories": 45, "protein": 1.8, "carbs": 5.2, "fat": 2.0, "fiber": 2.8, "sugar": 1.9, "sodium": 120,
            "vit_a": 42, "vit_c": 35, "calcium": 8, "iron": 9, "potassium": 290,
            "category": "Vegetable", "allergens": []
        },
        "classic burger and fries": {
            "calories": 295, "protein": 13.5, "carbs": 31.0, "fat": 14.2, "fiber": 2.1, "sugar": 4.8, "sodium": 620,
            "vit_a": 4, "vit_c": 6, "calcium": 8, "iron": 15, "potassium": 340,
            "category": "Fast Food", "allergens": ["Gluten (bun)", "Dairy (cheese, sauce)", "Sesame"]
        }
    }

    @classmethod
    def calculate_nutri_score(cls, calories: float, sugar: float, fat: float, sodium: float, fiber: float, protein: float) -> str:
        """
        Standardized Nutri-Score calculation (A, B, C, D, E) based on nutrient balance.
        """
        # Negative points (Energy, Sugar, Saturated/Total Fat, Sodium)
        points_energy = min(10, int(calories / 335.0))
        points_sugar = min(10, int(sugar / 4.5))
        points_fat = min(10, int(fat / 3.0))
        points_sodium = min(10, int(sodium / 90.0))
        negative_score = points_energy + points_sugar + points_fat + points_sodium

        # Positive points (Fiber, Protein)
        points_fiber = min(5, int(fiber / 0.9))
        points_protein = min(5, int(protein / 1.6))
        positive_score = points_fiber + points_protein

        total_nutri_points = negative_score - positive_score

        if total_nutri_points <= -1:
            return "A"
        elif total_nutri_points <= 2:
            return "B"
        elif total_nutri_points <= 10:
            return "C"
        elif total_nutri_points <= 18:
            return "D"
        else:
            return "E"

    @classmethod
    def get_nutrition_for_dish(cls, dish_name: str, portion_g: float = 250.0) -> NutritionAnalysisResponse:
        """Fetch or calculate realistic nutritional breakdown for a dish."""
        # Find matching dish or default to balanced generic dish
        key_match = None
        dish_lower = dish_name.lower().strip()
        for k in cls.FOOD_DATABASE:
            if k in dish_lower or dish_lower in k:
                key_match = k
                break

        if not key_match:
            # Heuristic estimation based on dish tokens
            if "salad" in dish_lower or "green" in dish_lower:
                base = cls.FOOD_DATABASE["mediterranean salad"]
            elif "salmon" in dish_lower or "fish" in dish_lower or "chicken" in dish_lower:
                base = cls.FOOD_DATABASE["chicken quinoa bowl"]
            elif "toast" in dish_lower or "egg" in dish_lower:
                base = cls.FOOD_DATABASE["avocado toast"]
            elif "apple" in dish_lower or "fruit" in dish_lower:
                base = cls.FOOD_DATABASE["fresh apple"]
            elif "burger" in dish_lower or "pizza" in dish_lower or "fried" in dish_lower:
                base = cls.FOOD_DATABASE["classic burger and fries"]
            else:
                base = cls.FOOD_DATABASE["chicken quinoa bowl"]
        else:
            base = cls.FOOD_DATABASE[key_match]

        scale = portion_g / 100.0

        cals = round(base["calories"] * scale, 1)
        prot = round(base["protein"] * scale, 1)
        carbs = round(base["carbs"] * scale, 1)
        fat = round(base["fat"] * scale, 1)
        fiber = round(base["fiber"] * scale, 1)
        sugar = round(base["sugar"] * scale, 1)
        sodium = round(base["sodium"] * scale, 1)

        nutri_score = cls.calculate_nutri_score(
            base["calories"], base["sugar"], base["fat"], base["sodium"], base["fiber"], base["protein"]
        )

        # Health score calculation (0 - 100)
        # Favors high protein/fiber, penalizes excessive saturated fat/sodium/sugar
        health_score = 75
        if nutri_score == "A":
            health_score = 92
        elif nutri_score == "B":
            health_score = 82
        elif nutri_score == "C":
            health_score = 68
        elif nutri_score == "D":
            health_score = 48
        else:
            health_score = 32

        # Adjust for fiber and protein density
        if prot > 20: health_score = min(98, health_score + 4)
        if fiber > 6: health_score = min(98, health_score + 4)
        if sodium > 800: health_score = max(20, health_score - 8)

        # Pros and cons
        pros = []
        cons = []
        if prot >= 15: pros.append(f"High protein content ({prot}g) supports muscle synthesis and satiety.")
        if fiber >= 4: pros.append(f"Excellent dietary fiber ({fiber}g) promotes optimal gut microbiome health.")
        if base["potassium"] > 300: pros.append("Rich in potassium for cardiovascular blood pressure regulation.")
        if len(pros) == 0: pros.append("Provides immediate caloric and carbohydrate energy.")

        if sodium > 500: cons.append(f"Elevated sodium level ({sodium}mg) - balance with plenty of water.")
        if sugar > 15: cons.append(f"Moderate to high simple sugars ({sugar}g).")
        if fat > 20: cons.append("Higher lipid density; monitor portion size if on low-fat regimen.")
        if len(cons) == 0: cons.append("No adverse nutrient concentrations detected.")

        rating_label = "Highly Nutritious" if health_score >= 80 else ("Nutritious & Balanced" if health_score >= 65 else ("Moderate Nutrition" if health_score >= 50 else "High-Calorie / Indulgence"))

        glycemic_index = "Low" if fiber >= 4 and sugar < 8 else ("Medium" if sugar < 15 else "High")

        daily_values = {
            "calories_pct": round((cals / 2000.0) * 100, 1),
            "protein_pct": round((prot / 50.0) * 100, 1),
            "carbs_pct": round((carbs / 275.0) * 100, 1),
            "fat_pct": round((fat / 78.0) * 100, 1),
            "fiber_pct": round((fiber / 28.0) * 100, 1),
            "sodium_pct": round((sodium / 2300.0) * 100, 1)
        }

        diet_compat = {
            "keto": bool(carbs < 15 and fat > 10),
            "high_protein": bool(prot >= 20),
            "low_calorie": bool(cals < 400),
            "vegan": bool(base.get("category") in ["Salad", "Fruit", "Vegetable"] and "Dairy" not in str(base.get("allergens")) and "Fish" not in str(base.get("allergens"))),
            "gluten_free": bool("Gluten" not in str(base.get("allergens")))
        }

        return NutritionAnalysisResponse(
            success=True,
            food_name=dish_name.title(),
            portion_size_g=portion_g,
            macros=Macronutrients(
                calories=cals,
                protein_g=prot,
                carbs_g=carbs,
                fat_g=fat,
                fiber_g=fiber,
                sugar_g=sugar,
                sodium_mg=sodium
            ),
            micros=Micronutrients(
                vitamin_a_pct=round(base["vit_a"] * scale, 1),
                vitamin_c_pct=round(base["vit_c"] * scale, 1),
                calcium_pct=round(base["calcium"] * scale, 1),
                iron_pct=round(base["iron"] * scale, 1),
                potassium_mg=round(base["potassium"] * scale, 1)
            ),
            health_assessment=HealthAssessment(
                health_score=health_score,
                nutri_score=nutri_score,
                rating_label=rating_label,
                glycemic_index=glycemic_index,
                pros=pros,
                cons=cons,
                dietary_compatibility=diet_compat
            ),
            daily_value_percentages=daily_values,
            allergen_alerts=base.get("allergens", []),
            ai_dietitian_note=f"{dish_name.title()} provides {cals} kcal across {portion_g}g. With a Nutri-Score of {nutri_score} and Health Score of {health_score}/100, it fits well into an active dietary routine."
        )

nutrition_service = NutritionService()
