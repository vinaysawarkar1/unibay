# 🚀 Step-by-Step Deployment Guide (Interactive)

Follow each step in order. Copy and paste the commands as shown.

## BEFORE YOU START

You need:
1. ✅ `unibay.pem` file in `~/Downloads/` (you confirmed this exists)
2. ✅ EC2 instance IP: `ec2-16-16-70-141.eu-north-1.compute.amazonaws.com`
3. ✅ Git repository URL (GitHub, GitLab, etc)
4. ✅ Database connection string (PostgreSQL)
5. ✅ Admin email address(es)

---

## STEP 1: Test SSH Connection

**WINDOWS (PowerShell):**
```powershell
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "echo 'Connection successful!'"
```

**MAC/LINUX:**
```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com "echo 'Connection successful!'"
```

**Expected Output:**
```
Connection successful!
```

✅ **If you see this, continue to Step 2**
❌ **If it fails, check:**
- Is the .pem file at the right location?
- Are you using the correct IP address?
- Try: `chmod 600 ~/Downloads/unibay.pem` (Mac/Linux)

---

## STEP 2: Full SSH Login

**WINDOWS (PowerShell):**
```powershell
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

**MAC/LINUX:**
```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

**You should now be logged in. You'll see:**
```
[ec2-user@ip-xxx ~]$
```

✅ **If you see this prompt, you're connected!**

---

## STEP 3: Initialize the Server (ONE TIME ONLY)

**Copy and paste this entire command:**

```bash
bash <(curl -s https://raw.githubusercontent.com/your-username/your-repo/main/server-init.sh)
```

OR if the script is local:

```bash
# First check if server-init.sh exists
ls -la ~/server-init.sh

# If it exists, run it:
bash ~/server-init.sh

# If not, download it:
curl -o ~/server-init.sh https://raw.githubusercontent.com/your-username/your-repo/main/server-init.sh
bash ~/server-init.sh
```

**This script will:**
1. Update system packages
2. Install Node.js v20
3. Install PM2
4. Install Nginx
5. Ask for your Git repo URL
6. Ask for environment variables

### When prompted, provide:
- **Git Repository URL:** `https://github.com/your-username/your-repo.git`
- **DATABASE_URL:** `postgresql://user:password@host:5432/dbname`
- **NEXTAUTH_SECRET:** A random string (or press Enter for auto-generation)
- **ADMIN_EMAILS:** `your-email@example.com`

⏳ **This will take 1-2 hours (mostly downloading packages)**

✅ **When it says "Server Setup Complete!", proceed to Step 4**

---

## STEP 4: Verify Installation

**Run these commands to verify everything is working:**

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PM2 status
pm2 status

# Check application status
pm2 logs laptop-builder --lines 20
```

**Expected output for pm2 status:**
```
┌─────────────────┬──────┬──────────┬───────────┐
│ Name            │ PID  │ Status   │ Version   │
├─────────────────┼──────┼──────────┼───────────┤
│ laptop-builder  │ 1234 │ online   │ 1.0.0     │
└─────────────────┴──────┴──────────┴───────────┘
```

✅ **If status is "online", your app is running!**
❌ **If status is "stopped" or "errored", check logs for errors**

---

## STEP 5: Test Your Application

**On the EC2 instance, test the app:**

```bash
# Test app is responding
curl http://localhost:3000

# Test admin panel endpoint
curl http://localhost:3000/admin
```

**Expected output:**
- Should return HTML content (not an error)

✅ **If you get HTML, the app is working!**

---

## STEP 6: Access Your Application

**In your web browser, visit:**

```
http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

or

```
http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com/admin
```

✅ **If the page loads, your deployment is successful!**

---

## STEP 7: Set Up Future Deployments

**On your local computer (not on the server), create a deployment script:**

### WINDOWS USERS: Save as `deploy.ps1`

```powershell
param([string]$message = "Deploy update")

$pemPath = "$env:USERPROFILE\Downloads\unibay.pem"
$host = "ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com"

git add .
git commit -m $message
git push origin main

ssh -i $pemPath $host @'
    cd ~/apps/laptop-builder
    git pull origin main
    npm install
    npm run build
    pm2 restart laptop-builder
    pm2 logs laptop-builder --lines 20
'@
```

**Run it:**
```powershell
.\deploy.ps1 "Your change description"
```

### MAC/LINUX USERS: Save as `deploy.sh`

```bash
#!/bin/bash
git add .
git commit -m "${1:-Update}"
git push origin main

ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com << 'EOF'
    cd ~/apps/laptop-builder
    git pull origin main
    npm install
    npm run build
    pm2 restart laptop-builder
    pm2 logs laptop-builder --lines 20
EOF
```

**Make it executable:**
```bash
chmod +x deploy.sh
```

**Run it:**
```bash
./deploy.sh "Your change description"
```

---

## TROUBLESHOOTING

### SSH Connection Issues

**Windows - Permission Denied:**
```powershell
icacls "$env:USERPROFILE\Downloads\unibay.pem" /inheritance:r /grant:r "$env:USERNAME``:F"
```

**Mac/Linux - Permission Denied:**
```bash
chmod 600 ~/Downloads/unibay.pem
```

### Application Not Starting

**Check logs:**
```bash
pm2 logs laptop-builder --err
```

**Restart:**
```bash
pm2 restart laptop-builder
```

### Database Connection Error

**Verify DATABASE_URL:**
```bash
cat .env.local | grep DATABASE_URL
```

**Test connection:**
```bash
psql -U user -h host -d dbname -c "SELECT 1;"
```

### Port Already in Use

```bash
lsof -i :3000
kill -9 <PID>
pm2 restart laptop-builder
```

### Nginx Not Working

```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## COMMON COMMANDS FOR LATER

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

# Start application
pm2 start npm --name "laptop-builder" -- start

# View Nginx status
sudo systemctl status nginx

# SSH back in
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

---

## WHAT HAPPENS AFTER DEPLOYMENT

1. ✅ Application is live at your EC2 IP
2. ✅ Admin panel accessible at `/admin`
3. ✅ Login with your admin email
4. ✅ Create products, manage orders, etc.

---

## NEXT STEPS

### Immediate (Day 1)
1. ✅ Test the admin panel
2. ✅ Create a test product
3. ✅ Verify everything works

### Soon (Day 2-3)
1. Set up SSL/HTTPS with Let's Encrypt
2. Configure custom domain
3. Set up automated backups

### Ongoing
1. Deploy updates using `deploy.ps1` or `deploy.sh`
2. Monitor logs regularly
3. Back up database

---

## SUPPORT

If something goes wrong:
1. Check logs: `pm2 logs laptop-builder --err`
2. Check status: `pm2 status`
3. Review: DEPLOYMENT.md for detailed troubleshooting
4. Reference: QUICK_REFERENCE.md for common commands

---

## CHECKLIST

- [ ] Step 1: SSH connection successful
- [ ] Step 2: Logged into EC2
- [ ] Step 3: Server initialization complete
- [ ] Step 4: Verified installation
- [ ] Step 5: Application responding
- [ ] Step 6: App accessible in browser
- [ ] Step 7: Deployment script created locally

✅ **ALL DONE! You're live!** 🚀

---

**Time to Complete:** ~2-3 hours (first time), ~1 minute (future updates)
