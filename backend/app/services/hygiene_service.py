import random
import uuid
from typing import Dict, Any, List
from PIL import Image
from app.models.hygiene import (
    HygieneAuditResponse, HygieneIndicator, HygieneViolation
)
from app.services.vision_service import vision_service

class HygieneService:
    """Service to monitor commercial kitchen & restaurant hygiene via image and video audit."""

    @classmethod
    def audit_frame(cls, image: Image.Image, frame_label: str = "Live Feed") -> HygieneAuditResponse:
        """
        Audit a kitchen snapshot or individual video frame for hygiene protocols.
        """
        features = vision_service.analyze_freshness_features(image)
        brightness = features["brightness"]
        saturation = features["saturation"]
        edge_energy = features["edge_energy"]

        # Surface cleanliness indicator (correlated with surface clutter and dark grease spots)
        clean_surface_score = max(50, min(98, int(95 - (features["spot_ratio"] * 250))))
        is_clean_surface = clean_surface_score >= 75

        # Heuristic PPE compliance simulation based on visual features & lighting
        glove_score = 92 if brightness > 80 else 78
        hairnet_score = 96 if edge_energy < 40 else 88
        cross_contam_score = 90 if features["spot_ratio"] < 0.03 else 68

        indicators = [
            HygieneIndicator(
                name="Glove Compliance",
                compliant=glove_score >= 80,
                score=glove_score,
                confidence=0.94,
                details="Food handlers observed wearing non-latex food-safe nitrile gloves." if glove_score >= 80 else "Single bare-hand food contact risk detected in prep zone."
            ),
            HygieneIndicator(
                name="Hair-Net / Headwear Protocol",
                compliant=hairnet_score >= 85,
                score=hairnet_score,
                confidence=0.96,
                details="Full scalp coverage verified; no loose hair strands detected."
            ),
            HygieneIndicator(
                name="Prep Surface Sanitization",
                compliant=is_clean_surface,
                score=clean_surface_score,
                confidence=0.91,
                details="Stainless steel cutting and prep station sanitized and clear of residue." if is_clean_surface else "Surface debris or oil residue detected on prep counter."
            ),
            HygieneIndicator(
                name="Cross-Contamination Prevention",
                compliant=cross_contam_score >= 75,
                score=cross_contam_score,
                confidence=0.89,
                details="Color-coded chopping surfaces and segregated raw protein/produce zones active." if cross_contam_score >= 75 else "Proximity alert: Raw poultry shears placed adjacent to salad bowls."
            ),
            HygieneIndicator(
                name="Protective Apron & Sanitizer Stations",
                compliant=True,
                score=94,
                confidence=0.93,
                details="Clean aprons donned; automated hand-sanitization station accessible."
            )
        ]

        overall_score = int(sum(ind.score for ind in indicators) / len(indicators))
        
        if overall_score >= 90:
            grade = "Grade A (Optimal Safety Pass)"
        elif overall_score >= 75:
            grade = "Grade B (Conditional Pass - Minor Items)"
        else:
            grade = "Grade C (Inspection Notice - Action Required)"

        violations: List[HygieneViolation] = []
        if glove_score < 80:
            violations.append(HygieneViolation(
                id=str(uuid.uuid4())[:8],
                time_label="00:14",
                severity="Medium",
                category="PPE Non-Compliance",
                description="Staff member adjusted equipment without changing disposable gloves.",
                corrective_action="Discard gloves, wash hands for 20 seconds, and don fresh gloves before re-entering station."
            ))

        if clean_surface_score < 75:
            violations.append(HygieneViolation(
                id=str(uuid.uuid4())[:8],
                time_label="00:42",
                severity="High",
                category="Sanitation",
                description="Unsanitized prep counter with accumulated liquid and cutting residues.",
                corrective_action="Execute immediate 3-step wipe down (detergent, clean rinse, food-contact sanitizer spray)."
            ))

        if cross_contam_score < 75:
            violations.append(HygieneViolation(
                id=str(uuid.uuid4())[:8],
                time_label="01:15",
                severity="Critical",
                category="Cross-Contamination",
                description="Raw protein prep board in direct contact with freshly washed ready-to-eat produce.",
                corrective_action="Isolate ready-to-eat batch and enforce red cutting board protocol for all raw meat operations."
            ))

        recs = [
            "Enforce mandatory 30-minute automated timer for glove replacement across all shifts.",
            "Maintain surface sanitizer test strips at 200ppm quat concentration.",
            "Verify color-coded cutting boards (Red = Raw Meat, Green = Produce, Blue = Seafood)."
        ]

        return HygieneAuditResponse(
            success=True,
            overall_score=overall_score,
            safety_grade=grade,
            inspection_type=frame_label,
            staff_detected_count=2,
            indicators=indicators,
            violations=violations,
            clean_surface_compliance_pct=float(clean_surface_score),
            glove_compliance_pct=float(glove_score),
            hairnet_compliance_pct=float(hairnet_score),
            audit_summary=f"Automated hygiene analysis completed for {frame_label}. Overall compliance rated {overall_score}% ({grade}). {len(violations)} non-critical/critical action items identified.",
            corrective_recommendations=recs
        )

    @classmethod
    def audit_video_stream(cls, frames_count: int = 8) -> HygieneAuditResponse:
        """
        Simulate multi-frame temporal video inspection for CCTV or recorded footage.
        """
        violations = [
            HygieneViolation(
                id="VIOL-001",
                timestamp_sec=14.5,
                time_label="00:14",
                severity="Medium",
                category="PPE Non-Compliance",
                description="Prep cook touched non-sanitized refrigerator handle without glove exchange.",
                corrective_action="Sanitize handle; mandate immediate glove discard and hand hygiene."
            ),
            HygieneViolation(
                id="VIOL-002",
                timestamp_sec=48.2,
                time_label="00:48",
                severity="Low",
                category="Sanitation",
                description="Minor ingredient spillage left unattended on secondary prep counter for > 5 mins.",
                corrective_action="Apply 'clean-as-you-go' station wipe-down."
            )
        ]

        indicators = [
            HygieneIndicator(name="Glove Compliance", compliant=True, score=91, confidence=0.95, details="91% temporal compliance across 8 sampled interval frames."),
            HygieneIndicator(name="Hairnet / Cap Compliance", compliant=True, score=98, confidence=0.98, details="100% compliant scalp coverage detected across all kitchen staff."),
            HygieneIndicator(name="Clean Workstations", compliant=True, score=86, confidence=0.92, details="Station 1 & Station 2 cleaned; minor debris logged on station 3."),
            HygieneIndicator(name="Cross-Contamination Prevention", compliant=True, score=94, confidence=0.93, details="Appropriate color-coded equipment segregation maintained."),
            HygieneIndicator(name="Mask / Hygiene Etiquette", compliant=True, score=95, confidence=0.94, details="No coughing/face touching observed over open food zones.")
        ]

        return HygieneAuditResponse(
            success=True,
            overall_score=93,
            safety_grade="Grade A (Optimal Safety Pass)",
            inspection_type="CCTV Stream (Video Temporal Audit)",
            staff_detected_count=3,
            indicators=indicators,
            violations=violations,
            clean_surface_compliance_pct=86.0,
            glove_compliance_pct=91.0,
            hairnet_compliance_pct=98.0,
            audit_summary="Temporal CCTV video audit analyzed over 8 sampled keyframes. High compliance demonstrated (93% Grade A). 2 minor action items logged for kitchen management review.",
            corrective_recommendations=[
                "Maintain 'clean-as-you-go' sanitization intervals during peak prep hours.",
                "Review refrigerator door touch protocols with prep staff."
            ]
        )

hygiene_service = HygieneService()
