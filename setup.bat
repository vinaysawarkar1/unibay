@echo off
REM Email OTP Authentication System Setup Script
REM This script installs dependencies and runs database migrations

echo.
echo ========================================
echo Email OTP Authentication - Setup Script
echo ========================================
echo.

REM Get the project directory
cd /d "%~dp0"

echo [1/4] Installing Nodemailer and dependencies...
call npm install nodemailer @types/nodemailer
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)
echo [✓] Dependencies installed successfully
echo.

echo [2/4] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma Client
    exit /b 1
)
echo [✓] Prisma Client generated
echo.

echo [3/4] Running database migration...
call npx prisma migrate dev --name add-email-verification
if errorlevel 1 (
    echo ERROR: Failed to run migration
    exit /b 1
)
echo [✓] Database migration completed
echo.

echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. The website is ready to run
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo 4. Test registration: http://localhost:3000/auth/register
echo 5. Test sign-in: http://localhost:3000/auth/signin
echo.
echo Email Configuration:
echo - Email: vinaysawarkar19@gmail.com
echo - OTP sending via Gmail SMTP (CONFIGURED)
echo.
echo ========================================
pause
