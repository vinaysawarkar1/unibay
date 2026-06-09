@echo off
REM Start the development server
REM Run this after setup.bat has completed

echo.
echo ========================================
echo Starting Email OTP Authentication System
echo ========================================
echo.

cd /d "%~dp0"

echo Starting development server...
echo.
echo Once started, the website will be available at:
echo   http://localhost:3000
echo.
echo Test the authentication system at:
echo   Register: http://localhost:3000/auth/register
echo   Sign In:  http://localhost:3000/auth/signin
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

npm run dev

pause
