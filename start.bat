@echo off
echo ========================================
echo FULLSCO Backend - Quick Start Script
echo ========================================

echo.
echo Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✓ Node.js and npm are installed

REM Check if .env file exists
if not exist .env (
    echo.
    echo Creating .env file from template...
    copy env.example .env
    echo ✓ .env file created
    echo.
    echo IMPORTANT: Please edit the .env file with your database credentials before continuing.
    echo.
    pause
)

echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo ✓ Dependencies installed

echo.
echo Starting development server...
echo.
echo The server will be available at: http://localhost:5000
echo Health check: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause 