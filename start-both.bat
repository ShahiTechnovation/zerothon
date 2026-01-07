@echo off
echo.
echo ============================================
echo   Starting PyVax System
echo ============================================
echo.

echo Starting PyVax Main (Port 3001)...
start "PyVax Main" cmd /k "cd /d %~dp0 && echo PyVax Main Server && echo Port: 3001 && echo. && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting PyVax AI (Port 5173)...
start "PyVax AI" cmd /k "cd /d %~dp0hacked3.0-main && echo PyVax AI Server && echo Port: 5173 && echo. && pnpm run dev"

echo.
echo ============================================
echo   Both servers starting...
echo ============================================
echo.
echo   PyVax Main:  http://localhost:3001
echo   PyVax AI:    http://localhost:3001/ai
echo.
echo   Wait ~10 seconds for servers to start...
echo.
echo ============================================

timeout /t 3 /nobreak >nul
start http://localhost:3001
