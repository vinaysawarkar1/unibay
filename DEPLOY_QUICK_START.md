# Quick Start Deployment Guide

## For Windows Users (PowerShell)

### 1️⃣ First Time Setup (Run These Commands Once)

Open PowerShell and run:

```powershell
# Navigate to your project directory
cd "E:\companies\Cortex Ai\Product Code\v0-laptop-pc-builder-main\v0-laptop-pc-builder-main.worktrees\agents-spatial-koi"

# Test SSH connection
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "echo 'SSH connection successful'"

# If you see 'SSH connection successful', your setup is working!
```

### 2️⃣ Run Server Initialization (One-Time on EC2)

```powershell
# Connect to server
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Once connected, run:
bash server-init.sh

# Follow the prompts to set up your environment
```

### 3️⃣ Deploy Your Application

```powershell
# Run the deployment script (from your project directory)
.\deploy.ps1 "Add admin panel to production"

# The script will:
# 1. Commit your changes
# 2. Push to GitHub
# 3. Pull on the EC2 server
# 4. Build and start the application
```

## For Mac/Linux Users

### 1️⃣ First Time Setup

```bash
# Navigate to your project directory
cd path/to/your/project

# Make deploy script executable
chmod +x deploy.sh
chmod +x server-init.sh

# Test SSH connection
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "echo 'SSH connection successful'"
```

### 2️⃣ Run Server Initialization

```bash
# Connect to server
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Once connected, run:
bash server-init.sh

# Follow the prompts
```

### 3️⃣ Deploy Your Application

```bash
# Run the deployment script
./deploy.sh "Add admin panel to production"
```

## Before Your First Deployment

### ✅ Pre-Deployment Checklist

- [ ] GitHub/GitLab repository is set up
- [ ] `.pem` file is in `~/Downloads/unibay.pem`
- [ ] EC2 instance is running
- [ ] Security group allows SSH (port 22), HTTP (port 80), HTTPS (port 443)
- [ ] Database is accessible and running
- [ ] You have admin email(s) ready (for ADMIN_EMAILS)

### ✅ Environment Variables Needed

When running `server-init.sh`, you'll need these values:

```env
# Database (from your database provider)
DATABASE_URL=postgresql://user:password@your-db-host:5432/laptop_builder

# Security (generate a random string)
NEXTAUTH_SECRET=use-https://generate-secret.vercel.app/32

# Your domain or EC2 IP
NEXTAUTH_URL=http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Admin emails (comma-separated)
ADMIN_EMAILS=your-email@example.com,admin@example.com

# Optional - OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional - Email notifications
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-gmail-app-password
```

## Common Commands

### View Application Status
```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "pm2 status"
```

### View Logs
```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "pm2 logs laptop-builder --lines 50"
```

### Restart Application
```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "pm2 restart laptop-builder"
```

### SSH into Server (Troubleshooting)
```bash
# Windows PowerShell:
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Mac/Linux:
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

## Troubleshooting

### "Permission Denied (publickey)"

**Windows:**
```powershell
icacls "$env:USERPROFILE\Downloads\unibay.pem" /inheritance:r /grant:r "$env:USERNAME``:F"
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

**Mac/Linux:**
```bash
chmod 600 ~/Downloads/unibay.pem
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

### Application Not Starting

```bash
# Check logs
pm2 logs laptop-builder --err

# Check if port is in use
lsof -i :3000

# Restart manually
pm2 restart laptop-builder
```

### Database Connection Error

```bash
# Verify DATABASE_URL in .env.local
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "cd ~/apps/laptop-builder && cat .env.local | grep DATABASE_URL"

# Test database connection (if PostgreSQL installed)
psql -U user -h your-db-host -d database_name -c "SELECT 1;"
```

### Nginx Not Working

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t
```

## After Deployment

### ✅ Verify Everything is Working

1. **Visit your application:**
   ```
   http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
   ```

2. **Check admin panel:**
   ```
   http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com/admin
   ```

3. **View real-time logs:**
   ```bash
   pm2 logs laptop-builder
   ```

4. **Monitor resources:**
   ```bash
   pm2 monit
   ```

## Making Future Updates

After your first deployment, updating is easy:

### Windows (PowerShell)
```powershell
.\deploy.ps1 "Update admin panel styling"
```

### Mac/Linux
```bash
./deploy.sh "Update admin panel styling"
```

The script handles:
- ✅ Git commit and push
- ✅ Pulling latest code on server
- ✅ Installing dependencies
- ✅ Building the application
- ✅ Restarting the service
- ✅ Showing recent logs

## Production Considerations

For a production setup, also consider:

1. **SSL/HTTPS:**
   ```bash
   sudo yum install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Firewall Rules:** Configure AWS Security Groups
   - Port 22: SSH (restrict to your IP)
   - Port 80: HTTP (allow all)
   - Port 443: HTTPS (allow all)

3. **Backups:** Set up automated database backups

4. **Monitoring:** Consider CloudWatch for monitoring

5. **Domain:** Set up a custom domain with DNS

## Getting Help

If you encounter issues:

1. Check the detailed guide: `DEPLOYMENT.md`
2. View logs: `pm2 logs laptop-builder`
3. SSH into the server and troubleshoot manually
4. Check AWS CloudWatch logs

## Summary

```bash
# 3-step deployment process:

# Step 1: Make code changes locally, commit, and push
git add .
git commit -m "Your changes"
git push origin main

# Step 2: Run deployment script (Windows/Mac/Linux)
.\deploy.ps1        # Windows PowerShell
./deploy.sh         # Mac/Linux

# Step 3: Verify at your domain/IP
# Done! ✓
```

That's it! Your application is now live. 🚀
