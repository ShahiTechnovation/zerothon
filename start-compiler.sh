#!/bin/bash

# Quick start script for Python compiler service

echo "🐍 Starting PyVax Python Compiler Service..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Navigate to service directory
cd python-compiler-service

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the service
echo ""
echo "✅ Starting compiler service on http://localhost:8000"
echo "📝 Press Ctrl+C to stop"
echo ""

python main.py
