@echo off
echo ===================================================
echo zerothon Python Compiler Service - Railway Deployer
echo ===================================================
echo.
echo This script will guide you through deploying the service to Railway.
echo.

echo [1/3] Checking Railway authentication...
call railway whoami
if %ERRORLEVEL% NEQ 0 (
    echo You need to login to Railway.
    echo Opening browser for authentication...
    call railway login
    if %ERRORLEVEL% NEQ 0 (
        echo Login failed. Please try again.
        pause
        exit /b 1
    )
) else (
    echo Already logged in!
)

echo.
echo [2/3] Initializing project...
if not exist railway.toml (
    echo Creating new project linkage...
    call railway init
)

echo.
echo [3/3] Deploying to Railway...
call railway up --detach

echo.
echo ===================================================
echo Deployment triggered!
echo Use 'railway status' to check progress.
echo Use 'railway domain' to get your service URL.
echo ===================================================
pause
