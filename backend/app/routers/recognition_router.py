import base64
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Header
from app.models.recognition import RecognitionResponse
from app.services.ai_service import ai_service
from app.services.vision_service import vision_service

router = APIRouter(prefix="/recognition", tags=["Food Recognition"])

@router.post("/analyze", response_model=RecognitionResponse)
async def analyze_food_image(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    """
    Upload a food image or provide base64 webcam frame to automatically identify dishes,
    ingredients, confidence scores, and visual bounding indicators.
    """
    image_bytes = None
    if file and hasattr(file, "read"):
        image_bytes = await file.read()
    elif image_base64 and isinstance(image_base64, str):
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
    else:
        # Fallback to sample synthetic image
        from PIL import Image
        import io
        img = Image.new("RGB", (300, 300), color=(120, 180, 80))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        image_bytes = buf.getvalue()

    api_key_str = x_api_key if isinstance(x_api_key, str) else None
    return await ai_service.recognize_food(image_bytes, custom_api_key=api_key_str)

@router.get("/samples")
def get_sample_dishes():
    """Returns sample recognition dishes for 1-click evaluation."""
    return [
        {"id": "salad", "title": "Mediterranean Quinoa Salad", "category": "Salad", "caloric_est": 380},
        {"id": "salmon", "title": "Pan-Seared Salmon & Asparagus", "category": "Seafood", "caloric_est": 460},
        {"id": "apple", "title": "Fresh Honeycrisp Apple", "category": "Fruit", "caloric_est": 95},
        {"id": "bowl", "title": "Golden Protein Grain Bowl", "category": "Power Bowl", "caloric_est": 510}
    ]
