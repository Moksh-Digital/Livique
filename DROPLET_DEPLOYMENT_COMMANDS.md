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

**Paste the following content:**
```nginx
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

    # SSL Certificates (Using Let's Encrypt Certbot - see Step 7)
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
    root /path/to/livique-ecom/dist;  # Update with your actual path
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
cd /path/to/livique-ecom
git pull origin main

# 3. Update .env (choose one method)
nano backend/.env  # Manual edit

# 4. Install Nginx
sudo apt update && sudo apt install -y nginx

# 5. Create Nginx config
sudo nano /etc/nginx/sites-available/livique
# (Paste the nginx config from Step 6)

# 6. Enable and test Nginx
sudo ln -sf /etc/nginx/sites-available/livique /etc/nginx/sites-enabled/livique
sudo nginx -t && sudo systemctl reload nginx

# 7. Install SSL certificates
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d api.livique.co.in
sudo certbot certonly --standalone -d www.livique.co.in -d livique.co.in

# 8. Rebuild and restart backend
cd backend && npm install && pm2 restart all

# 9. Build frontend
cd .. && npm install && npm run build

# 10. Verify
curl https://api.livique.co.in/
```

