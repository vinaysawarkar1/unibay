# 🎯 Deployment Visual Guide

## Complete Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL COMPUTER                          │
│                                                                 │
│  1. Clone repo / Make changes                                  │
│  2. Run deployment script                                      │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Windows PowerShell:  .\deploy.ps1 "message"          │   │
│  │  Mac/Linux:          ./deploy.sh "message"            │   │
│  └────────────────────────────────────────────────────────┘   │
│                        ↓                                        │
└────────────────────────────────────────────────────────────────┘
                         │
                         │ (SSH + Git)
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              GIT REPOSITORY (GitHub/GitLab)                     │
│                                                                 │
│  • Stores your code                                            │
│  • Version control                                             │
│  • Deployment history                                          │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ (git pull)
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│           AWS EC2 INSTANCE (Amazon Linux 2)                    │
│       ec2-16-16-70-141.eu-north-1.compute.amazonaws.com        │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Port 80/443                                           │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │     NGINX (Reverse Proxy)                        │ │   │
│  │  │  • Handles HTTP/HTTPS requests                  │ │   │
│  │  │  • Routes to port 3000                          │ │   │
│  │  └────────────────────▼─────────────────────────────┘ │   │
│  │                       │                                │   │
│  │  Port 3000            │                                │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │     PM2 (Process Manager)                        │ │   │
│  │  │  • Manages Node.js process                       │ │   │
│  │  │  • Auto-restart on crash                        │ │   │
│  │  │  • Auto-start on reboot                         │ │   │
│  │  └────────────────────▼─────────────────────────────┘ │   │
│  │                       │                                │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │     NEXT.JS APPLICATION                          │ │   │
│  │  │  • Admin panel (/admin)                          │ │   │
│  │  │  • Product management                            │ │   │
│  │  │  • Order management                              │ │   │
│  │  │  • User management                               │ │   │
│  │  │  • Blog management                               │ │   │
│  │  └────────────────────▼─────────────────────────────┘ │   │
│  │                       │                                │   │
│  │  ┌──────────────────────────────────────────────────┐ │   │
│  │  │     PRISMA ORM (Database Layer)                  │ │   │
│  │  │  • Manages database queries                      │ │   │
│  │  └────────────────────▼─────────────────────────────┘ │   │
│  │                       │                                │   │
│  └───────────────────────┼────────────────────────────────┘   │
│                          │                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │     POSTGRESQL DATABASE                              │    │
│  │  • Stores products, orders, users, blog posts       │    │
│  │  • Can be local or RDS                              │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                         ↑
                         │
                  Users can access:
          http://your-domain-or-ip/admin
```

## Step-by-Step Visual Deployment

### Phase 1: Preparation (Local Machine)

```
┌─────────────────────────────────┐
│  Your Computer                  │
├─────────────────────────────────┤
│ 1. Make code changes            │
│    └─ Create admin panel files  │
├─────────────────────────────────┤
│ 2. Stage changes                │
│    └─ git add .                 │
├─────────────────────────────────┤
│ 3. Commit                       │
│    └─ git commit -m "message"   │
├─────────────────────────────────┤
│ 4. Push to repository           │
│    └─ git push origin main      │
├─────────────────────────────────┤
│ 5. Run deployment script        │
│    └─ .\deploy.ps1 (Windows)    │
│    └─ ./deploy.sh (Mac/Linux)   │
└─────────────────────────────────┘
```

### Phase 2: SSH Authentication

```
┌──────────────────────────────────┐
│  SSH Connection Established      │
├──────────────────────────────────┤
│ Protocol: SSH (Port 22)          │
│ Key: unibay.pem                  │
│ User: ec2-user                   │
│ Host: ec2-16-16-70-141...        │
│ Status: ✓ CONNECTED             │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  Remote Commands Execute         │
├──────────────────────────────────┤
│ cd ~/apps/laptop-builder         │
│ git pull origin main             │
│ npm install                      │
│ npm run build                    │
│ pm2 restart laptop-builder       │
└──────────────────────────────────┘
```

### Phase 3: Build & Deployment

```
Step 1: Code Update
┌─────────────────────────┐
│ git pull origin main    │
└──────────────┬──────────┘
               ↓
         ✓ Code Updated

Step 2: Dependency Installation
┌─────────────────────────┐
│ npm install             │
└──────────────┬──────────┘
               ↓
         ✓ Dependencies Installed

Step 3: Build Application
┌──────────────────────────────────────┐
│ npm run build                        │
│                                      │
│ • Compiles TypeScript → JavaScript   │
│ • Optimizes code                     │
│ • Generates .next folder             │
└──────────────┬───────────────────────┘
               ↓
         ✓ Build Complete

Step 4: Restart Application
┌────────────────────────────┐
│ pm2 restart laptop-builder │
│                            │
│ • Stops old process        │
│ • Starts new process       │
│ • Monitors health          │
└──────────────┬─────────────┘
               ↓
         ✓ Application Running

