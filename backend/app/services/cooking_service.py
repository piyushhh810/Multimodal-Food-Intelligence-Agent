from typing import List, Dict, Any, Optional
from app.models.cooking import (
    RecipeGuideResponse, CookingStep, IngredientItem, IngredientSubstitution
)

class CookingService:
    """Service providing smart interactive recipes, voice guidance, timers, and ingredient substitutions."""

    RECIPES: Dict[str, Dict[str, Any]] = {
        "mediterranean bowl": {
            "title": "Zesty Mediterranean Quinoa Power Bowl",
            "cuisine": "Mediterranean",
            "difficulty": "Easy",
            "prep_min": 15,
            "cook_min": 20,
            "servings": 2,
            "calories": 420,
            "description": "A vibrant, nutrient-dense bowl packed with warm fluffy quinoa, crisp cucumbers, cherry tomatoes, kalamata olives, and creamy garlic tahini dressing.",
            "ingredients": [
                {"name": "Quinoa (rinsed)", "amount": "1 cup", "notes": "Tri-color or white"},
                {"name": "Water or Vegetable Broth", "amount": "2 cups"},
                {"name": "Cherry Tomatoes", "amount": "1 cup, halved"},
                {"name": "English Cucumber", "amount": "1 cup, diced"},
                {"name": "Kalamata Olives", "amount": "1/3 cup, pitted"},
                {"name": "Chickpeas (cooked/canned)", "amount": "1 cup, drained"},
                {"name": "Extra Virgin Olive Oil", "amount": "2 tbsp"},
                {"name": "Lemon Juice", "amount": "2 tbsp, freshly squeezed"},
                {"name": "Tahini", "amount": "2 tbsp"},
                {"name": "Garlic", "amount": "1 clove, minced"}
            ],
            "steps": [
                {
                    "step_number": 1,
                    "title": "Cook the Fluffy Quinoa",
                    "instruction": "Add rinsed quinoa and water/broth with a pinch of sea salt into a medium saucepan. Bring to a boil over medium-high heat.",
                    "voice_guidance": "Let's start by boiling one cup of rinsed quinoa with two cups of broth or water.",
                    "timer_seconds": 300,
                    "chef_tip": "Rinsing quinoa in a fine-mesh sieve removes the natural bitter saponin coating.",
                    "technique": "Boiling / Absorption"
                },
                {
                    "step_number": 2,
                    "title": "Simmer & Steam",
                    "instruction": "Once boiling, reduce the heat to low, cover with a tight lid, and simmer for 15 minutes until liquid is fully absorbed. Remove from heat and rest covered for 5 minutes.",
                    "voice_guidance": "Cover with a lid and simmer on low for fifteen minutes. I've set a fifteen minute timer for you.",
                    "timer_seconds": 900,
                    "chef_tip": "Leaving the lid on during the 5-minute resting phase creates ultra-fluffy grains.",
                    "technique": "Steam absorption"
                },
                {
                    "step_number": 3,
                    "title": "Chop Produce & Whisk Dressing",
                    "instruction": "While quinoa simmers, dice the cucumber, halve the cherry tomatoes, and whisk tahini, olive oil, lemon juice, minced garlic, and 2 tbsp warm water into a smooth emulsified dressing.",
                    "voice_guidance": "Now dice your cucumbers and tomatoes, and whisk the tahini, lemon juice, garlic, and olive oil until silky smooth.",
                    "timer_seconds": 240,
                    "chef_tip": "If tahini seizes when adding lemon juice, simply keep whisking with warm water.",
                    "technique": "Emulsification"
                },
                {
                    "step_number": 4,
                    "title": "Assemble the Power Bowl",
                    "instruction": "Fluff quinoa with a fork and divide between two serving bowls. Arrange sections of cucumber, tomatoes, olives, and chickpeas on top. Drizzle generously with garlic tahini dressing and enjoy warm or chilled.",
                    "voice_guidance": "Fluff the quinoa, assemble your toppings, and drizzle the dressing. Your Mediterranean Power Bowl is ready!",
                    "timer_seconds": 60,
                    "chef_tip": "Top with toasted pine nuts or fresh mint leaves for elevated aroma and crunch.",
                    "technique": "Plating"
                }
            ],
            "substitutions": [
                {"original": "Tahini", "substitute": "Greek Yogurt or Hummus", "ratio": "1:1", "category": "Dairy / Nut-Free", "flavor_impact": "Adds creamy tang while preserving Mediterranean profile"},
                {"original": "Quinoa", "substitute": "Brown Rice or Couscous", "ratio": "1:1", "category": "Pantry Quick Swap", "flavor_impact": "Mild and hearty, matches the texture well"},
                {"original": "Chickpeas", "substitute": "Grilled Tofu or Shredded Chicken", "ratio": "1 cup", "category": "High-Protein", "flavor_impact": "Boosts protein content by 15-20g"}
            ]
        },
        "grilled salmon": {
            "title": "Pan-Seared Crispy Salmon with Garlic Asparagus",
            "cuisine": "Contemporary American / Seafood",
            "difficulty": "Intermediate",
            "prep_min": 10,
            "cook_min": 12,
            "servings": 2,
            "calories": 460,
            "description": "Golden crispy-skin salmon fillets served alongside tender, blistered garlic spears of asparagus and fresh lemon herb butter.",
            "ingredients": [
                {"name": "Salmon Fillets (skin-on)", "amount": "2 fillets (6 oz each)"},
                {"name": "Fresh Asparagus", "amount": "1 bunch, woody ends trimmed"},
                {"name": "Avocado Oil or Olive Oil", "amount": "1.5 tbsp"},
                {"name": "Garlic", "amount": "3 cloves, thinly sliced"},
                {"name": "Butter", "amount": "1 tbsp"},
                {"name": "Fresh Lemon", "amount": "1, cut into wedges"},
                {"name": "Kosher Salt & Cracked Black Pepper", "amount": "To taste"}
            ],
            "steps": [
                {
                    "step_number": 1,
                    "title": "Pat Dry & Season the Salmon",
                    "instruction": "Thoroughly pat the salmon skin and flesh completely dry using paper towels. Season both sides generously with salt and pepper.",
                    "voice_guidance": "Dry your salmon fillets thoroughly with paper towels. A dry skin is the secret to maximum crispiness.",
                    "timer_seconds": 120,
                    "chef_tip": "Moisture is the enemy of crisp skin. Dry thoroughly before hot oil contact.",
                    "technique": "Surface prep"
                },
                {
                    "step_number": 2,
                    "title": "Crisp the Skin",
                    "instruction": "Heat a heavy skillet over medium-high heat with avocado oil until shimmering. Place salmon skin-side down, press gently with a spatula for 10 seconds, and cook undisturbed for 4 minutes.",
                    "voice_guidance": "Place salmon skin-side down in the hot skillet. Press gently for ten seconds, then let it sear for four minutes.",
                    "timer_seconds": 240,
                    "chef_tip": "Do not move the fish until the skin releases naturally from the pan.",
                    "technique": "High-heat searing"
                },
                {
                    "step_number": 3,
                    "title": "Flip & Sauté Asparagus",
                    "instruction": "Flip salmon fillets carefully. Add butter, sliced garlic, and asparagus spears around the salmon in the pan. Sauté for 3 minutes while basting fish with melted butter.",
                    "voice_guidance": "Flip the salmon, add butter, garlic, and asparagus to the pan, and baste for three minutes.",
                    "timer_seconds": 180,
                    "chef_tip": "Basting with garlic butter infuses moisture without making the crispy skin soggy.",
                    "technique": "Butter basting (Arrosé)"
                },
                {
                    "step_number": 4,
                    "title": "Rest & Serve with Fresh Lemon",
                    "instruction": "Transfer salmon and asparagus to warm plates. Squeeze fresh lemon juice over the top and spoon pan juices over the spears. Serve immediately.",
                    "voice_guidance": "Plate the salmon and tender asparagus, finish with a squeeze of fresh lemon, and serve!",
                    "timer_seconds": 60,
                    "chef_tip": "Internal temperature should reach 125-130°F for a luscious medium center.",
                    "technique": "Finishing"
                }
            ],
            "substitutions": [
                {"original": "Butter", "substitute": "Extra Virgin Olive Oil", "ratio": "1:1", "category": "Dairy-Free / Heart Healthy", "flavor_impact": "Clean, herbal finish with monounsaturated fats"},
                {"original": "Salmon", "substitute": "Firm Tofu or Rainbow Trout", "ratio": "1:1", "category": "Vegan / Alternative", "flavor_impact": "Press tofu well and season with nori flakes for ocean umami"}
            ]
        }
    }

    SUBSTITUTION_DICTIONARY: Dict[str, List[IngredientSubstitution]] = {
        "egg": [
            IngredientSubstitution(original="Egg", substitute="Flax Egg (1 tbsp ground flax + 3 tbsp water)", ratio="1:1", category="Vegan", flavor_impact="Nutty and excellent binding in baked goods"),
            IngredientSubstitution(original="Egg", substitute="Unsweetened Applesauce (1/4 cup)", ratio="1:1", category="Low-Calorie", flavor_impact="Adds moisture without cholesterol"),
            IngredientSubstitution(original="Egg", substitute="Aquafaba (chickpea water, 3 tbsp)", ratio="1:1", category="Vegan", flavor_impact="Whips and binds identically to egg whites")
        ],
        "dairy milk": [
            IngredientSubstitution(original="Dairy Milk", substitute="Oat Milk", ratio="1:1", category="Dairy-Free", flavor_impact="Creamy texture with subtle oat sweetness"),
            IngredientSubstitution(original="Dairy Milk", substitute="Unsweetened Almond Milk", ratio="1:1", category="Low-Calorie", flavor_impact="Light profile, 30 calories per cup"),
            IngredientSubstitution(original="Dairy Milk", substitute="Soy Milk", ratio="1:1", category="High-Protein", flavor_impact="Equivalent 7-8g protein per cup with neutral taste")
        ],
        "butter": [
            IngredientSubstitution(original="Butter", substitute="Extra Virgin Olive Oil", ratio="3/4 cup per 1 cup butter", category="Heart Healthy", flavor_impact="Rich fruity notes, lowers saturated fats"),
            IngredientSubstitution(original="Butter", substitute="Coconut Oil", ratio="1:1", category="Vegan", flavor_impact="Solid at room temperature, subtle tropical note"),
            IngredientSubstitution(original="Butter", substitute="Mashed Avocado", ratio="1:1", category="Nutrient-Dense", flavor_impact="Creamy texture, rich in potassium and Vitamin E")
        ],
        "all-purpose flour": [
            IngredientSubstitution(original="All-Purpose Flour", substitute="Almond Flour", ratio="1:1 (reduce liquid slightly)", category="Gluten-Free / Keto", flavor_impact="Tender crumb with healthy fats and low carbs"),
            IngredientSubstitution(original="All-Purpose Flour", substitute="1-to-1 Gluten-Free Flour Blend", ratio="1:1", category="Gluten-Free", flavor_impact="Maintains traditional baking structure"),
            IngredientSubstitution(original="All-Purpose Flour", substitute="Oat Flour (ground oats)", ratio="1:1", category="High-Fiber", flavor_impact="Wholesome flavor, higher soluble fiber")
        ],
        "sugar": [
            IngredientSubstitution(original="Sugar", substitute="Monk Fruit / Erythritol Blend", ratio="1:1", category="Zero-Calorie / Keto", flavor_impact="Zero glycemic index, natural sweetness"),
            IngredientSubstitution(original="Sugar", substitute="Pure Maple Syrup or Honey", ratio="3/4 cup per 1 cup sugar", category="Unrefined Natural", flavor_impact="Rich depth of caramel floral notes")
        ]
    }

    @classmethod
    def get_recipe_guide(cls, dish_query: str = "mediterranean bowl") -> RecipeGuideResponse:
        """Find or assemble recipe guide with timers and voice steps."""
        query_lower = dish_query.lower()
        key_match = "mediterranean bowl"
        for k in cls.RECIPES:
            if k in query_lower or query_lower in k:
                key_match = k
                break

        data = cls.RECIPES[key_match]

        steps = [
            CookingStep(
                step_number=s["step_number"],
                title=s["title"],
                instruction=s["instruction"],
                voice_guidance=s["voice_guidance"],
                timer_seconds=s.get("timer_seconds"),
                chef_tip=s.get("chef_tip"),
                technique=s.get("technique")
            )
            for s in data["steps"]
        ]

        ingredients = [
            IngredientItem(name=i["name"], amount=i["amount"], notes=i.get("notes"))
            for i in data["ingredients"]
        ]

        substitutions = [
            IngredientSubstitution(
                original=sub["original"],
                substitute=sub["substitute"],
                ratio=sub["ratio"],
                category=sub["category"],
                flavor_impact=sub["flavor_impact"]
            )
            for sub in data.get("substitutions", [])
        ]

        return RecipeGuideResponse(
            success=True,
            recipe_title=data["title"],
            description=data["description"],
            cuisine=data["cuisine"],
            difficulty=data["difficulty"],
            prep_time_minutes=data["prep_min"],
            cook_time_minutes=data["cook_min"],
            servings=data["servings"],
            ingredients=ingredients,
            steps=steps,
            substitutions=substitutions,
            chef_notes="Equipped with hands-free voice commands: 'Next step', 'Previous step', and automated timer triggers.",
            estimated_calories_per_serving=data["calories"]
        )

    @classmethod
    def find_substitutions(cls, ingredient_name: str) -> List[IngredientSubstitution]:
        """Find healthy and dietary alternatives for a given ingredient."""
        name_lower = ingredient_name.lower().strip()
        for k, subs in cls.SUBSTITUTION_DICTIONARY.items():
            if k in name_lower or name_lower in k:
                return subs

        # Default smart substitution if not explicitly indexed
        return [
            IngredientSubstitution(
                original=ingredient_name.title(),
                substitute=f"Organic cold-pressed alternative or seasonal produce for {ingredient_name.title()}",
                ratio="1:1",
                category="Smart Healthy Swap",
                flavor_impact="Maintains core dish integrity while lowering additives"
            )
        ]

cooking_service = CookingService()
