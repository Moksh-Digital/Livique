# Livique Droplet Deployment Commands

## Step 1: SSH into Your Droplet
```bash
ssh root@64.227.146.210
```

## Step 2: Navigate to Project & Pull Latest Changes
```bash
cd /path/to/livique-ecom  # Update with your actual path
git pull origin main
```

## Step 3: Update Backend .env File
```bash
# Option A: Using nano editor
nano backend/.env

# Then update/add these lines:
# PORT=5000
# NODE_ENV=production
# BACKEND_URL=https://api.livique.co.in
# CLIENT_URL=https://www.livique.co.in
# ... rest of your vars
```

**OR Option B: Using sed (automated)**
```bash
cd /path/to/livique-ecom/backend

# Add or update NODE_ENV
if grep -q "NODE_ENV" .env; then
  sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
else
  sed -i '1i NODE_ENV=production' .env
fi

# Add or update BACKEND_URL
if grep -q "BACKEND_URL" .env; then
  sed -i 's|^BACKEND_URL=.*|BACKEND_URL=https://api.livique.co.in|' .env
else
  sed -i '1i BACKEND_URL=https://api.livique.co.in' .env
fi

# Add or update CLIENT_URL
if grep -q "CLIENT_URL" .env; then
  sed -i 's|^CLIENT_URL=.*|CLIENT_URL=https://www.livique.co.in|' .env
else
  sed -i '1i CLIENT_URL=https://www.livique.co.in' .env
fi
```

## Step 4: Verify .env File
```bash
cat backend/.env
```

## Step 5: Install/Update Nginx (if not already installed)
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

## Step 6: Create Nginx Configuration File

```bash
# Create the config file
sudo nano /etc/nginx/sites-available/livique
```

**⚠️ PASTE ONLY THE HTTP VERSION FIRST (Step 1 config above)**

This allows Let's Encrypt to validate your domains before we enable HTTPS.
```nginx
# ==========================================
# STEP 1: HTTP ONLY - Get certificates first
# ==========================================

# Backend API
server {
    listen 80;
    server_name api.livique.co.in;

    # Logging
    access_log /var/log/nginx/livique-api.access.log;
    error_log /var/log/nginx/livique-api.error.log;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Reverse Proxy to Backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Frontend
server {
    listen 80;
    server_name www.livique.co.in livique.co.in;

    # Logging
    access_log /var/log/nginx/livique-web.access.log;
    error_log /var/log/nginx/livique-web.error.log;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Root directory for frontend build
    root /root/livique/dist;  # Update with your actual path
    index index.html;

    # Serve static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback - route all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**⚠️ IMPORTANT: After getting SSL certificates (Step 8), replace this entire config with the HTTPS version below!**

```nginx
# ==========================================
# STEP 2: HTTPS with SSL (After certbot)
# ==========================================

