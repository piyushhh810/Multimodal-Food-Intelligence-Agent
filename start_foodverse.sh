#!/bin/bash
echo "=========================================================="
echo "          Launching FoodVerse AI Full-Stack Platform      "
echo "=========================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "[1/3] Starting Backend API Server (FastAPI on http://localhost:8000)..."
(cd "$DIR/backend" && python3 run.py) &
BACKEND_PID=$!

echo "[2/3] Starting Frontend React Server (Vite on http://localhost:5173)..."
(cd "$DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

echo "[3/3] Servers started (Backend PID: $BACKEND_PID, Frontend PID: $FRONTEND_PID)"
echo "Backend Docs: http://localhost:8000/docs"
echo "Frontend UI:  http://localhost:5173"
echo "Press Ctrl+C to stop all services."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
