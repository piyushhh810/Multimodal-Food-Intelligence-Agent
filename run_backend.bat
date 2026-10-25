@echo off
title FoodVerse AI - Backend Server
echo ====================================================
echo Starting FoodVerse AI FastAPI Backend (Port 8000)...
echo ====================================================
cd /d "%~dp0backend"
python run.py
pause
