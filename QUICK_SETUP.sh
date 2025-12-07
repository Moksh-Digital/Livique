#!/bin/bash
# Livique Droplet Quick Setup Script
# Copy this entire script and paste into your droplet terminal

set -e  # Exit on error

echo "🚀 Starting Livique deployment..."

# 1. Navigate to project
cd /root/livique || { echo "❌ /root/livique not found. Update path."; exit 1; }
git pull origin main

# 2. Update .env
cd backend
sed -i '1i NODE_ENV=production' .env 2>/dev/null || true
sed -i 's|^BACKEND_URL=.*|BACKEND_URL=https://api.livique.co.in|' .env || sed -i '1i BACKEND_URL=https://api.livique.co.in' .env
sed -i 's|^CLIENT_URL=.*|CLIENT_URL=https://www.livique.co.in|' .env || sed -i '1i CLIENT_URL=https://www.livique.co.in' .env
echo "✅ .env updated"

# 3. Install Nginx
sudo apt update && sudo apt install -y nginx
echo "✅ Nginx installed"

# 4. Create certbot directory
sudo mkdir -p /var/www/certbot

# 5. Create HTTP-only Nginx config for certificate validation
echo "📝 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/livique > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.livique.co.in;
    access_log /var/log/nginx/livique-api.access.log;
    error_log /var/log/nginx/livique-api.error.log;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

server {
    listen 80;
    server_name www.livique.co.in livique.co.in;
    access_log /var/log/nginx/livique-web.access.log;
    error_log /var/log/nginx/livique-web.error.log;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    root /root/livique/dist;
    index index.html;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 6. Enable Nginx
sudo ln -sf /etc/nginx/sites-available/livique /etc/nginx/sites-enabled/livique
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx HTTP configured"

# 7. Install Certbot
echo "📦 Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# 8. Get SSL certificates
echo "🔐 Getting SSL certificates..."
sudo certbot certonly --webroot -w /var/www/certbot -d api.livique.co.in --non-interactive --agree-tos -m mokshdigitalco@gmail.com
sudo certbot certonly --webroot -w /var/www/certbot -d www.livique.co.in -d livique.co.in --non-interactive --agree-tos -m mokshdigitalco@gmail.com
echo "✅ SSL certificates obtained"

# 9. Update Nginx config to HTTPS
echo "📝 Updating Nginx for HTTPS..."
sudo tee /etc/nginx/sites-available/livique > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.livique.co.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.livique.co.in;
    
    ssl_certificate /etc/letsencrypt/live/api.livique.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.livique.co.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    access_log /var/log/nginx/livique-api.access.log;
    error_log /var/log/nginx/livique-api.error.log;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

server {
    listen 80;
    server_name www.livique.co.in livique.co.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.livique.co.in livique.co.in;
    
    ssl_certificate /etc/letsencrypt/live/livique.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/livique.co.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    access_log /var/log/nginx/livique-web.access.log;
    error_log /var/log/nginx/livique-web.error.log;
    
    root /root/livique/dist;
    index index.html;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 10. Reload Nginx with HTTPS
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx HTTPS configured"

# 11. Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
echo "✅ SSL auto-renewal enabled"

# 12. Restart backend
echo "🔄 Restarting backend..."
cd /root/livique/backend
npm install
pm2 restart all || npm start &

# 13. Build frontend
echo "🏗️  Building frontend..."
cd /root/livique
npm install
npm run build
echo "✅ Frontend built"

# 14. Final checks
echo ""
echo "================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "================================"
echo ""
echo "Testing services:"
sudo systemctl status nginx --no-pager
echo ""
pm2 status
echo ""
echo "🌐 Access your app at:"
echo "   Frontend: https://www.livique.co.in"
echo "   API: https://api.livique.co.in"
echo ""
echo "📋 To view logs:"
echo "   nginx: sudo tail -f /var/log/nginx/livique-api.error.log"
echo "   backend: pm2 logs"
