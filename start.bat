@echo off
setlocal enabledelayedexpansion

title JEE Insight AI - Launcher
cd /d "%~dp0"

echo ===================================================
echo             JEE INSIGHT AI - QUICK LAUNCHER
echo ===================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo [*] 'node_modules' folder not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
)

:: 3. Run Build
echo [*] Building project (Type check & Vite build)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Check the errors above.
    pause
    exit /b 1
)
echo [OK] Build completed successfully.
echo.

:: 4. Start preview server and launch browser
echo ===================================================
echo [*] Starting preview server at http://localhost:4173...
echo [*] Press Ctrl+C in this terminal window to stop.
echo ===================================================
echo.

:: Automatically launch default browser to the preview URL
start http://localhost:4173

:: Start the preview server
call npm run preview

pause
