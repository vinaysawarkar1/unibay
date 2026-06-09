# 🚀 Deployment Summary

## What's Been Created

A complete deployment system for your admin panel to AWS EC2 with automated scripts and comprehensive documentation.

## 📦 Deployment Files

### 1. **DEPLOY_QUICK_START.md** ⭐ START HERE
Quick reference guide with step-by-step instructions for both Windows and Mac/Linux users. Read this first!

### 2. **DEPLOYMENT.md**
Comprehensive deployment guide covering:
- Instance information and prerequisites
- Step-by-step deployment process
- Environment variable setup
- Troubleshooting common issues
- Monitoring and backup procedures

### 3. **deploy.ps1** (Windows PowerShell)
Automated deployment script that:
- Commits your changes with a message
- Pushes to your Git repository
- SSHs into your EC2 instance
- Pulls latest code, builds, and restarts the app
- Shows deployment status

**Usage:**
```powershell
.\deploy.ps1 "Your commit message"
```

### 4. **deploy.sh** (Mac/Linux)
Same functionality as deploy.ps1 but for Unix-like systems.

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh "Your commit message"
```

### 5. **server-init.sh**
One-time server initialization script that:
- Updates system packages
- Installs Node.js v20
- Installs PM2 (process manager)
- Installs Nginx (reverse proxy)
- Sets up the application directory
- Configures environment variables
- Builds and starts the application

**Run on EC2 (first time only):**
```bash
bash server-init.sh
```

### 6. **.env.production.example**
Template file with all required environment variables for production. Use this to create `.env.local` on your EC2 server.

## 🎯 Quick Deployment Steps

### First Time Setup (5-10 minutes)

#### Step 1: Prepare Your Code
```bash
# Make sure your code is in a Git repository (GitHub, GitLab, etc.)
git add .
git commit -m "Add admin panel"
git push origin main
```

#### Step 2: Connect to EC2 and Initialize

**Windows PowerShell:**
```powershell
# Test connection
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Once connected on the server, run:
bash server-init.sh
```

**Mac/Linux:**
```bash
# Test connection
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Once connected on the server, run:
bash server-init.sh
```

#### Step 3: Follow Prompts
The `server-init.sh` script will guide you through:
- Entering your Git repository URL
- Setting up environment variables (database, NextAuth secret, admin emails)
- Waiting for the build to complete

#### Step 4: Access Your Application
Once deployment completes, visit:
- Application: `http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com`
- Admin Panel: `http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com/admin`

### Future Deployments (1 minute)

After initial setup, deploying updates is simple:

**Windows PowerShell:**
```powershell
.\deploy.ps1 "Update admin panel features"
```

**Mac/Linux:**
```bash
./deploy.sh "Update admin panel features"
```

The script automatically:
1. Commits your changes
2. Pushes to GitHub
3. Pulls on the server
4. Rebuilds the application
5. Restarts the service
6. Shows the status

## 📋 Deployment Checklist

Before your first deployment, ensure you have:

- [ ] GitHub/GitLab repository created
- [ ] `.pem` file in `~/Downloads/unibay.pem`
- [ ] EC2 instance IP address: `ec2-16-16-70-141.eu-north-1.compute.amazonaws.com`
- [ ] EC2 Security Group allows:
  - [ ] Port 22 (SSH) - from your IP
  - [ ] Port 80 (HTTP) - from anywhere (0.0.0.0/0)
  - [ ] Port 443 (HTTPS) - from anywhere (optional, for later)
- [ ] Database URL ready (PostgreSQL)
- [ ] Admin email addresses ready
- [ ] Git repository access configured

## 🔐 Environment Variables You'll Need

When running `server-init.sh`, have these ready:

```
DATABASE_URL          → PostgreSQL connection string
NEXTAUTH_SECRET       → Random 32+ character string
NEXTAUTH_URL          → Your domain or EC2 IP
ADMIN_EMAILS          → Comma-separated admin emails
GOOGLE_CLIENT_ID      → (Optional) Google OAuth
GOOGLE_CLIENT_SECRET  → (Optional) Google OAuth
EMAIL_USER            → (Optional) Gmail for notifications
EMAIL_PASSWORD        → (Optional) Gmail app password
```

## 📊 System Architecture

```
Your Computer
    ↓
Git Repository (GitHub/GitLab)
    ↓
EC2 Instance (ec2-16-16-70-141.eu-north-1.compute.amazonaws.com)
    ├─ Nginx (Port 80/443)
    ├─ PM2 (Node.js process manager)
    ├─ Next.js App (Port 3000)
    └─ PostgreSQL (Database)
