from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import (
    recognition_router,
    nutrition_router,
    freshness_router,
    hygiene_router,
    cooking_router,
    mealplan_router,
    multimodal_router,
    reports_router
)

app = FastAPI(
    title="Food Verse AI API",
    description="Multimodal AI-powered food intelligence platform integrating vision, freshness detection, hygiene monitoring, cooking assistance, and meal planning.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(recognition_router.router, prefix=settings.API_PREFIX)
app.include_router(nutrition_router.router, prefix=settings.API_PREFIX)
app.include_router(freshness_router.router, prefix=settings.API_PREFIX)
app.include_router(hygiene_router.router, prefix=settings.API_PREFIX)
app.include_router(cooking_router.router, prefix=settings.API_PREFIX)
app.include_router(mealplan_router.router, prefix=settings.API_PREFIX)
app.include_router(multimodal_router.router, prefix=settings.API_PREFIX)
app.include_router(reports_router.router, prefix=settings.API_PREFIX)

# Mount static directories
app.mount("/sample_data", StaticFiles(directory=str(settings.SAMPLE_DIR)), name="sample_data")
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "capabilities": [
            "Food Recognition",
            "Nutrition Analysis",
            "Freshness Detection",
            "Restaurant Hygiene Monitoring",
            "Smart Cooking Assistance",
            "Personalized Meal Planning",
            "Multimodal Voice & Vision AI",
            "Actionable Insights & Reports"
        ]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_engine": "Gemini Multimodal + FoodVerse Heuristic Vision Engine",
        "offline_fallback_active": True
    }
