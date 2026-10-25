from typing import List, Optional
from pydantic import BaseModel, Field

class HygieneIndicator(BaseModel):
    name: str
    compliant: bool
    score: int = Field(..., ge=0, le=100)
    confidence: float
    details: str

class HygieneViolation(BaseModel):
    id: str
    timestamp_sec: Optional[float] = None
    time_label: Optional[str] = "00:00"
    severity: str # "Low", "Medium", "High", "Critical"
    category: str # "PPE Non-Compliance", "Cross-Contamination", "Sanitation", "Food Storage"
    description: str
    corrective_action: str

class HygieneAuditResponse(BaseModel):
    success: bool = True
    overall_score: int = Field(..., ge=0, le=100)
    safety_grade: str # Grade A (90-100), Grade B (75-89), Grade C (<75)
    inspection_type: str = "Image / Video Analysis"
    staff_detected_count: int = 1
    indicators: List[HygieneIndicator] = []
    violations: List[HygieneViolation] = []
    clean_surface_compliance_pct: float = 85.0
    glove_compliance_pct: float = 90.0
    hairnet_compliance_pct: float = 95.0
    audit_summary: str = ""
    corrective_recommendations: List[str] = []
    auditor_signature: str = "FoodVerse AI Automated Safety Inspector"
