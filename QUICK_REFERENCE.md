# 📋 Quick Reference Card

## AWS EC2 Instance Info
```
Host:     ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
User:     ec2-user
Key:      ~/Downloads/unibay.pem
Region:   eu-north-1
```

## Connection Commands

### Windows PowerShell
```powershell
ssh -i "$env:USERPROFILE\Downloads\unibay.pem" ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

### Mac/Linux
```bash
ssh -i ~/Downloads/unibay.pem ec2-user@ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

## First Time Setup

```bash
# 1. SSH into server (see above)
# 2. Run initialization
bash server-init.sh

# 3. Follow prompts for:
#    - GitHub repo URL
#    - Database URL
#    - NEXTAUTH_SECRET
#    - Admin emails
#    - Email credentials (optional)

# 4. Wait for build to complete
# 5. Access your app:
#    http://ec2-16-16-70-141.eu-north-1.compute.amazonaws.com
```

## Deploy Updates

### Windows
```powershell
cd path\to\project
.\deploy.ps1 "Your message"
```

### Mac/Linux
```bash
cd path/to/project
./deploy.sh "Your message"
```

## Essential Commands

### Check Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs laptop-builder
# or with error filter:
pm2 logs laptop-builder --err
```

### Restart App
```bash
pm2 restart laptop-builder
```

### Stop App
```bash
pm2 stop laptop-builder
```

### Start App
```bash
pm2 start npm --name "laptop-builder" -- start
```

### Monitor Resources
```bash
pm2 monit
```

## Environment Variables Needed

| Variable | Example | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Your PostgreSQL connection |
| `NEXTAUTH_SECRET` | `randomstring32chars...` | Generate random 32+ chars |
| `NEXTAUTH_URL` | `https://domain.com` | Your domain or EC2 IP |
| `ADMIN_EMAILS` | `admin@example.com` | Comma-separated |
| `GOOGLE_CLIENT_ID` | (optional) | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | (optional) | Google OAuth |
| `EMAIL_USER` | (optional) | Gmail address |
| `EMAIL_PASSWORD` | (optional) | Gmail app password |

## File Locations on Server
```
~/apps/laptop-builder/          # Main application directory
~/apps/laptop-builder/.env.local # Environment variables
~/.pm2/logs/                     # PM2 logs
/etc/nginx/conf.d/               # Nginx configuration
/var/www/                        # Web root (if needed)
```

## Nginx Commands
```bash
# Check status
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Test config
sudo nginx -t

# View error log
sudo tail -f /var/log/nginx/error.log

# View access log
sudo tail -f /var/log/nginx/access.log
```

## Troubleshooting Quick Fixes

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart laptop-builder
```

### Permission Denied on SSH

**Windows:**
```powershell
icacls "$env:USERPROFILE\Downloads\unibay.pem" /inheritance:r /grant:r "$env:USERNAME``:F"
```

**Mac/Linux:**
```bash
chmod 600 ~/Downloads/unibay.pem
```

### Application Won't Start
```bash
pm2 logs laptop-builder --err
pm2 restart laptop-builder
# Check if database is accessible
psql -U user -h host -d dbname -c "SELECT 1;"
```

### Nginx Not Working
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

## Git Commands (Local)

### Prepare to Deploy
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Check Status
```bash
git status
```

### View Commits
```bash
git log --oneline -n 10
```

## Database Commands

### Connect to PostgreSQL
```bash
psql -U username -h hostname -d database_name
```

### Backup Database
```bash
pg_dump -U username -h hostname database_name > backup.sql
```

### Restore Database
```bash
psql -U username -h hostname database_name < backup.sql
```

## Admin Panel Access

| Feature | URL |
|---------|-----|
| Application | `http://your-ip` |
| Admin Dashboard | `http://your-ip/admin` |
| Products | `http://your-ip/admin/products` |
| Orders | `http://your-ip/admin/orders` |
| Users | `http://your-ip/admin/users` |
| Blog | `http://your-ip/admin/blog` |
| Settings | `http://your-ip/admin/settings` |

## File Structure
```
app/admin/
├── page.tsx                          Dashboard
├── products/
│   ├── page.tsx, new/, [id]/
├── orders/
│   ├── page.tsx, [id]/
├── users/
│   ├── page.tsx, [id]/
├── blog/
│   ├── page.tsx, new/, [id]/
└── settings/

api/admin/
├── products/[route]
├── orders/[route]
├── users/[route]
└── blog/[route]
```

## Documentation Files

| File | Purpose |
|------|---------|
| `DEPLOY_QUICK_START.md` | Start here! Quick setup |
| `DEPLOYMENT.md` | Complete detailed guide |
| `DEPLOYMENT_SUMMARY.md` | Overview of what's included |
| `ADMIN_PANEL.md` | Admin features & API |
| `ADMIN_SETUP.md` | Admin panel configuration |
| `QUICK_REFERENCE.md` | This file |
| `deploy.ps1` | Windows deployment script |
| `deploy.sh` | Mac/Linux deployment script |
| `server-init.sh` | Server initialization (run once) |

## Useful Links

- [NextAuth Documentation](https://next-auth.js.org/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Guide](https://nginx.org/en/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Common Ports
```
22   - SSH
80   - HTTP (Nginx)
443  - HTTPS/SSL
3000 - Next.js Application
5432 - PostgreSQL Database
```

## Performance Monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU usage
top

# Check active connections
netstat -an

# Find large files
du -sh *
```

## Backup Commands

```bash
# Backup app directory
tar -czf backup-app-$(date +%Y%m%d).tar.gz ~/apps/laptop-builder/

# Backup database
pg_dump -U user -h host database > backup-$(date +%Y%m%d).sql

# List backups
ls -lh backup-*
```

## SSL/HTTPS Setup

```bash
# Install certbot
sudo yum install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot-renewal
```

## OS Detection

**Check OS:**
```bash
cat /etc/os-release
# Amazon Linux 2 will show: ID="amzn"
```

## Service Management

```bash
# Start service
sudo systemctl start nginx

# Stop service
sudo systemctl stop nginx

# Restart service
sudo systemctl restart nginx

# Enable auto-start
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

## Process Management with PM2

```bash
# List processes
pm2 list

# Show detailed info
pm2 describe laptop-builder

# Save process list
pm2 save

# Load process list
pm2 resurrect

# Kill all processes
pm2 kill

# Remove app
pm2 delete laptop-builder
```

## Emergency Procedures

### Application Crashed
```bash
pm2 logs laptop-builder --err
pm2 restart laptop-builder
pm2 status
```

### Out of Disk Space
```bash
df -h
du -sh /var/log/*        # Check logs
du -sh /home/ec2-user/*  # Check home

# Clean old logs
sudo journalctl --vacuum=50M
```

### CPU/Memory High
```bash
pm2 monit                  # Check what's using resources
top -b -n 1 | head -n 20   # View top processes
pm2 restart laptop-builder # Restart app
```

### Database Connection Lost
```bash
# Test connection
psql -U user -h host -d dbname -c "SELECT 1;"

# Check DATABASE_URL
cat .env.local | grep DATABASE_URL

# Restart app to reconnect
pm2 restart laptop-builder
```

## Production Checklist

- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured
- [ ] Automated backups set up
- [ ] Monitoring enabled
- [ ] Security groups restricted
- [ ] Database backed up
- [ ] Admin users set up
- [ ] Environment variables secure
- [ ] .env.local not in git
- [ ] Performance optimized

---

**Last Updated:** 2024-06-09
**Version:** 1.0
**Deployment Type:** AWS EC2 + PM2 + Nginx
