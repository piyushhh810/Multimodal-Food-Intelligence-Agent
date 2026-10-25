# FoodVerse AI — Deployment Guide

This guide details the recommended methods to deploy FoodVerse AI to production.

---

## Architecture Overview
* **Backend**: FastAPI (Python 3.9+) serving REST APIs, AI fallback heuristics, and Gemini multimodal endpoints on port `8000`.
* **Frontend**: React 19 + Vite + TailwindCSS Single-Page Application (SPA).

---

## Option 1: Free Cloud Hosting (Recommended)

Deploy frontend and backend separately on modern cloud platforms with generous free tiers.

### Step 1: Deploy Backend to Render (or Railway)
1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository: `https://github.com/piyushhh810/Multimodal-Food-Intelligence-Agent`.
3. Configure the service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `GEMINI_API_KEY`: *(Optional) Your Google Gemini API key*
   - `ENABLE_OFFLINE_FALLBACK`: `true`
5. Click **Create Web Service**. Render will generate a URL like:
   `https://foodverse-backend.onrender.com`

---

### Step 2: Deploy Frontend to Vercel (or Netlify)
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import the `Multimodal-Food-Intelligence-Agent` repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE`: `https://foodverse-backend.onrender.com/api`
   - `VITE_BACKEND_URL`: `https://foodverse-backend.onrender.com`
5. Click **Deploy**. Vercel will build and launch your production frontend!

---

## Option 2: Docker / VPS Deployment (AWS, DigitalOcean, Linode)

If deploying to a Virtual Private Server (Ubuntu/Debian) with Docker and Docker Compose installed:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/piyushhh810/Multimodal-Food-Intelligence-Agent.git
   cd Multimodal-Food-Intelligence-Agent
   ```

2. **Launch with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access Services**:
   - Frontend UI: `http://<YOUR_SERVER_IP>:5173`
   - Backend API Docs: `http://<YOUR_SERVER_IP>:8000/docs`

---

## Option 3: Railway (One-Click Full Stack)
1. Go to [Railway.app](https://railway.app).
2. Create a new project from your GitHub repository.
3. Add service 1 pointing to `/backend` (FastAPI).
4. Add service 2 pointing to `/frontend` (Vite) and set `VITE_API_BASE` to your backend Railway domain.
