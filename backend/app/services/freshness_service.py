from typing import Dict, Any, List
from PIL import Image
from app.models.freshness import FreshnessResponse, FreshnessMetrics
from app.services.vision_service import vision_service

class FreshnessService:
    """Service to evaluate food freshness, surface degradation, and shelf-life prediction."""

    CATEGORY_DEFAULTS = {
        "fruit": {"shelf_life_fresh": 7, "temp": "4-7°C, ventilated crisper drawer"},
        "vegetable": {"shelf_life_fresh": 6, "temp": "2-4°C, high humidity drawer (85-95%)"},
        "meat": {"shelf_life_fresh": 3, "temp": "0-2°C, lowest refrigerator shelf in sealed pack"},
        "dairy": {"shelf_life_fresh": 5, "temp": "1-3°C, internal shelf away from door"},
        "bakery": {"shelf_life_fresh": 4, "temp": "18-20°C, bread box or airtight container"},
        "prepared": {"shelf_life_fresh": 3, "temp": "2-4°C, airtight glass container"}
    }

    @classmethod
    def analyze_image_freshness(cls, image: Image.Image, item_hint: str = "produce") -> FreshnessResponse:
        """Analyze freshness metrics directly from image."""
        features = vision_service.analyze_freshness_features(image)
        score = features["freshness_score"]

        # Infer category
        hint_lower = item_hint.lower()
        category = "vegetable"
        for cat in ["fruit", "vegetable", "meat", "dairy", "bakery", "prepared"]:
            if cat in hint_lower:
                category = cat
                break
        
        cat_info = cls.CATEGORY_DEFAULTS.get(category, cls.CATEGORY_DEFAULTS["vegetable"])
        max_shelf_life = cat_info["shelf_life_fresh"]

        # Classification
        if score >= 80:
            stage = "Fresh"
            safety_status = "Safe to Consume"
            shelf_life_days = max(3, int(round(max_shelf_life * (score / 100.0))))
            visual_indicators = [
                "Vibrant natural coloration with high uniformity",
                "Firm surface with no visible fungal growth or wrinkling",
                "Optimal cellular hydration and texture structure"
            ]
            storage_recs = [
                f"Store at {cat_info['temp']}",
                "Keep away from high-ethylene producers (e.g. ripe apples, bananas) if leafy",
                "Maintain dry surface to prevent premature microbial germination"
            ]
            health_risks = ["None detected. Peak nutritional bioavailability."]
            ai_summary = "Item demonstrates high cellular integrity, balanced color distribution, and no detectable fungal or oxidation markers. Safe for immediate or regular consumption."

        elif score >= 45:
            stage = "Moderately Fresh"
            safety_status = "Consume Promptly"
            shelf_life_days = max(1, int(round(max_shelf_life * 0.35)))
            visual_indicators = [
                "Mild surface oxidation / slight enzymatic browning noted",
                "Beginning of moisture loss and subtle surface micro-creasing",
                "Reduced pigment vibrancy"
            ]
            storage_recs = [
                "Consume within 24 to 48 hours for optimal safety and taste",
                "Store in airtight container at 1-3°C to suppress aerobic bacteria",
                "Consider using in cooked dishes, soups, or smoothies rather than raw"
            ]
            health_risks = [
                "Mild nutritional degradation (Vitamin C / Antioxidants)",
                "Low to moderate spoilage organism growth; heat thoroughly before ingestion"
            ]
            ai_summary = "Item exhibits minor oxidation and early texture degradation. Still within safe consumable parameters, but recommended to prepare or refrigerate promptly."

        else:
            stage = "Spoiled"
            safety_status = "Unsafe - Discard"
            shelf_life_days = 0
            visual_indicators = [
                "Severe enzymatic discoloration and localized necrotic patches",
                "High texture degradation, soft spots, and micro-fissuring",
                "Fungal mold spores or bacterial slime pattern detected"
            ]
            storage_recs = [
                "Do not consume or store with other fresh produce",
                "Discard immediately into compost or sealed waste disposal",
                "Sanitize contact surfaces and storage bin to avoid spore transfer"
            ]
            health_risks = [
                "High risk of mycotoxins (e.g., Patulin, Aflatoxin) and foodborne pathogens",
                "Gastrointestinal infection, nausea, bacterial toxins"
            ]
            ai_summary = "Critical spoilage markers identified: prominent discoloration, texture breakdown, and potential fungal colonization. Immediate disposal recommended to prevent cross-contamination."

        metrics = FreshnessMetrics(
            freshness_percentage=float(score),
            discoloration_index=features["discoloration_index"],
            texture_degradation=features["texture_degradation"],
            spot_mold_detected=features["mold_detected"],
            color_uniformity=features["color_uniformity"]
        )

        display_name = item_hint.title() if item_hint and item_hint != "produce" else "Food Specimen"

        return FreshnessResponse(
            success=True,
            item_name=display_name,
            category=category.title(),
            stage=stage,
            safety_status=safety_status,
            estimated_shelf_life_days=shelf_life_days,
            freshness_score=score,
            metrics=metrics,
            visual_indicators=visual_indicators,
            storage_recommendations=storage_recs,
            health_risks=health_risks,
            optimal_storage_conditions=cat_info["temp"],
            ai_analysis_summary=ai_summary
        )

freshness_service = FreshnessService()
