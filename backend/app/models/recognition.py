from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x: float = Field(..., description="Top left x normalized (0-100)")
    y: float = Field(..., description="Top left y normalized (0-100)")
    width: float = Field(..., description="Width normalized (0-100)")
    height: float = Field(..., description="Height normalized (0-100)")
    label: str

class DetectedFoodItem(BaseModel):
    name: str
    confidence: float
    category: str
    estimated_portion_g: float = 150.0
    bounding_box: Optional[BoundingBox] = None
    ingredients: List[str] = []

class RecognitionResponse(BaseModel):
    success: bool = True
    dish_name: str
    primary_category: str
    cuisine_type: str
    confidence_score: float
    detected_items: List[DetectedFoodItem] = []
    visual_tags: List[str] = []
    preparation_state: str = "Cooked"
    dietary_suitability: List[str] = [] # Vegetarian, Vegan, Gluten-free, etc.
    ai_reasoning: str = ""
    engine_used: str = "hybrid-food-vision"