Step 5: Verification
┌─────────────────────────────────┐
│ Check Status                    │
│ • pm2 status → ✓ Online         │
│ • pm2 logs → Showing logs       │
│ • curl http://localhost:3000    │
└──────────────┬──────────────────┘
               ↓
         ✓ Ready for Users
```

## User Access Flow

```
User opens browser
         ↓
    http://your-domain
         ↓
┌────────────────────────────────┐
│  NGINX (Port 80)               │
│  ┌──────────────────────────┐  │
│  │  HTTP Request Handler   │  │
│  │  • Receives request     │  │
│  │  • Checks SSL (if HTTPS)│  │
│  │  • Routes to backend    │  │
│  └──────────────────────────┘  │
└────────────────────┬───────────┘
                     ↓
┌────────────────────────────────┐
│  Next.js App (Port 3000)       │
│  ┌──────────────────────────┐  │
│  │  Request Router          │  │
│  │  /              → Home   │  │
│  │  /admin         → Admin  │  │
│  │  /api/admin/*   → API    │  │
│  └──────────────────────────┘  │
└────────────────────┬───────────┘
                     ↓
┌────────────────────────────────┐
│  Admin Panel UI Components     │
│  ┌──────────────────────────┐  │
│  │  Dashboard               │  │
│  │  Products                │  │
│  │  Orders                  │  │
│  │  Users                   │  │
│  │  Blog                    │  │
│  │  Settings                │  │
│  └──────────────────────────┘  │
└────────────────────┬───────────┘
                     ↓
┌────────────────────────────────┐
│  Prisma ORM (Database Layer)   │
│  ┌──────────────────────────┐  │
│  │  Query Builder           │  │
│  │  • Products → SELECT *   │  │
│  │  • Orders → JOIN         │  │
│  │  • Users → WHERE         │  │
│  └──────────────────────────┘  │
└────────────────────┬───────────┘
                     ↓
┌────────────────────────────────┐
│  PostgreSQL Database           │
│  ┌──────────────────────────┐  │
│  │  Tables                  │  │
│  │  • users                 │  │
│  │  • products              │  │
│  │  • orders                │  │
│  │  • blog_posts            │  │
│  │  • addresses             │  │
│  └──────────────────────────┘  │
└────────────────────┬───────────┘
                     ↓
               Response Data
                     ↓
             Rendered to User
```

## File Deployment Timeline

```
Time: 0:00 - Deploy Script Starts
┌──────────────────────────────────┐
│ Step 1: Git Commit (10 seconds)  │
│ ✓ Files staged                   │
│ ✓ Commit created                 │
└──────────────────────────────────┘
         ↓
Time: 0:10 - Git Push
┌──────────────────────────────────┐
│ Step 2: Git Push (20 seconds)    │
│ ✓ Pushed to GitHub/GitLab        │
│ ✓ Remote updated                 │
└──────────────────────────────────┘
         ↓
Time: 0:30 - SSH & Pull
┌──────────────────────────────────┐
│ Step 3: SSH & Git Pull (10 sec)  │
│ ✓ Connected to EC2               │
│ ✓ Latest code pulled             │
└──────────────────────────────────┘
         ↓
Time: 0:40 - Dependencies
┌──────────────────────────────────┐
│ Step 4: npm install (30-60 sec)  │
│ ✓ Packages downloaded            │
│ ✓ Dependencies resolved          │
└──────────────────────────────────┘
         ↓
Time: 1:10-1:40 - Build
┌──────────────────────────────────┐
│ Step 5: npm run build (30 sec)   │
│ ✓ TypeScript compiled            │
│ ✓ Next.js optimized              │
│ ✓ Bundles created                │
└──────────────────────────────────┘
         ↓
Time: 1:40 - Restart
┌──────────────────────────────────┐
│ Step 6: PM2 Restart (5 seconds)  │
│ ✓ Old process terminated         │
│ ✓ New process started            │
│ ✓ Health check passed            │
└──────────────────────────────────┘
         ↓
Time: 1:45 - Complete
┌──────────────────────────────────┐
│ ✓ DEPLOYMENT SUCCESSFUL          │
│ ✓ Application Live               │
│ ✓ Users can access               │
└──────────────────────────────────┘

Total Time: ~1 minute 45 seconds
```

## First-Time Setup Timeline

```
0:00 ├─ SSH into EC2
     │
0:02 ├─ Run: bash server-init.sh
     │
0:05 ├─ System packages update (5-10 min)
     │  └─ yum update -y
     │
0:15 ├─ Install Node.js (2-3 min)
     │  └─ curl & npm setup
     │
0:20 ├─ Install PM2 & Nginx (1 min)
     │  └─ npm install -g pm2
     │  └─ yum install -y nginx
     │
0:25 ├─ Git clone/pull (2 min)
     │  └─ Clone repository
     │
0:30 ├─ Setup .env.local
     │  └─ nano .env.local (manual input)
     │  └─ Database URL
     │  └─ NextAuth secret
     │  └─ Admin emails
     │
0:40 ├─ npm install (30-60 min)
     │  └─ Download & install all packages
     │
1:10 ├─ npm run build (30 min)
     │  └─ Compile TypeScript
     │  └─ Generate Next.js bundles
     │
1:40 ├─ Start with PM2 (1 min)
     │  └─ pm2 start npm...
     │  └─ pm2 startup
     │
1:45 ├─ Configure Nginx (1 min)
     │  └─ Create config
     │  └─ Start service
     │
1:47 └─ READY!
      └─ Application online

Total: ~2 hours (mostly npm packages)
Most of this is automated!
```

## Database Connection Flow

```
┌─────────────────────────────┐
│  Next.js Application        │
│  (Running on port 3000)     │
└────────────────┬────────────┘
                 │
                 │ (DATABASE_URL)
                 ↓
┌────────────────────────────────┐
│  Prisma Client                 │
│  • Generates query builder     │
│  • Manages connections         │
│  • Handles migrations          │
└────────────────┬───────────────┘
                 │
                 │ (PostgreSQL Protocol)
                 ↓
┌────────────────────────────────┐
│  Network                       │
│  • TCP/IP Connection           │
│  • Port 5432 (PostgreSQL)      │
│  • Encrypted if using SSL      │
└────────────────┬───────────────┘
                 │
                 ↓
┌──────────────────────────────────────┐
│  PostgreSQL Server                   │
│                                      │
│  ┌───────────────────────────────┐  │
│  │  Tables                       │  │
│  │  • User (with admin role)     │  │
│  │  • Product (all details)      │  │
│  │  • Order (status tracking)    │  │
│  │  • Address (user addresses)   │  │
│  │  • BlogPost (content)         │  │
│  │  • OrderItem (line items)     │  │
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Admin Role Flow

```
User Login
    ↓
┌─────────────────────────────┐
│  Check Email                │
│  in ADMIN_EMAILS (env var)  │
└──────────┬──────────────────┘
           ↓
         ✓ YES → Role: admin
           │
           ↓
   ┌─────────────────────────┐
   │  Database Updated       │
   │  user.role = 'admin'    │
   └─────────────┬───────────┘
                 ↓
   ┌─────────────────────────┐
   │  Grant Access           │
   │  • /admin (dashboard)   │
   │  • /api/admin/*         │
   │  • All management tools │
   └─────────────────────────┘

         ✗ NO → Role: user
           │
           ↓
   ┌─────────────────────────┐
   │  Redirect               │
   │  → Public pages only    │
   │  → No admin access      │
   └─────────────────────────┘
```

## Feature Access Matrix

```
┌─────────────────┬──────┬──────┐
│ Feature         │ User │ Admin│
├─────────────────┼──────┼──────┤
│ View Products   │  ✓   │  ✓   │
│ Manage Products │  ✗   │  ✓   │
│ View Orders     │  ✓*  │  ✓   │
│ Manage Orders   │  ✗   │  ✓   │
│ Manage Users    │  ✗   │  ✓   │
│ Admin Panel     │  ✗   │  ✓   │
│ Settings        │  ✗   │  ✓   │
├─────────────────┼──────┼──────┤
│ * Own orders only
```

## Monitoring Dashboard

```
┌──────────────────────────────────────────┐
│  PM2 Monitoring (pm2 monit)              │
├──────────────────────────────────────────┤
│                                          │
│  Process: laptop-builder                │
│  Status: ■ online                        │
│  CPU: 15% ████░░░░░░                   │
│  MEM: 280 MB █████░░░░░░░               │
│  Uptime: 5 days 12h 34m                 │
│  Restarts: 0                            │
│                                          │
│  Logs: 234 KB                           │
│  Last restart: 5 days ago               │
│                                          │
├──────────────────────────────────────────┤
│  Q: Quit  L: Lock  H: Help  C: Clear    │
└──────────────────────────────────────────┘
```

## Troubleshooting Decision Tree

```
Application not responding?
        ↓
    ┌───┴───┐
    ↓       ↓
Check    Check
Logs     Processes
    ↓       ↓
Error?   Crashed?
    ↓       ↓
   FIX    RESTART
    ↓       ↓
Restart Verify
            ↓
        Running?
        ├─ YES → Check URL
        │        ├─ Nginx issue?
        │        │  └─ Check config
        │        └─ App issue?
        │           └─ Check logs
        └─ NO → Check errors
                └─ Database?
                └─ Environment?
                └─ Port conflict?
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Network                           │
│  • AWS Security Groups (allow 22,80,443)    │
│  • SSH key (.pem file) required             │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│  Layer 2: Application                       │
│  • NextAuth authentication                  │
│  • Admin role verification                  │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│  Layer 3: Data                              │
│  • Server-side validation                   │
│  • SQL injection prevention (Prisma)        │
│  • HTTPS encryption (if configured)         │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│  Layer 4: Database                          │
│  • User authentication                      │
│  • Database access control                  │
│  • Backups & recovery                       │
└─────────────────────────────────────────────┘
```

---

## Quick Legend

```
✓  = Successful/Running
✗  = Failed/Not Running
■  = Status indicator
→  = Flow/Direction
└─ = Sub-item
↓  = Next step
```