# Redirect HTTP to HTTPS for API
server {
    listen 80;
    server_name api.livique.co.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS Backend API (Port 443)
server {
    listen 443 ssl http2;
    server_name api.livique.co.in;

    # SSL Certificates (From Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.livique.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.livique.co.in/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/livique-api.access.log;
    error_log /var/log/nginx/livique-api.error.log;

    # Reverse Proxy to Backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Redirect HTTP to HTTPS for Frontend
server {
    listen 80;
    server_name www.livique.co.in livique.co.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS Frontend (Port 443)
server {
    listen 443 ssl http2;
    server_name www.livique.co.in livique.co.in;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/livique.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/livique.co.in/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/livique-web.access.log;
    error_log /var/log/nginx/livique-web.error.log;

    # Root directory for frontend build
    root /root/livique/dist;  # Update with your actual path
    index index.html;

    # Serve static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback - route all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Step 7: Enable Nginx Site & Test Configuration
```bash
# Create symbolic link to enable the site
sudo ln -sf /etc/nginx/sites-available/livique /etc/nginx/sites-enabled/livique

# Remove default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

## Step 8: Install SSL Certificates (Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate for API domain
sudo certbot certonly --standalone -d api.livique.co.in

# Get certificate for Frontend domain
sudo certbot certonly --standalone -d www.livique.co.in -d livique.co.in

# Verify certificates were created
sudo ls -la /etc/letsencrypt/live/
```

## Step 9: Setup Auto-Renewal for SSL Certificates
```bash
# Check if auto-renewal is enabled
sudo systemctl status certbot.timer

# Enable auto-renewal (if not enabled)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

## Step 10: Rebuild & Restart Backend
```bash
cd /path/to/livique-ecom/backend

# Install dependencies (if needed)
npm install

# Restart Node server with PM2 (if using PM2)
pm2 restart all

# OR manually restart
npm start  # (Run in background or use nohup)
```

## Step 11: Build & Deploy Frontend (if needed)
```bash
cd /path/to/livique-ecom

# Install dependencies
npm install

# Build for production
npm run build

# Verify build was created
ls -la dist/
```

## Step 12: Verify Everything is Working
```bash
# Check Nginx status
sudo systemctl status nginx

# Check if backend is running
curl http://localhost:5000

# Check Nginx logs
sudo tail -f /var/log/nginx/livique-api.error.log
sudo tail -f /var/log/nginx/livique-api.access.log

# Check backend process (if using PM2)
pm2 list
pm2 logs
```

## Step 13: Test Your Application
Open in browser:
- Frontend: https://www.livique.co.in or https://livique.co.in
- API Health: https://api.livique.co.in/

## Troubleshooting Commands

### If Nginx won't start
```bash
sudo nginx -t  # Check for syntax errors
sudo systemctl restart nginx
sudo journalctl -u nginx -xe  # View detailed logs
```

### If Backend connection fails
```bash
# Check if port 5000 is listening
sudo netstat -tlnp | grep 5000
# OR
sudo lsof -i :5000

# Check PM2 status
pm2 status
pm2 logs
```

### If SSL certificates fail
```bash
# Renew specific certificate
sudo certbot renew --cert-name api.livique.co.in

# Check certificate details
sudo certbot certificates
```

### Check port availability
```bash
# Check all listening ports
sudo netstat -tlnp
# OR
sudo ss -tlnp
```

### View Nginx error logs
```bash
sudo tail -100 /var/log/nginx/livique-api.error.log
sudo tail -100 /var/log/nginx/livique-web.error.log
```

---

## Quick Summary of All Commands in Order:

```bash
# 1. SSH into droplet
ssh root@64.227.146.210

# 2. Navigate and pull latest code
cd /root/livique
git pull origin main

# 3. Update .env automatically
cd backend
sed -i '1i NODE_ENV=production' .env 2>/dev/null || true
sed -i 's|^BACKEND_URL=.*|BACKEND_URL=https://api.livique.co.in|' .env || sed -i '1i BACKEND_URL=https://api.livique.co.in' .env
sed -i 's|^CLIENT_URL=.*|CLIENT_URL=https://www.livique.co.in|' .env || sed -i '1i CLIENT_URL=https://www.livique.co.in' .env
echo "=== Updated .env ===" && cat .env

# 4. Install Nginx
sudo apt update && sudo apt install -y nginx

# 5. Create directory for Let's Encrypt validation
sudo mkdir -p /var/www/certbot

# 6. Create Nginx config with HTTP only (for SSL certificate validation)
sudo tee /etc/nginx/sites-available/livique > /dev/null << 'EOF'
# Backend API
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

# Frontend
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

# 7. Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/livique /etc/nginx/sites-enabled/livique
sudo rm -f /etc/nginx/sites-enabled/default

# 8. Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx reloaded successfully"

# 9. Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# 10. Get SSL certificate for API domain
echo "Getting SSL certificate for api.livique.co.in..."
sudo certbot certonly --webroot -w /var/www/certbot -d api.livique.co.in --non-interactive --agree-tos -m mokshdigitalco@gmail.com

# 11. Get SSL certificate for Frontend domains
echo "Getting SSL certificate for livique.co.in..."
sudo certbot certonly --webroot -w /var/www/certbot -d www.livique.co.in -d livique.co.in --non-interactive --agree-tos -m mokshdigitalco@gmail.com

# 12. Verify certificates were created
echo "=== Checking certificates ===" && sudo ls -la /etc/letsencrypt/live/

# 13. Update Nginx config to use HTTPS
sudo tee /etc/nginx/sites-available/livique > /dev/null << 'EOF'
# Redirect HTTP to HTTPS for API
server {
    listen 80;
    server_name api.livique.co.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS Backend API
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

# Redirect HTTP to HTTPS for Frontend
server {
    listen 80;
    server_name www.livique.co.in livique.co.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS Frontend
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

# 14. Test HTTPS config
sudo nginx -t

# 15. Reload Nginx with HTTPS enabled
sudo systemctl reload nginx
echo "✅ Nginx reloaded with HTTPS"

# 16. Enable auto-renewal for certificates
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 17. Rebuild and restart backend
cd /root/livique/backend
npm install
pm2 restart all

# 18. Build frontend
cd /root/livique
npm install
npm run build

# 19. Verify everything is running
echo "=== Checking services ===" 
sudo systemctl status nginx
pm2 status

# 20. Test your application
echo "=== Testing application ===" 
curl -I http://localhost:5000
curl -I https://api.livique.co.in/
echo "✅ All setup complete!"
```

---

## If You Get SSL Certificate Errors

**If certbot fails** because port 443 is already in use:

```bash
# Kill any process using port 443
sudo lsof -i :443
sudo kill -9 <PID>

# Or stop Nginx temporarily
sudo systemctl stop nginx

# Then rerun certbot commands
sudo certbot certonly --webroot -w /var/www/certbot -d api.livique.co.in --non-interactive --agree-tos -m mokshdigitalco@gmail.com
sudo certbot certonly --webroot -w /var/www/certbot -d www.livique.co.in -d livique.co.in --non-interactive --agree-tos -m mokshdigitalco@gmail.com

# Restart Nginx
sudo systemctl start nginx
```

## If Nginx Config has Errors

```bash
# Check for syntax errors
sudo nginx -t

# View detailed error log
sudo tail -50 /var/log/nginx/livique-api.error.log

# View access log
sudo tail -50 /var/log/nginx/livique-api.access.log
```

