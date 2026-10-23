@echo off
title FinTrack PRO - Personal Finance Tracker
echo ========================================================
echo     Starting FinTrack PRO - Personal Finance Tracker
echo ========================================================
echo.

:: Free port 8080 and port 5173 if any stale process is running
echo Clearing port 8080 and port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1

echo.
echo [1/2] Launching Spring Boot REST API Backend (Port 8080)...
start "FinTrack Backend (Spring Boot)" cmd /k "cd /d %~dp0server && mvn spring-boot:run"

echo [2/2] Launching React + Vite Frontend (Port 5173)...
start "FinTrack Frontend (React)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================================
echo   FinTrack PRO servers launched!
echo   Frontend Web App : http://localhost:5173
echo   Backend REST API : http://localhost:8080/api/health
echo ========================================================
echo.
echo Keep the opened server terminal windows open while using the app.
echo.
pause