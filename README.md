# FoodVerse AI — Multimodal AI-Powered Food Intelligence Platform

> **A unified, multimodal AI platform integrating computer vision, video analytics, audio/speech processing, and LLM reasoning to deliver real-time insights across food recognition, freshness detection, restaurant hygiene monitoring, smart cooking assistance, and personalized nutrition planning.**

---

## 🌟 Executive Overview & Problem Statement

In modern households, restaurants, and food service environments, food-related decision-making is often fragmented and reactive:
- **Nutrition tracking** relies on manual calorie estimation and guesswork.
- **Food freshness** is judged visually without scientific validation, resulting in massive avoidable food waste or foodborne illness risks.
- **Restaurant hygiene monitoring** depends on periodic, subjective manual inspections.
- **Cooking assistance** is largely limited to static, non-interactive recipes that leave cooks with dirty hands struggling to navigate screens.

**FoodVerse AI** addresses these challenges through a unified multimodal AI architecture combining:
1. **Multimodal Food Intelligence**: Ingests images, video streams, audio speech, and natural text.
2. **Computer Vision Food Recognition**: Automatic identification of dishes, ingredients, portion sizes, and bounding highlights.
3. **Deep Nutrition & Nutri-Score Analysis**: Caloric estimates, macronutrient ratios, micronutrient density, and standardized Nutri-Score grading (A to E).
4. **Surface Spoilage & Freshness Detection**: Surface discoloration, browning index, texture degradation, fungal spot detection, and remaining shelf-life forecasting.
5. **Commercial Kitchen Hygiene Monitoring**: Temporal video and CCTV auditing for staff glove compliance, hairnet protocol, prep surface cleanliness, and cross-contamination prevention.
6. **Smart Cooking Studio**: Hands-free voice-narrated step guide with automated multi-timers and smart dietary ingredient substitutions.
7. **Personalized Adaptive Meal Planner**: Mifflin-St Jeor TDEE calibration, 7-day schedules, and automated grocery shopping lists categorized by supermarket aisle.
8. **Dual AI Reasoning Engine**: Google Gemini Multimodal Vision API + 100% offline heuristic vision engine for zero-failure local demonstrations.
9. **Scalable Full-Stack Architecture**: Python FastAPI backend with modular service routers + Vite React.js frontend with Tailwind CSS and glassmorphism styling.
10. **Actionable Insights & Compliance Reports**: Executive command center KPIs, live safety advisory alerts, and printable Food Safety Audit Certificates.

---

## 💻 Hardware & Software Requirements

### Hardware Requirements
- **Processor**: Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or equivalent
- **RAM**: Minimum 8 GB (Recommended: 16 GB for multitasking and AWS Labs usage)
- **Storage**: 256 GB SSD (or 500 GB HDD minimum)
- **Connectivity**: High-speed internet (10-20 Mbps)
- **Peripherals**: Webcam / Built-in camera and Microphone (for hands-free voice commands)

### Software Requirements
- **Operating System**: Windows 10/11, macOS (Monterey+), or Linux (Ubuntu 20.04+)
- **Runtime**: Python 3.8+ (Tested on Python 3.13) & Node.js 18+ (Tested on Node v24)
- **Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge (Web Speech API supported)
- **AWS CLI**: Latest version configured for AWS deployments

---

## 🏗️ Architecture & Technology Stack

```
Food_verse ai/
├── backend/
│   ├── app/
│   │   ├── config.py             # Settings, Gemini API key, directories
│   │   ├── main.py               # FastAPI application entrypoint & CORS
│   │   ├── models/               # Pydantic data schemas
│   │   │   ├── recognition.py    # Bounding boxes, confidence, ingredients
│   │   │   ├── nutrition.py      # Macros, micros, Nutri-Score, allergens
│   │   │   ├── freshness.py      # Decay scores, discoloration, shelf life
│   │   │   ├── hygiene.py        # PPE compliance, CCTV violation logs
│   │   │   ├── cooking.py        # Recipes, timers, ingredient substitutions
│   │   │   └── mealplan.py       # TDEE, 7-day schedule, grocery items
│   │   ├── services/             # Core AI & domain logic
│   │   │   ├── ai_service.py     # Gemini API + offline heuristic fallback
│   │   │   ├── vision_service.py # Pillow & NumPy color histogram / texture
│   │   │   ├── freshness_service.py # Decay classifier & storage protocols
│   │   │   ├── hygiene_service.py# CCTV kitchen inspection engine
│   │   │   ├── nutrition_service.py # Nutrition database & Nutri-Score algorithm
│   │   │   ├── cooking_service.py# Step guide & substitution matcher
│   │   │   ├── mealplan_service.py# Mifflin-St Jeor planner & shopping list
│   │   │   └── audio_service.py  # Voice command parser & intent matcher
│   │   └── routers/              # RESTful API endpoints
│   ├── sample_data/              # Pre-loaded evaluation images
│   ├── requirements.txt          # Python dependencies
│   ├── test_api.py               # Automated verification test suite
│   └── run.py                    # Backend server runner (port 8000)
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI widgets
│   │   │   ├── Navbar.jsx        # Status indicators & voice assistant toggle
│   │   │   ├── Sidebar.jsx       # Navigation across 8 modules
│   │   │   ├── MetricCard.jsx    # Glassmorphic KPI cards with trends
│   │   │   ├── CameraCapture.jsx # Real-time webcam viewfinder & snapshot
│   │   │   ├── AudioController.jsx # Web Speech API voice listener & soundwaves
│   │   │   ├── HealthScoreBadge.jsx # 0-100 gauge & official Nutri-Score
│   │   │   ├── FreshnessMeter.jsx# Decay gradient meter & shelf life badge
│   │   │   ├── InteractiveCookingTimer.jsx # Multi-timer with audio chimes
│   │   │   ├── MacroNutrientChart.jsx # Recharts macro distribution
│   │   │   └── ExportReportModal.jsx # Formatted printable audit certificate
│   │   ├── pages/                # 8 Dedicated View Pages
│   │   │   ├── DashboardOverview.jsx
│   │   │   ├── FoodRecognitionPage.jsx
│   │   │   ├── NutritionAnalysisPage.jsx
│   │   │   ├── FreshnessDetectionPage.jsx
│   │   │   ├── RestaurantHygienePage.jsx
│   │   │   ├── SmartCookingPage.jsx
│   │   │   ├── MealPlanningPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── services/api.js       # Client connecting to FastAPI backend
│   └── package.json
│
├── start_foodverse.bat           # 1-Click launcher for both servers
├── run_backend.bat               # Backend launcher
├── run_frontend.bat              # Frontend launcher
└── README.md
```

