@echo off
REM Quick start script for Python compiler service (Windows)

echo 🐍 Starting PyVax Python Compiler Service...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+
    exit /b 1
)

REM Navigate to service directory
cd python-compiler-service

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Start the service
echo.
echo ✅ Starting compiler service on http://localhost:8000
echo 📝 Press Ctrl+C to stop
echo.

python main.py
