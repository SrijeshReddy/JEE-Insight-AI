@echo off
setlocal enabledelayedexpansion

title JEE Insight AI - Dev Server
cd /d "%~dp0"

echo ===================================================
echo        JEE INSIGHT AI - DEV MODE LAUNCHER
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [*] 'node_modules' folder not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
    echo.
)

echo [*] Starting Vite development server (HMR enabled)...
echo [*] Opening browser at http://localhost:5173...
echo.

start http://localhost:5173
call npm run dev

pause
