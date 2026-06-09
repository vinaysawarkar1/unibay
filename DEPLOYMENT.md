# Deployment Guide

## AWS EC2 Deployment Setup

### Instance Information
- **Host**: ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
- **User**: ec2-user
- **Key**: unibay.pem (in Downloads folder)
- **Region**: eu-north-1

## Prerequisites

1. **.pem file** - Located in `~/Downloads/unibay.pem`
2. **Git Repository** - Code must be in a Git repo (GitHub, GitLab, etc.)
3. **Node.js & npm** - Should be installed on EC2 instance
4. **Environment Variables** - `.env.local` file on the server

## Deployment Steps

### Step 1: Prepare Your Local Repository

If not already done, commit the admin panel changes:

```bash
# Stage all changes
git add .

# Commit the changes
git commit -m "Add comprehensive admin panel with product, order, user, and blog management"

# Push to your remote repository
git push origin main
# or: git push origin develop
```

### Step 2: Set Up SSH Key Permissions

On Windows (run in PowerShell):

```powershell
# The .pem file should have proper permissions
# If you get permission errors, you may need to adjust:
icacls "$env:USERPROFILE\Downloads\unibay.pem" /inheritance:r /grant:r "$env:USERNAME``:F"
```

### Step 3: Connect to EC2 Instance

```bash
# Option A: From PowerShell/CMD (Windows)
ssh -i "Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Option B: From WSL/Git Bash (Windows)
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Option C: From Linux/Mac
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

### Step 4: Initial Server Setup (First Time Only)

Once connected to the EC2 instance:

```bash
# Update system packages
sudo yum update -y

# Install Node.js (if not already installed)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2

# Create application directory
mkdir -p ~/apps
cd ~/apps
```

### Step 5: Clone/Pull Repository on Server

```bash
# Clone the repository (first time)
git clone https://github.com/your-username/your-repo.git laptop-builder
cd laptop-builder

# OR pull latest changes (subsequent deployments)
cd ~/apps/laptop-builder
git pull origin main
```

### Step 6: Set Up Environment Variables

```bash
# Create .env.local file
nano .env.local

# Add the following variables:
DATABASE_URL=postgresql://user:password@host:5432/database_name
NEXTAUTH_SECRET=your-secret-key-for-production
NEXTAUTH_URL=https://your-domain.com
ADMIN_EMAILS=admin@example.com,manager@example.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Save file: Ctrl+O, Enter, Ctrl+X
```

### Step 7: Install Dependencies & Build

```bash
# Install dependencies
npm install

# Build the Next.js application
npm run build

# Verify build was successful
ls -la .next/
```

### Step 8: Start Application with PM2

```bash
# Start the application
pm2 start npm --name "laptop-builder" -- start

# Configure PM2 to restart on system reboot
pm2 startup
sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save

# Check status
pm2 status
pm2 logs laptop-builder
```

### Step 9: Set Up Reverse Proxy (Nginx/Apache)

If using Nginx (recommended):

```bash
# Install Nginx
sudo yum install -y nginx

# Create configuration
sudo nano /etc/nginx/conf.d/laptop-builder.conf
```

Add this content:

```nginx
server {
    listen 80;
    server_name ec2-16-16-70-141.eu-north-1.compute.amazonaws.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

### Step 10: Verify Deployment

```bash
# Check application is running
pm2 status

# Check logs
pm2 logs laptop-builder

# Test the application
curl http://localhost:3000

# Test admin panel
curl http://localhost:3000/admin
```

## Subsequent Deployments

For future updates, use this quick deployment script:

```bash
# SSH into server
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Pull latest code
cd ~/apps/laptop-builder
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart application
pm2 restart laptop-builder

# Verify
pm2 logs laptop-builder
```

## Automated Deployment Script

Create a local script to automate deployments:

### For Windows (PowerShell): `deploy.ps1`

```powershell
param(
    [string]$message = "Update deployment"
)

# Commit and push changes
git add .
git commit -m $message
git push origin main

# SSH and deploy
$pemPath = "$env:USERPROFILE\Downloads\unibay.pem"
$host = "ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com"

ssh -i $pemPath $host @'
    cd ~/apps/laptop-builder
    git pull origin main
    npm install
    npm run build
    pm2 restart laptop-builder
    pm2 logs laptop-builder --lines 20
'@
```

Usage:
```powershell
.\deploy.ps1 "Add admin panel features"
```

### For Linux/Mac: `deploy.sh`

```bash
#!/bin/bash

MESSAGE="${1:-Update deployment}"
PEM_PATH="$HOME/Downloads/unibay.pem"
HOST="ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com"

# Commit and push
git add .
git commit -m "$MESSAGE"
git push origin main

# Deploy to server
ssh -i "$PEM_PATH" "$HOST" << 'EOF'
    cd ~/apps/laptop-builder
    git pull origin main
    npm install
    npm run build
    pm2 restart laptop-builder
    pm2 logs laptop-builder --lines 20
EOF
```

Usage:
```bash
chmod +x deploy.sh
./deploy.sh "Add admin panel features"
```

## Environment Variables for Production

Make sure these are set in `.env.local` on the server:

```env
# Database
DATABASE_URL=postgresql://user:password@your-db-host:5432/laptop_builder

# NextAuth
NEXTAUTH_SECRET=your-very-long-random-secret-key-change-this
NEXTAUTH_URL=https://your-domain.com

# Admin Panel
ADMIN_EMAILS=admin@your-domain.com,manager@your-domain.com

# OAuth (if using)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Email
EMAIL_USER=noreply@your-domain.com
EMAIL_PASSWORD=your-gmail-app-password
```

## Troubleshooting

### SSH Connection Issues

```bash
# If permission denied error:
chmod 600 ~/Downloads/unibay.pem

# If host key verification fails:
ssh-keyscan -H ec2-16-16-70-141.eu-north-1.compute.amazonaws.com >> ~/.ssh/known_hosts
```

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs laptop-builder --err

# Check system resources
free -h
df -h

# Check if port 3000 is in use
lsof -i :3000
```

### Database Connection Issues

```bash
# Test database connection
psql -U user -h db-host -d database_name -c "SELECT 1;"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/error.log

# Check access log
sudo tail -f /var/log/nginx/access.log
```

## Monitoring & Logs

```bash
# View application logs
pm2 logs laptop-builder

# View specific errors
pm2 logs laptop-builder --err

# Monitor in real-time
pm2 monit

# List all running processes
pm2 list

# Stop application
pm2 stop laptop-builder

# Restart application
pm2 restart laptop-builder

# Delete from PM2
pm2 delete laptop-builder
```

## Backup & Recovery

```bash
# Backup database
pg_dump -U user -h db-host database_name > backup.sql

# Backup application files
tar -czf ~/backups/laptop-builder-$(date +%Y%m%d).tar.gz ~/apps/laptop-builder/

# Restore from backup
tar -xzf ~/backups/laptop-builder-20240609.tar.gz
```

## SSL/HTTPS Setup

To enable HTTPS, use Let's Encrypt with Certbot:

```bash
sudo yum install -y certbot python3-certbot-nginx

sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot-renewal
```

## Performance Tips

1. Enable compression in Nginx
2. Set up CloudFront CDN for static assets
3. Implement caching headers
4. Monitor memory and CPU usage
5. Set up automated backups
6. Enable security groups on EC2

## Support

For deployment issues:
1. Check PM2 logs: `pm2 logs laptop-builder`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables: `env | grep NEXTAUTH`
4. Test database connection
5. Check AWS Security Groups allow ports 80, 443, 22
