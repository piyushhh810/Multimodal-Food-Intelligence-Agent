from typing import List, Optional
from pydantic import BaseModel, Field

class FreshnessMetrics(BaseModel):
    freshness_percentage: float = Field(..., ge=0, le=100)
    discoloration_index: float = Field(..., ge=0, le=100)
    texture_degradation: float = Field(..., ge=0, le=100)
    spot_mold_detected: bool = False
    color_uniformity: float = Field(..., ge=0, le=100)

class FreshnessResponse(BaseModel):
    success: bool = True
    item_name: str
    category: str
    stage: str # "Fresh", "Moderately Fresh", "Spoiled"
    safety_status: str # "Safe to Consume", "Consume Promptly", "Unsafe - Discard"
    estimated_shelf_life_days: int
    freshness_score: int # 0 to 100
    metrics: FreshnessMetrics
    visual_indicators: List[str] = []
    storage_recommendations: List[str] = []
    health_risks: List[str] = []
    optimal_storage_conditions: str = "Refrigerate at 2-4°C in sealed breathable container"
    ai_analysis_summary: str = ""
