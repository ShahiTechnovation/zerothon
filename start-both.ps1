# Start Zerothon System
# Run this script to start the Python Compiler Service and the Main Web App

Write-Host "🚀 Starting Zerothon System..." -ForegroundColor Cyan
Write-Host ""

# Start Python Compiler Service (Port 8000)
Write-Host "Starting Python Compiler Service on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\python-compiler-service'; python main.py"

Start-Sleep -Seconds 2

# Start Next.js App (Port 3000)
# Note: This will automatically run 'node scripts/sync-cli.js' first
Write-Host "Starting Next.js App on port 3000..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "✅ Services starting..." -ForegroundColor Green
Write-Host ""
Write-Host "🐍 Compiler: http://localhost:8000" -ForegroundColor White
Write-Host "🌐 Web App:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to open in browser..."
Read-Host

Start-Process "http://localhost:3000"