---

## 🚀 Quickstart: Running Locally

### Option 1: 1-Click Launch (Windows)
Double-click `start_foodverse.bat` in the root folder.
This will:
1. Start the FastAPI backend on `http://localhost:8000`
2. Start the Vite React frontend on `http://localhost:5173`
3. Automatically launch your default browser to `http://localhost:5173`

---

### Option 2: Manual Terminal Execution

#### 1. Start Backend:
```bash
cd backend
python run.py
```
*Backend runs on `http://localhost:8000` with Swagger UI interactive documentation at `http://localhost:8000/docs`.*

#### 2. Start Frontend:
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

#### 3. Run Backend Test Suite:
```bash
python backend/test_api.py
```

---

## 🌐 API Specification

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/health` | `GET` | Health check & AI engine status |
| `POST /api/recognition/analyze` | `POST` | Upload food photo or camera frame for dish recognition & bounding boxes |
| `POST /api/nutrition/calculate` | `POST` | Calculate calories, macros, micros, Health Score, and Nutri-Score |
| `POST /api/freshness/inspect` | `POST` | Classify freshness (Fresh / Moderately Fresh / Spoiled) & shelf-life |
| `POST /api/hygiene/audit-frame` | `POST` | Inspect single kitchen station frame for PPE and cleanliness |
| `POST /api/hygiene/audit-video` | `POST` | Temporal CCTV video stream audit with timestamped violations |
| `POST /api/cooking/recipe-guide` | `POST` | Step-by-step recipe instructions, audio voice cues, and timers |
| `POST /api/cooking/substitute` | `POST` | Dietary and allergen ingredient substitution recommendations |
| `POST /api/mealplan/generate` | `POST` | Generate Mifflin-St Jeor 7-day adaptive meal plan & grocery list |
| `POST /api/multimodal/voice-command` | `POST` | Parse natural speech transcript to actionable FoodVerse intent |
| `GET /api/reports/dashboard-stats` | `GET` | Live KPIs, safety advisory notices, and recent scan logs |
| `POST /api/reports/export` | `POST` | Generate exportable/printable Food Safety & Health Audit Report |

---

## ☁️ AWS Cloud Deployment Guide

FoodVerse AI is designed for seamless deployment on Amazon Web Services (AWS):

### 1. Amazon S3 (Dataset & Asset Storage)
- Create an S3 bucket (e.g. `s3://foodverse-ai-assets`) to store high-resolution food datasets, kitchen CCTV footage, and uploaded user audit scans.
- Enable S3 Lifecycle rules to transition archived audit footage to S3 Glacier after 90 days.

### 2. AWS EC2 / ECS Fargate (Containerized Backend)
- **Containerization**: Build a Docker container using `python:3.13-slim`.
  ```dockerfile
  FROM python:3.13-slim
  WORKDIR /app
  COPY backend/requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY backend/ /app/
  CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```
- Deploy to **AWS ECS Fargate** behind an Application Load Balancer (ALB) for auto-scaling during peak kitchen inspection hours.

### 3. AWS Lambda & Amazon Rekognition / Bedrock (Optional Cloud Multimodal)
- Serverless event-driven image processing: Configure S3 PutObject events to trigger an AWS Lambda function for image thumbnailing.
- Connect to **Amazon Bedrock** (Claude 3.5 Sonnet / Llama 3 Vision) as an alternative cloud multimodal inference provider alongside Google Gemini.

### 4. AWS CloudFront & Amazon S3 (Frontend Hosting)
- Build the production React bundle via `npm run build` in `frontend/`.
- Sync `frontend/dist` to an S3 static website bucket:
  ```bash
  aws s3 sync frontend/dist s3://foodverse-ai-frontend --delete
  ```
- Distribute via **AWS CloudFront** with SSL certificate from AWS Certificate Manager (ACM) for global edge acceleration.

---

## 🛡️ License & Acknowledgements
Developed as part of the Advanced Multimodal AI Coding Initiative. Food safety metrics aligned with **FDA Food Code 2022** and **FSANZ Nutri-Score standards**.
