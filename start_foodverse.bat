@echo off
title FoodVerse AI - Platform Launcher
echo ==========================================================
echo           Launching FoodVerse AI Full-Stack Platform      
echo ==========================================================
echo [1/3] Starting Backend API Server (FastAPI on http://localhost:8000)...
start "FoodVerse Backend" cmd /k "cd /d %~dp0backend && python run.py"

echo [2/3] Starting Frontend React Server (Vite on http://localhost:5173)...
start "FoodVerse Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo ==========================================================
echo FoodVerse AI is running!
echo Backend Docs: http://localhost:8000/docs
echo Frontend UI:  http://localhost:5173
echo ==========================================================
