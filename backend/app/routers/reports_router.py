from typing import Dict, Any, List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/reports", tags=["Actionable Reports & Insights"])

class ReportExportRequest(BaseModel):
    organization_name: str = "Grand Central Kitchen & Households"
    inspector_name: str = "FoodVerse AI Inspector"
    include_hygiene: bool = True
    include_nutrition: bool = True
    include_freshness: bool = True

@router.get("/dashboard-stats")
def get_dashboard_stats():
    """
    Returns aggregated KPIs, live safety alerts, and recent scan logs for the command center.
    """
    return {
        "kpis": {
            "total_food_scans": 1428,
            "avg_health_score": 84,
            "hygiene_compliance_pct": 93.4,
            "active_spoilage_alerts": 2,
            "recipes_guided": 312,
            "weekly_meals_planned": 168
        },
        "recent_activity": [
            {
                "id": "act-1",
                "time": "5 mins ago",
                "type": "FRESHNESS",
                "title": "Fresh Apple Produce Inspected",
                "status": "Fresh (Score: 94%)",
                "badge_color": "emerald"
            },
            {
                "id": "act-2",
                "time": "18 mins ago",
                "type": "HYGIENE",
                "title": "Prep Station 2 Temporal Video Audit",
                "status": "Grade A (93%)",
                "badge_color": "blue"
            },
            {
                "id": "act-3",
                "time": "42 mins ago",
                "type": "RECOGNITION",
                "title": "Mediterranean Quinoa Bowl Identified",
                "status": "Nutri-Score A (Score: 92/100)",
                "badge_color": "emerald"
            },
            {
                "id": "act-4",
                "time": "1 hour ago",
                "type": "ALERT",
                "title": "Oxidized Fruit Specimen Flagged",
                "status": "Moderately Fresh - Consume Soon",
                "badge_color": "amber"
            }
        ],
        "safety_alerts": [
            {
                "id": "alert-1",
                "level": "warning",
                "title": "Shelf Life Advisory",
                "message": "2 produce specimens in refrigeration unit reach threshold shelf life in 24 hours.",
                "action": "Prioritize in today's meal plan"
            },
            {
                "id": "alert-2",
                "level": "info",
                "title": "Hygiene Compliance Passing",
                "message": "Kitchen staff glove and hairnet compliance above 91% target over last 24h.",
                "action": "View Full Audit Report"
            }
        ]
    }

@router.post("/export")
def generate_executive_report(req: ReportExportRequest):
    """
    Generate structured executive food intelligence audit report ready for export / printing.
    """
    return {
        "success": True,
        "report_id": "FV-AUDIT-2026-X89",
        "generated_at": "October 25, 2026 19:55 UTC",
        "organization": req.organization_name,
        "auditor": req.inspector_name,
        "executive_summary": "Food Verse AI audit completed across food recognition, nutrient density, freshness classification, and kitchen hygiene compliance. Overall facility safety rating: 93.4% (Grade A Pass).",
        "hygiene_section": {
            "compliance_score": 93.4,
            "status": "Grade A Pass",
            "glove_usage": "91% Compliant",
            "hair_restraint": "98% Compliant",
            "cross_contamination_control": "Satisfactory (No critical cross-contact events)"
        },
        "nutrition_section": {
            "avg_meal_score": 84,
            "nutri_score_distribution": {"A": 55, "B": 30, "C": 12, "D": 3, "E": 0},
            "dietary_balance": "Optimal Protein-to-Fiber Ratio"
        },
        "freshness_section": {
            "fresh_inventory_pct": 88.5,
            "actionable_spoilage_count": 2,
            "waste_prevention_rate": "18.2% reduction in food waste"
        }
    }
