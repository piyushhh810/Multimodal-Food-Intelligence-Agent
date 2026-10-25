import io
import math
from typing import Dict, Any, Tuple, Optional
from PIL import Image, ImageStat, ImageFilter
import numpy as np

class VisionService:
    """Computer vision analysis service for food images, freshness, and video frame hygiene."""

    @staticmethod
    def load_image(image_bytes: bytes) -> Image.Image:
        """Load and convert image to RGB PIL Image."""
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != "RGB":
            img = img.convert("RGB")
        return img

    @classmethod
    def analyze_freshness_features(cls, image: Image.Image) -> Dict[str, Any]:
        """
        Analyze visual characteristics: color distribution, surface discoloration,
        brown/dark decay spots, and texture entropy.
        """
        # Resize for consistent rapid analysis
        img_small = image.resize((256, 256))
        np_img = np.array(img_small, dtype=np.float32)

        r = np_img[:, :, 0]
        g = np_img[:, :, 1]
        b = np_img[:, :, 2]

        # 1. Color brightness and saturation
        brightness = float(np.mean(0.299 * r + 0.587 * g + 0.114 * b))
        
        # Approximate saturation
        max_c = np.maximum(np.maximum(r, g), b)
        min_c = np.minimum(np.minimum(r, g), b)
        delta = max_c - min_c
        saturation = float(np.mean(np.where(max_c > 0, delta / (max_c + 1e-5), 0))) * 100

        # 2. Browning / Oxidation detection (characteristic brown / dark yellow decay)
        # R is high, G is moderate, B is low, and brightness is lower than vibrant fresh produce
        is_brown = (r > 70) & (r < 180) & (g > 40) & (g < 130) & (b < 70) & (r > g) & (g > b)
        brown_ratio = float(np.sum(is_brown)) / (256.0 * 256.0)

        # 3. Dark spots / Mold / Rot detection (very low brightness or localized gray/fuzzy patches)
        is_dark_spot = (brightness > 40) & (r < 55) & (g < 55) & (b < 55)
        spot_ratio = float(np.sum(is_dark_spot)) / (256.0 * 256.0)

        # Mold fuzzy bluish/greenish or grey clusters
        is_mold_tint = (b > g) & (b > r) & (delta < 30) & (brightness > 40) & (brightness < 160)
        mold_tint_ratio = float(np.sum(is_mold_tint)) / (256.0 * 256.0)

        # 4. Texture degradation / surface wrinkling using edge filter
        edges = img_small.filter(ImageFilter.FIND_EDGES)
        edge_stat = ImageStat.Stat(edges)
        edge_energy = float(np.mean(edge_stat.mean)) # Higher edge roughness indicates wrinkling or surface fissures

        # 5. Color uniformity
        color_std = float(np.mean(ImageStat.Stat(img_small).stddev))
        color_uniformity = max(0.0, min(100.0, 100.0 - (color_std * 0.8)))

        # Composite discoloration index (0-100)
        discoloration_index = min(100.0, (brown_ratio * 180.0) + (spot_ratio * 300.0) + (mold_tint_ratio * 200.0))
        
        # Texture degradation index (0-100)
        texture_degradation = min(100.0, max(5.0, (edge_energy - 10.0) * 2.8))

        # Freshness score (0-100)
        decay_factor = (discoloration_index * 0.6) + (texture_degradation * 0.4)
        freshness_score = max(5.0, min(98.0, 98.0 - decay_factor))

        return {
            "brightness": round(brightness, 1),
            "saturation": round(saturation, 1),
            "brown_ratio": round(brown_ratio, 3),
            "spot_ratio": round(spot_ratio, 3),
            "mold_detected": bool(spot_ratio > 0.04 or mold_tint_ratio > 0.08 or discoloration_index > 45),
            "edge_energy": round(edge_energy, 2),
            "color_uniformity": round(color_uniformity, 1),
            "discoloration_index": round(discoloration_index, 1),
            "texture_degradation": round(texture_degradation, 1),
            "freshness_score": int(round(freshness_score))
        }

    @classmethod
    def identify_visual_signature(cls, image: Image.Image) -> Dict[str, Any]:
        """
        Extract dominant color and texture profile to assist offline dish classification.
        """
        img_small = image.resize((128, 128))
        stat = ImageStat.Stat(img_small)
        mean_r, mean_g, mean_b = stat.mean[:3]

        # Determine dominant hue profile
        total = mean_r + mean_g + mean_b + 1e-5
        r_ratio = mean_r / total
        g_ratio = mean_g / total
        b_ratio = mean_b / total

        profile = "balanced"
        if g_ratio > 0.42:
            profile = "leafy_greens"
        elif r_ratio > 0.45 and g_ratio < 0.35:
            profile = "red_fruit_or_tomato_dish"
        elif r_ratio > 0.38 and g_ratio > 0.35 and b_ratio < 0.22:
            profile = "grain_pasta_curry_or_citrus"
        elif mean_r > 160 and mean_g > 160 and mean_b > 160:
            profile = "dairy_or_rice"

        return {
            "profile": profile,
            "rgb_means": [round(mean_r, 1), round(mean_g, 1), round(mean_b, 1)],
            "r_ratio": round(r_ratio, 2),
            "g_ratio": round(g_ratio, 2),
            "b_ratio": round(b_ratio, 2)
        }

vision_service = VisionService()
