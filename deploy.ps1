# Deployment Script for Windows PowerShell
# Usage: .\deploy.ps1 "Your commit message"
# Or: .\deploy.ps1 (uses default message)

param(
    [string]$commitMessage = "Deploy updates"
)

# Configuration
$pemPath = "$env:USERPROFILE\Downloads\unibay.pem"
$sshHost = "ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com"
$remoteAppDir = "~/apps/laptop-builder"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying to AWS EC2 Instance" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .pem file exists
if (-not (Test-Path $pemPath)) {
    Write-Host "ERROR: .pem file not found at $pemPath" -ForegroundColor Red
    exit 1
}

# Stage changes
Write-Host "1. Staging changes..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to stage changes" -ForegroundColor Red
    exit 1
}

# Commit changes
Write-Host "2. Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: No changes to commit or commit failed" -ForegroundColor Yellow
}

# Push to repository
Write-Host "3. Pushing to repository..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push to repository" -ForegroundColor Red
    exit 1
}

# Deploy to EC2
Write-Host "4. Deploying to EC2..." -ForegroundColor Yellow
Write-Host "   Connecting to $sshHost" -ForegroundColor Cyan

$deployScript = @"
    set -e
    echo "Pulling latest code..."
    cd $remoteAppDir
    git pull origin main

    echo "Installing dependencies..."
    npm install

    echo "Building application..."
    npm run build

    echo "Restarting application..."
    pm2 restart laptop-builder || pm2 start npm --name "laptop-builder" -- start

    echo "Waiting for application to start..."
    sleep 3

    echo "=========================================="
    echo "Deployment Complete!"
    echo "=========================================="
    pm2 status
    echo ""
    echo "Recent logs:"
    pm2 logs laptop-builder --lines 10
"@

ssh -i $pemPath $sshHost $deployScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Deployment failed on EC2 instance" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Deployment Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now live at:" -ForegroundColor Cyan
Write-Host "http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com" -ForegroundColor Cyan
Write-Host "Admin panel: http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com/admin" -ForegroundColor Cyan
Write-Host ""