```

## 🚨 Common Issues & Solutions

### "Permission denied (publickey)"
The SSH key doesn't have correct permissions.

**Windows:**
```powershell
icacls "$env:USERPROFILE\Downloads\unibay.pem" /inheritance:r /grant:r "$env:USERNAME``:F"
```

**Mac/Linux:**
```bash
chmod 600 ~/Downloads/unibay.pem
```

### "Connection refused" or can't reach application
The application might not be running or Nginx isn't configured.

```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
pm2 status              # Check if app is running
pm2 logs               # Check for errors
pm2 restart laptop-builder  # Restart if needed
```

### Database connection error
The DATABASE_URL is incorrect or database is unreachable.

```bash
# SSH to server and check the .env.local
cat .env.local | grep DATABASE_URL

# Test database connection
psql -U username -h host -d database -c "SELECT 1;"
```

### Port already in use
Another service is using port 3000 or 80.

```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or let PM2 handle it
pm2 restart laptop-builder
```

## 📞 Support & Resources

### Documentation Files
- `DEPLOY_QUICK_START.md` - Quick reference
- `DEPLOYMENT.md` - Complete detailed guide
- `ADMIN_PANEL.md` - Admin panel features
- `ADMIN_SETUP.md` - Admin panel setup
- `.env.production.example` - Environment variables template

### Useful Commands

```bash
# View application status
pm2 status

# View logs (real-time)
pm2 logs laptop-builder

# Monitor resources
pm2 monit

# Restart application
pm2 restart laptop-builder

# Stop application
pm2 stop laptop-builder

# SSH into server
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## ✨ What You Get

After deployment:

✅ **Live Admin Panel** at `/admin`
- Product management (create, edit, delete with images)
- Order management (track status, shipping)
- User management (view profiles, orders, addresses)
- Blog management (create, edit, publish posts)
- Dashboard with key metrics

✅ **Automated Deployment**
- Deploy with single command
- Automatic git commits and pushes
- Zero-downtime deployments
- Real-time logs and monitoring

✅ **Production Ready**
- Nginx reverse proxy
- PM2 process management with auto-restart
- SSL/HTTPS ready (Let's Encrypt compatible)
- Database backup ready

✅ **Scalable Architecture**
- Can add more instances
- Can set up database replicas
- Can implement caching layers
- Can add CDN for static files

## 🎓 Next Steps After Deployment

1. **Test the Admin Panel**
   - Login with your admin email
   - Try creating a product
   - Create a test order (or view existing)
   - Create a blog post

2. **Set Up SSL/HTTPS**
   ```bash
   ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
   sudo yum install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

3. **Configure Custom Domain**
   - Point your domain's DNS to EC2 IP
   - Update NEXTAUTH_URL to your domain
   - Restart application

4. **Set Up Monitoring**
   - Enable AWS CloudWatch
   - Set up email alerts for failures
   - Monitor disk space and memory

5. **Automate Backups**
   - Set up daily database backups
   - Store backups in AWS S3
   - Test restore procedures

## 🔄 Deployment Workflow

Every time you want to deploy updates:

```bash
# 1. Make code changes locally
# 2. Run deployment script
.\deploy.ps1 "Your changes description"

# That's it! The script handles:
# ✓ Git commit and push
# ✓ SSH into server
# ✓ Pull latest code
# ✓ Install dependencies
# ✓ Build application
# ✓ Restart service
# ✓ Show status
```

## 📈 Performance Tips

1. Enable Nginx gzip compression
2. Set up CloudFront CDN for static assets
3. Implement Redis caching for database queries
4. Use AWS RDS for managed PostgreSQL
5. Set up auto-scaling for multiple instances
6. Enable HTTP/2 in Nginx

## 🛡️ Security Best Practices

1. ✅ Keep .pem file secure (600 permissions)
2. ✅ Never commit .env.local to git
3. ✅ Use strong NEXTAUTH_SECRET
4. ✅ Restrict SSH to your IP address
5. ✅ Enable SSL/HTTPS in production
6. ✅ Rotate database credentials regularly
7. ✅ Use AWS Secrets Manager for sensitive data
8. ✅ Enable VPC and security groups
9. ✅ Set up WAF (Web Application Firewall)
10. ✅ Monitor CloudTrail for API calls

## 📞 Troubleshooting Resources

- **SSH Issues?** → See DEPLOYMENT.md "Troubleshooting" section
- **Build Failed?** → Check `pm2 logs laptop-builder --err`
- **Database Error?** → Verify DATABASE_URL and connectivity
- **Nginx Issue?** → Check `sudo nginx -t` and error logs
- **Port Conflict?** → Use `lsof -i :3000` to find process

## Summary

You now have:
1. ✅ Comprehensive deployment documentation
2. ✅ Automated deployment scripts (Windows & Mac/Linux)
3. ✅ Server initialization script
4. ✅ Environment variable templates
5. ✅ Troubleshooting guides
6. ✅ Complete admin panel system

**Next Action:** Follow the steps in `DEPLOY_QUICK_START.md` to deploy! 🚀
