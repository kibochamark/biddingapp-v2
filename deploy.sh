#!/bin/bash
set -e

# =============================================================
#  OutBid.cc — Hostinger VPS Deployment Script
# =============================================================
#
#  PREREQUISITES:
#    - A Hostinger VPS (KVM 2 or higher recommended)
#    - A domain (outbid.cc) with DNS A record pointing to VPS IP
#    - SSH access to the VPS
#
#  USAGE:
#    1. SSH into your VPS:   ssh root@<YOUR_VPS_IP>
#    2. Run this script:     bash deploy.sh
#
# =============================================================

DOMAIN="outbid.cc"
APP_DIR="/root/outbid"
REPO_URL="<YOUR_GIT_REPO_URL>"   # <-- Replace with your repo URL

echo ""
echo "========================================="
echo "  Step 1/6 — System Update"
echo "========================================="
apt update && apt upgrade -y

echo ""
echo "========================================="
echo "  Step 2/6 — Install Docker & Docker Compose"
echo "========================================="
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "Docker installed."
else
    echo "Docker already installed, skipping."
fi

# Docker Compose comes with Docker now (docker compose v2)
docker compose version

echo ""
echo "========================================="
echo "  Step 3/6 — Install Git & Clone Repo"
echo "========================================="
apt install -y git

if [ -d "$APP_DIR" ]; then
    echo "App directory exists. Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

echo ""
echo "========================================="
echo "  Step 4/6 — Set Up Environment File"
echo "========================================="
if [ ! -f "$APP_DIR/.env.production" ]; then
    echo ""
    echo "ERROR: .env.production not found!"
    echo "Create it by copying the template:"
    echo "  cp .env.production.example .env.production"
    echo "  nano .env.production"
    echo "Then re-run this script."
    exit 1
fi

echo ".env.production found."

echo ""
echo "========================================="
echo "  Step 5/6 — SSL Certificate (Let's Encrypt)"
echo "========================================="
# Create certbot directories
mkdir -p certbot/conf certbot/www

# Check if SSL cert already exists
if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    echo "Obtaining SSL certificate for $DOMAIN..."

    # Start nginx temporarily for the ACME challenge
    # First, create a temp nginx config without SSL
    cat > nginx/default.conf.tmp << 'NGINX_TMP'
server {
    listen 80;
    server_name outbid.cc www.outbid.cc;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Setting up SSL...';
        add_header Content-Type text/plain;
    }
}
NGINX_TMP
    # Backup real config, use temp
    cp nginx/default.conf nginx/default.conf.bak
    cp nginx/default.conf.tmp nginx/default.conf

    # Start only nginx
    docker compose up -d nginx

    # Request certificate
    docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --email "admin@$DOMAIN" \
        --agree-tos \
        --no-eff-email

    # Stop nginx, restore real config
    docker compose down
    cp nginx/default.conf.bak nginx/default.conf
    rm nginx/default.conf.tmp nginx/default.conf.bak

    echo "SSL certificate obtained!"
else
    echo "SSL certificate already exists, skipping."
fi

echo ""
echo "========================================="
echo "  Step 6/6 — Build & Launch"
echo "========================================="
# Build and start everything
docker compose up -d --build

echo ""
echo "========================================="
echo "  DEPLOYMENT COMPLETE"
echo "========================================="
echo ""
echo "  Your app is live at: https://$DOMAIN"
echo ""
echo "  Useful commands:"
echo "    docker compose logs -f        # View logs"
echo "    docker compose down            # Stop everything"
echo "    docker compose up -d --build   # Rebuild & restart"
echo "    docker compose restart         # Restart without rebuild"
echo ""
