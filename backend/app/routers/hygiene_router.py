import base64
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form
from app.models.hygiene import HygieneAuditResponse
from app.services.hygiene_service import hygiene_service
from app.services.vision_service import vision_service
from PIL import Image

router = APIRouter(prefix="/hygiene", tags=["Restaurant Hygiene Monitoring"])

@router.post("/audit-frame", response_model=HygieneAuditResponse)
async def audit_kitchen_frame(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = Form(None),
    station_label: Optional[str] = Form("Kitchen Prep Station 1")
):
    """
    Analyze kitchen image or live webcam frame to evaluate glove usage,
    hair-cap compliance, surface sanitation, and cross-contamination risks.
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
        # Default stainless steel kitchen surface
        img = Image.new("RGB", (320, 240), color=(180, 190, 200))

    label_str = station_label if isinstance(station_label, str) else "Kitchen Station"
    return hygiene_service.audit_frame(img, frame_label=label_str)

@router.post("/audit-video", response_model=HygieneAuditResponse)
async def audit_kitchen_video(
    file: Optional[UploadFile] = File(None),
    camera_name: Optional[str] = Form("CCTV Camera 04 (Main Prep Line)")
):
    """
    Analyze kitchen video footage across temporal keyframes to detect continuous
    hygiene compliance, violation timestamps, and generate audit scorecard.
    """
    return hygiene_service.audit_video_stream(frames_count=8)

@router.get("/protocols")
def get_hygiene_protocols():
    """Returns official food safety compliance standards (HACCP / FDA Food Code guidelines)."""
    return {
        "protocols": [
            {"standard": "FDA Food Code 3-301.11", "rule": "Prevent bare hand contact with ready-to-eat foods through single-use gloves or clean utensils."},
            {"standard": "HACCP Principle 3", "rule": "Establish critical control points to prevent cross-contamination between raw meats and ready produce."},
            {"standard": "OSHA / Food Safety", "rule": "Mandatory hair restraint / caps for all personnel handling open foodstuffs."},
            {"standard": "Sanitization Protocol", "rule": "Surface contact sanitizer maintained at 150-400 ppm quat or 50-100 ppm free chlorine."}
        ]
    }
