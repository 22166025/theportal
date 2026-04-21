# ThePortal - Deployment Guide for Server Setup

**Complete Step-by-Step Guide to Deploy ThePortal on Your Own Server**

This guide covers deploying ThePortal on:
- ✅ Ubuntu/Debian Linux
- ✅ CentOS/RHEL Linux  
- ✅ Windows Server
- ✅ Any VPS/Dedicated Server with Node.js support

---

## 📋 Prerequisites

Before starting, ensure you have:
1. **SSH access** to your server (or local access)
2. **Admin/sudo privileges** on the server
3. **Domain name** (optional, but recommended)
4. **GitHub account** with the repository cloned
5. **TMDb API key** (get free from https://www.themoviedb.org/settings/api)

---

## 🚀 Step-by-Step Deployment

### Step 1: Connect to Your Server

#### Linux/macOS:
```bash
ssh username@your_server_ip
```

#### Windows (using PuTTY or similar):
- Host: `your_server_ip`
- Port: `22`
- Username: `username`
- Password: `your_password`

---

### Step 2: Install Node.js and npm

#### Ubuntu/Debian:
```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### CentOS/RHEL:
```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

#### Windows Server:
1. Download installer from https://nodejs.org/
2. Run installer, accept defaults
3. Verify in PowerShell:
   ```powershell
   node --version
   npm --version
   ```

---

### Step 3: Install and Start MongoDB

#### Option A: Local MongoDB Installation (Linux)

**Ubuntu/Debian:**
```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod  # Enable on startup

# Verify
sudo systemctl status mongod
```

**CentOS/RHEL:**
```bash
# Add MongoDB repository
sudo tee /etc/yum.repos.d/mongodb-org-5.0.repo << EOF
[mongodb-org-5.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/5.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc
EOF

# Install MongoDB
sudo yum install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod  # Enable on startup

# Verify
sudo systemctl status mongod
```

**Windows Server:**
1. Download installer from https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB runs as Windows Service automatically

#### Option B: Use MongoDB Atlas (Cloud)

**Recommended for most servers** - No local installation needed

1. Sign up at https://www.mongodb.com/cloud/atlas (free tier: 512MB)
2. Create a cluster
3. Create database user (username/password)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/theportal`
5. Add your server IP to Atlas whitelist: Security → Network Access
6. Use this connection string in your `.env` file

---

### Step 4: Clone Repository from GitHub

```bash
# Create app directory
mkdir -p ~/theportal
cd ~/theportal

# Clone repository (use your GitHub URL)
git clone https://github.com/your-username/theportal.git
cd theportal

# Or if using SSH key:
# git clone git@github.com:your-username/theportal.git
```

---

### Step 5: Install Dependencies

```bash
# Install npm packages
npm install

# Verify installation (should list all packages)
npm list --depth=0
```

---

### Step 6: Create Environment Variables

Create `.env` file in the root directory:

```bash
# Linux/macOS
nano .env

# Windows (using Notepad)
# Create a text file named .env in your project root
```

Add these variables (update with your actual values):

```env
# TMDb API Key (get from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here

# MongoDB Connection String
# Option 1 - Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/theportal

# Option 2 - MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal

# JWT Secret (use long random string - change this!)
JWT_SECRET=generate_a_long_random_string_here_at_least_32_characters

# Server Port
PORT=3000
```

**Generate a random JWT_SECRET:**
```bash
# On Linux/macOS:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

**Save the file:**
- Linux: Press Ctrl+O, Enter, Ctrl+X
- Windows: Ctrl+S

---

### Step 7: Test Application Locally

```bash
# Start the server
npm start

# Expected output:
# 🎬 ThePortal server running at http://localhost:3000
# ✅ MongoDB Connected successfully

# Test in another terminal:
curl http://localhost:3000
# Should return HTML of homepage

# Stop server: Ctrl+C
```

---

### Step 8: Setup Process Manager (Keep App Running)

#### Option A: PM2 (Recommended)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start server.js --name "theportal"

# Configure to restart on system reboot
pm2 startup
pm2 save

# View logs
pm2 logs theportal

# Monitor
pm2 monit

# Stop/Restart
pm2 stop theportal
pm2 restart theportal
```

#### Option B: Systemd Service (Linux)

Create `/etc/systemd/system/theportal.service`:

```bash
sudo nano /etc/systemd/system/theportal.service
```

Add this content (update paths and user):

```ini
[Unit]
Description=ThePortal Movie App
After=network.target mongodb.service

[Service]
User=www-data
WorkingDirectory=/home/username/theportal
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable theportal
sudo systemctl start theportal
sudo systemctl status theportal
```

#### Option C: Supervisor (All Linux)

```bash
# Install supervisor
sudo apt install supervisor  # Ubuntu/Debian
# or
sudo yum install supervisor  # CentOS/RHEL

# Create config
sudo nano /etc/supervisor/conf.d/theportal.conf
```

Add:

```ini
[program:theportal]
command=/usr/bin/node /home/username/theportal/server.js
directory=/home/username/theportal
autostart=true
autorestart=true
stderr_logfile=/var/log/theportal.err.log
stdout_logfile=/var/log/theportal.out.log
environment=NODE_ENV=production
```

Start:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start theportal
```

---

### Step 9: Setup Web Server (Nginx or Apache)

#### Option A: Nginx (Recommended - Lightweight)

**Install Nginx:**

```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

**Configure Nginx:**

```bash
sudo nano /etc/nginx/sites-available/theportal
```

Add this configuration:

```nginx
upstream theportal {
    server localhost:3000;
}

server {
    listen 80;
    listen [::]:80;
    
    server_name your_domain.com www.your_domain.com;
    
    # Redirect HTTP to HTTPS (optional, after setting up SSL)
    # return 301 https://$server_name$request_uri;
    
    location / {
        proxy_pass http://theportal;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable and restart:**

```bash
# Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/theportal /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Option B: Apache

**Install Apache:**

```bash
sudo apt install apache2
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
```

**Configure Apache:**

Create `/etc/apache2/sites-available/theportal.conf`:

```apache
<VirtualHost *:80>
    ServerName your_domain.com
    ServerAlias www.your_domain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # Cache headers
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

Enable and restart:

```bash
sudo a2ensite theportal
sudo a2dissite 000-default
sudo apache2ctl configtest
sudo systemctl restart apache2
```

---

### Step 10: Setup SSL Certificate (HTTPS)

#### Using Let's Encrypt (Free)

**Install Certbot:**

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx  # For Nginx
# or
sudo apt install certbot python3-certbot-apache  # For Apache

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx  # For Nginx
```

**Get Certificate:**

```bash
# For Nginx
sudo certbot --nginx -d your_domain.com -d www.your_domain.com

# For Apache
sudo certbot --apache -d your_domain.com -d www.your_domain.com

# Standalone (no web server)
sudo certbot certonly --standalone -d your_domain.com -d www.your_domain.com
```

**Auto-Renewal:**

```bash
# Certbot auto-renewal runs daily by default
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check status
sudo systemctl status certbot.timer
```

---

### Step 11: Setup Firewall (Security)

#### UFW (Ubuntu/Debian)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Check rules
sudo ufw status
```

#### Firewall-cmd (CentOS/RHEL)

```bash
# Start firewall
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow ports
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp

# Reload
sudo firewall-cmd --reload
```

#### Windows Firewall

Use Windows Defender Firewall settings to allow:
- Port 22 (SSH, if using remote access)
- Port 80 (HTTP)
- Port 443 (HTTPS)

---

### Step 12: Setup Monitoring and Logs

#### View PM2 Logs

```bash
# Real-time logs
pm2 logs theportal

# Save logs to file
pm2 save
pm2 logs theportal > ~/theportal.log
```

#### Setup Log Rotation

```bash
# Install pm2-logrotate
pm2 install pm2-logrotate

# Verify
pm2 status
```

---

### Step 13: Update DNS Records

1. Go to your domain registrar
2. Add A record pointing to your server IP:
   - Type: A
   - Name: @ (or subdomain)
   - Value: your_server_ip
   - TTL: 3600

3. Wait 15-30 minutes for DNS to propagate

4. Test: `ping your_domain.com`

---

## 📝 Post-Deployment Checklist

- [ ] MongoDB is running and accessible
- [ ] `.env` file is created with all variables
- [ ] `.env` is added to `.gitignore`
- [ ] Application starts without errors: `npm start`
- [ ] Web server (Nginx/Apache) is configured
- [ ] Process manager (PM2/Systemd) is running
- [ ] SSL certificate is installed
- [ ] Firewall rules are configured
- [ ] Domain DNS is pointing to server IP
- [ ] Application accessible at `https://your_domain.com`

---

## 🔒 Security Best Practices

1. **Change JWT_SECRET**: Use strong, random string (32+ characters)
2. **Update TMDB_API_KEY**: Use your own key, not shared one
3. **Enable HTTPS**: Always use SSL certificate
4. **Restrict MongoDB**: Use firewall rules, authentication required
5. **Regular Updates**: Keep Node.js, npm, and dependencies updated
   ```bash
   npm outdated           # Check for updates
   npm update             # Update packages
   ```
6. **Backup Database**: Regular MongoDB backups
   ```bash
   mongodump --out ~/backup  # Local MongoDB
   ```
7. **Monitor Logs**: Check logs regularly for errors
   ```bash
   pm2 logs theportal
   ```

---

## 🐛 Troubleshooting

### Application won't start
```bash
# Check for errors
npm start

# Debug with verbose logging
DEBUG=* npm start
```

### Port 3000 already in use
```bash
# Find process using port 3000
lsof -i :3000  # Linux/macOS
# or
netstat -tuln | grep 3000  # Linux

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=8080
```

### MongoDB connection failed
```bash
# Check MongoDB is running
systemctl status mongod  # Linux
# or
Get-Service MongoDB  # Windows

# Check connection string in .env
# Test connection
mongo "mongodb://localhost:27017"
```

### TMDB API errors
```bash
# Verify API key is valid
# Check TMDb account hasn't exceeded rate limits (40 requests/10 seconds)
# Add delay or caching for high-traffic sites
```

### Nginx 502 Bad Gateway
```bash
# Check Node.js is running on port 3000
ps aux | grep node

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Monitoring

### Using PM2 Plus (Recommended)

```bash
# Link PM2 to PM2 Plus (free plan)
pm2 link your_secret_key your_public_key

# View dashboard at https://app.pm2.io/
```

### Manual Monitoring

```bash
# CPU/Memory usage
pm2 monit

# Process info
pm2 info theportal

# Logs
pm2 logs theportal --lines 100
```

---

## 🔄 Updates & Maintenance

### Pull Latest Changes

```bash
cd ~/theportal
git pull origin main
npm install  # Install any new dependencies
pm2 restart theportal
```

### View Deployment History

```bash
git log --oneline
git status
```

---

## 📞 Support

For issues:
1. Check application logs: `pm2 logs theportal`
2. Check web server logs: `/var/log/nginx/error.log`
3. Verify MongoDB: `systemctl status mongod`
4. Review environment variables in `.env`

---

**Good luck with your deployment! 🚀**
