@echo off
title FinTrack - Personal Finance Tracker
echo ========================================================
echo     Starting FinTrack - Personal Finance Tracker
echo ========================================================
echo.
echo [1/2] Launching Spring Boot REST API Backend (Port 8080)...
start "FinTrack Backend (Spring Boot)" cmd /k "cd /d %~dp0server && mvn spring-boot:run"

echo [2/2] Launching React + Vite Frontend (Port 5173)...
start "FinTrack Frontend (React)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers are launching!
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:8080/api/health
echo H2 Database Console at: http://localhost:8080/h2-console
echo.
pause
