import base64
import io
from typing import Optional
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Form
from app.models.freshness import FreshnessResponse
from app.services.freshness_service import freshness_service
from app.services.vision_service import vision_service

router = APIRouter(prefix="/freshness", tags=["Food Freshness Detection"])

@router.post("/inspect", response_model=FreshnessResponse)
async def inspect_food_freshness(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    item_hint: Optional[str] = Form("produce")
):
    """
    Analyze visual characteristics such as color, texture, discoloration,
    and surface patterns to classify food as Fresh, Moderately Fresh, or Spoiled.
    """
    if file and hasattr(file, "read"):
        image_bytes = await file.read()
        img = vision_service.load_image(image_bytes)
    elif image_base64 and isinstance(image_base64, str):
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
        img = vision_service.load_image(image_bytes)
    else:
        # Default fresh sample
        img = Image.new("RGB", (300, 300), color=(180, 220, 80))

    hint_str = item_hint if isinstance(item_hint, str) else "produce"
    return freshness_service.analyze_image_freshness(img, item_hint=hint_str)

@router.get("/stages-guide")
def get_freshness_stages_guide():
    """Returns scientific breakdown of freshness stages and microbial risk parameters."""
    return {
        "stages": [
            {
                "stage": "Fresh",
                "score_range": "80 - 100%",
                "status": "Safe to Consume",
                "action": "Immediate consumption or regular cold storage.",
                "color_indicator": "emerald"
            },
            {
                "stage": "Moderately Fresh",
                "score_range": "45 - 79%",
                "status": "Consume Promptly",
                "action": "Cook thoroughly or consume within 24-48 hours.",
                "color_indicator": "amber"
            },
            {
                "stage": "Spoiled / Decayed",
                "score_range": "0 - 44%",
                "status": "Unsafe - Discard",
                "action": "Dispose immediately to avoid mycotoxins and spore contamination.",
                "color_indicator": "rose"
            }
        ]
    }
