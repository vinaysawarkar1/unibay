#!/bin/bash
# Server Initialization Script for AWS EC2
# Run this ONCE on the EC2 instance to set up the environment
# SSH into your server first, then run: bash -c "$(curl -fsSL https://your-raw-github-url/server-init.sh)"
# Or download the file and run: bash server-init.sh

set -e

echo "=========================================="
echo "EC2 Server Initialization"
echo "=========================================="
echo ""

# Update system packages
echo "1. Updating system packages..."
sudo yum update -y > /dev/null 2>&1 || sudo apt-get update -y > /dev/null 2>&1
echo "   ✓ System updated"

# Install Node.js
echo "2. Installing Node.js v20..."
if ! command -v node &> /dev/null; then
    if command -v yum &> /dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    else
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
fi
echo "   ✓ Node.js $(node --version) installed"
echo "   ✓ npm $(npm --version) installed"

# Install PM2 globally
echo "3. Installing PM2..."
if ! sudo npm list -g pm2 &> /dev/null; then
    sudo npm install -g pm2
fi
echo "   ✓ PM2 installed"

# Install Nginx
echo "4. Installing Nginx..."
if command -v yum &> /dev/null; then
    sudo yum install -y nginx
else
    sudo apt-get install -y nginx
fi
echo "   ✓ Nginx installed"

# Create application directory
echo "5. Creating application directory..."
mkdir -p ~/apps
cd ~/apps
echo "   ✓ Directory created at ~/apps"

# Clone repository
echo ""
echo "=========================================="
echo "Repository Setup"
echo "=========================================="
echo ""
echo "6. Enter your GitHub repository URL:"
echo "   Example: https://github.com/username/laptop-builder.git"
read -p "   Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "ERROR: Repository URL cannot be empty"
    exit 1
fi

if [ -d "laptop-builder" ]; then
    echo "   Repository already exists, pulling latest changes..."
    cd laptop-builder
    git pull origin main
else
    echo "   Cloning repository..."
    git clone "$REPO_URL" laptop-builder
    cd laptop-builder
fi

echo "   ✓ Repository ready at ~/apps/laptop-builder"

# Environment variables setup
echo ""
echo "=========================================="
echo "Environment Configuration"
echo "=========================================="
echo ""

if [ ! -f ".env.local" ]; then
    echo "7. Setting up .env.local file..."
    echo ""
    echo "You need to create a .env.local file with the following variables:"
    echo ""
    echo "Required:"
    echo "  DATABASE_URL=postgresql://user:password@host:5432/db_name"
    echo "  NEXTAUTH_SECRET=your-very-long-random-secret"
    echo "  NEXTAUTH_URL=https://your-domain.com (or your EC2 IP)"
    echo "  ADMIN_EMAILS=admin@example.com"
    echo ""
    echo "Optional:"
    echo "  GOOGLE_CLIENT_ID=your-google-id"
    echo "  GOOGLE_CLIENT_SECRET=your-google-secret"
    echo "  EMAIL_USER=your-email@gmail.com"
    echo "  EMAIL_PASSWORD=your-app-password"
    echo ""

    read -p "Create .env.local file now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        nano .env.local
    fi
else
    echo "   ✓ .env.local already exists"
fi

# Install dependencies
echo ""
echo "8. Installing npm dependencies..."
npm install > /dev/null 2>&1
echo "   ✓ Dependencies installed"

# Build application
echo "9. Building application..."
npm run build
echo "   ✓ Build complete"

# Setup PM2
echo ""
echo "=========================================="
echo "Application Setup"
echo "=========================================="
echo ""
echo "10. Starting application with PM2..."
pm2 start npm --name "laptop-builder" -- start
sleep 2

echo "11. Configuring PM2 for auto-startup..."
pm2 startup
sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save

echo "   ✓ Application started and configured to auto-start"

# Setup Nginx
echo "12. Configuring Nginx..."
sudo tee /etc/nginx/conf.d/laptop-builder.conf > /dev/null << 'NGINX_CONF'
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_CONF

sudo systemctl start nginx
sudo systemctl enable nginx
echo "   ✓ Nginx configured and started"

# Verify setup
echo ""
echo "=========================================="
echo "Verification"
echo "=========================================="
echo ""

echo "Application Status:"
pm2 status

echo ""
echo "Testing application..."
sleep 2
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✓ Application is running on port 3000"
else
    echo "   ✗ Application may not be running, check logs:"
    echo "     pm2 logs laptop-builder"
fi

echo ""
echo "=========================================="
echo "✓ Server Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Access your application:"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "2. Access admin panel:"
echo "   http://$(hostname -I | awk '{print $1}')/admin"
echo ""
echo "3. View logs:"
echo "   pm2 logs laptop-builder"
echo ""
echo "4. Monitor application:"
echo "   pm2 monit"
echo ""
echo "5. (Optional) Set up SSL/HTTPS with Let's Encrypt:"
echo "   sudo yum install -y certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d your-domain.com"
echo ""
echo "For more information, see DEPLOYMENT.md"
echo ""
