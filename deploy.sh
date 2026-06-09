#!/bin/bash
# Deployment Script for Linux/Mac
# Usage: ./deploy.sh "Your commit message"
# Or: ./deploy.sh (uses default message)

set -e

# Configuration
COMMIT_MESSAGE="${1:-Deploy updates}"
PEM_PATH="$HOME/Downloads/unibay.pem"
SSH_HOST="ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com"
REMOTE_APP_DIR="~/apps/laptop-builder"

echo "========================================"
echo "Deploying to AWS EC2 Instance"
echo "========================================"
echo ""

# Check if .pem file exists
if [ ! -f "$PEM_PATH" ]; then
    echo "ERROR: .pem file not found at $PEM_PATH"
    exit 1
fi

# Set proper permissions on .pem file
chmod 600 "$PEM_PATH"

# Stage changes
echo "1. Staging changes..."
git add .

# Commit changes
echo "2. Committing changes..."
if ! git commit -m "$COMMIT_MESSAGE"; then
    echo "WARNING: No changes to commit"
fi

# Push to repository
echo "3. Pushing to repository..."
git push origin main

# Deploy to EC2
echo "4. Deploying to EC2..."
echo "   Connecting to $SSH_HOST"

ssh -i "$PEM_PATH" "$SSH_HOST" << 'EOF'
    set -e
    echo "Pulling latest code..."
    cd ~/apps/laptop-builder
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
EOF

if [ $? -ne 0 ]; then
    echo "ERROR: Deployment failed on EC2 instance"
    exit 1
fi

echo ""
echo "========================================"
echo "✓ Deployment Successful!"
echo "========================================"
echo ""
echo "Your application is now live at:"
echo "http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com"
echo "Admin panel: http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com/admin"
echo ""
