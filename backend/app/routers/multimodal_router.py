import base64
from typing import Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, Header
from pydantic import BaseModel
from app.services.audio_service import audio_service
from app.services.ai_service import ai_service
from app.services.nutrition_service import nutrition_service

router = APIRouter(prefix="/multimodal", tags=["Multimodal AI Engine"])

class VoiceCommandRequest(BaseModel):
    transcript: str

@router.post("/voice-command")
def process_voice_command(request: VoiceCommandRequest):
    """
    Process spoken natural language audio transcript to extract FoodVerse intent,
    parameters (such as timer durations or substitutions), and audio feedback speech.
    """
    return audio_service.parse_voice_command(request.transcript)

@router.post("/query")
async def process_multimodal_query(
    query_text: str = Form(...),
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-Key")
):
    """
    Unified multimodal intelligence combining image vision and text/speech prompt.
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()
    elif image_base64:
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)

    # If image provided, run recognition first
    recognition = None
    if image_bytes:
        recognition = await ai_service.recognize_food(image_bytes, custom_api_key=x_api_key)

    dish = recognition.dish_name if recognition else "Identified Food"
    nutrition = nutrition_service.get_nutrition_for_dish(dish)

    response_text = (
        f"Analyzed query: '{query_text}'. "
        f"Recognized: {dish} ({recognition.primary_category if recognition else 'Food Item'}). "
        f"Nutritional estimate: {nutrition.macros.calories} kcal, {nutrition.macros.protein_g}g Protein, Nutri-Score {nutrition.health_assessment.nutri_score}."
    )

    return {
        "success": True,
        "query": query_text,
        "ai_response": response_text,
        "recognition": recognition,
        "nutrition": nutrition
    }
