# GitHub Deployment Guide

**Step-by-Step: Push to GitHub and Deploy to Production**

---

## 📋 Part 1: Push Your Project to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `theportal` (or any name you prefer)
3. **Description**: "ThePortal - Your Lists, Elevated"
4. **Public** (so others can see it) or **Private** (only you)
5. **Initialize with**:
   - ❌ Do NOT check "Add a README"
   - ❌ Do NOT check "Add .gitignore"
   - ❌ Do NOT check "Choose a license"
6. Click **"Create repository"**

---

### Step 2: Connect Local Repository to GitHub

In your project terminal:

```bash
# Navigate to your project
cd d:\Western\ Sydney\ University\Semester\ 04\ \(Autumn\ 2026\)\INFS7009\ Web\ Technologies\Project\ 01\ThePortal

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ThePortal with authentication and wishlist"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/theportal.git

# Verify remote was added
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/theportal.git (fetch)
# origin  https://github.com/YOUR_USERNAME/theportal.git (push)

# Push to GitHub
git branch -M main
git push -u origin main
# Enter GitHub username and password (or use personal access token)
```

**GitHub Personal Access Token** (if password doesn't work):
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Check scopes: `repo`, `read:user`
4. Copy token
5. Use token as password when pushing

---

### Step 3: Verify on GitHub

Visit: `https://github.com/YOUR_USERNAME/theportal`

You should see:
- ✅ All your files uploaded
- ✅ README.md, DEPLOYMENT_GUIDE.md visible
- ✅ `.env` NOT visible (protected by `.gitignore`) ✓

---

## 🚀 Part 2: Deploy to Heroku (Easy & Free Tier Available)

Heroku makes deployment simple with automatic deploys from GitHub.

### Prerequisites

- Heroku account (free tier: 512MB) - Sign up at https://heroku.com
- Heroku CLI installed:
  - **Windows**: https://devcenter.heroku.com/articles/heroku-cli
  - **macOS**: `brew install heroku/brew/heroku`
  - **Linux**: `sudo apt install heroku` (or download binary)

### Step 1: Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0 - Sandbox tier)
3. Create database user with username/password
4. Whitelist IP: Security → Network Access → Allow Anywhere
5. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/theportal`

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login
# Opens browser, authenticate with GitHub account

# Create new app (use unique app name)
heroku create your-app-name
# Output shows: https://your-app-name.herokuapp.com

# Or create in Heroku dashboard: https://dashboard.heroku.com/new
```

### Step 3: Set Environment Variables

```bash
# Set TMDB API Key
heroku config:set TMDB_API_KEY=your_tmdb_api_key

# Set MongoDB URI (from Atlas)
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal

# Set JWT Secret (use long random string)
heroku config:set JWT_SECRET=your_super_secret_jwt_key_here

# Verify all are set
heroku config
```

### Step 4: Enable GitHub Integration (Auto Deploy)

1. Go to https://dashboard.heroku.com/
2. Select your app
3. Go to **"Deploy"** tab
4. Click **"Connect to GitHub"**
5. Search for `theportal` repository
6. Click **"Connect"**
7. Enable **"Automatic deploys"** from main branch (optional)

### Step 5: Deploy

```bash
# First manual deploy
git push heroku main

# Or if using GitHub automatic deploys:
# Just push to GitHub, Heroku deploys automatically
git push origin main
# Wait ~2 minutes, app automatically deploys
```

### Step 6: Test Your App

```bash
# Open in browser
heroku open
# Or visit: https://your-app-name.herokuapp.com

# View logs
heroku logs --tail
```

**Troubleshooting:**
```bash
# Check app status
heroku ps
# Should show: "web.1 npm start" as running

# View errors
heroku logs -n 100

# Restart app
heroku restart
```

---

## 🚀 Part 3: Deploy to Render (Free Tier)

Alternative to Heroku with more generous free tier.

### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Get started"
3. Sign up with GitHub (easier - no password needed)

### Step 2: Create Web Service

1. Dashboard → Click "New +"
2. Select "Web Service"
3. Connect GitHub repository `theportal`
4. Fill settings:
   - **Name**: `theportal` (or any name)
   - **Region**: closest to you
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"

### Step 3: Set Environment Variables

1. Go to app → "Environment"
2. Add variables:
   ```
   TMDB_API_KEY=your_key
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```
3. Save

### Step 4: Deploy

- Render auto-deploys on GitHub push
- Or click "Deploy latest commit" in dashboard
- Check logs for errors

---

## 🚀 Part 4: Deploy to DigitalOcean (Paid but Affordable)

For full control and reliability.

### Step 1: Create DigitalOcean Account

1. Go to https://www.digitalocean.com/
2. Sign up (credit card required, but has free trial)

### Step 2: Create Droplet

1. Dashboard → "Create" → "Droplets"
2. Select:
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic ($4/month - cheapest)
   - **Region**: Closest to users
3. Click "Create Droplet"

### Step 3: Set Up Server

Connect via SSH and follow **DEPLOYMENT_GUIDE.md**:
- Install Node.js
- Install MongoDB (or use Atlas)
- Clone GitHub repo
- Setup `.env`
- Start with PM2
- Setup Nginx
- Configure SSL

```bash
# SSH into your droplet
ssh root@your_droplet_ip

# Then follow DEPLOYMENT_GUIDE.md steps...
```

---

## 📝 Git Workflow for Future Updates

After deployment, when you make changes:

```bash
# Make your code changes

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Your app auto-deploys (if enabled on Heroku/Render)
# Or manually deploy:
# Heroku: git push heroku main
# Render: Click deploy in dashboard
# DigitalOcean: git pull on server
```

---

## 🔄 Common Workflows

### After Making Code Changes

```bash
# From your laptop
git add .
git commit -m "Fix wishlist button styling"
git push origin main

# For Heroku (if not using automatic deploys)
git push heroku main

# Check deployment
heroku logs --tail
heroku open
```

### Pulling Latest from GitHub on Server

```bash
# SSH into server
ssh username@server_ip

# Pull latest changes
cd ~/theportal
git pull origin main

# Restart app
pm2 restart theportal
# or
sudo systemctl restart theportal
```

### Emergency Rollback

```bash
# Go back to previous version
git revert <commit_hash>
git push origin main

# Deploy rollback
git push heroku main  # For Heroku
```

---

## 🔐 Security Checklist Before Deployment

- [ ] `.env` file created locally (NOT in GitHub)
- [ ] `.env` in `.gitignore` (won't be committed)
- [ ] All API keys are valid and active
- [ ] JWT_SECRET is long and random (32+ characters)
- [ ] MongoDB connection string is correct
- [ ] Database user has strong password
- [ ] MongoDB IP whitelist includes server IP
- [ ] HTTPS/SSL is enabled
- [ ] GitHub repository is public (if sharing) or private (if sensitive)
- [ ] No sensitive data in code comments

---

## 📊 Monitoring Your Deployment

### Heroku
```bash
# View logs
heroku logs -t

# Monitor metrics
heroku apps:info
```

### Render
- Dashboard shows app status
- Logs visible in web interface

### DigitalOcean
```bash
# SSH in and check
pm2 logs theportal
systemctl status theportal
```

---

## 💡 Pro Tips

1. **Custom Domain**: Instead of `your-app-name.herokuapp.com`:
   - Heroku: Add custom domain in settings
   - Render: Add custom domain in settings
   - Cost: Domain registration (~$12/year)

2. **Staging Environment**: Create separate app for testing:
   ```bash
   heroku create your-app-name-staging
   git push heroku-staging main  # Different deploy
   ```

3. **Automated Testing**: Add GitHub Actions to test before deploy:
   - Create `.github/workflows/test.yml`
   - Run tests on every push
   - Block deployment if tests fail

4. **Environment-Specific Settings**:
   ```javascript
   // In server.js
   const isProduction = process.env.NODE_ENV === 'production';
   const debugMode = !isProduction;
   ```

---

## 🆘 Deployment Troubleshooting

### App not starting on Heroku

```bash
heroku logs --tail
# Look for error messages

# Common issues:
# - "Cannot find module 'dotenv'" → npm install
# - "MongoDB connection failed" → Check MONGODB_URI env var
# - "Port already in use" → Heroku assigns PORT automatically
```

### Domain not working

```bash
# Check DNS propagation
# Test from command line
nslookup your_domain.com

# Wait 15-30 minutes for DNS to propagate
```

### App running but giving errors

```bash
# SSH into DigitalOcean droplet
ssh root@ip

# Check server logs
pm2 logs theportal

# Check MongoDB
sudo systemctl status mongod

# Check Nginx
sudo systemctl status nginx
```

---

## 📚 Additional Resources

- **Heroku Docs**: https://devcenter.heroku.com/
- **Render Docs**: https://render.com/docs
- **DigitalOcean Docs**: https://docs.digitalocean.com/
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Git & GitHub Guide**: https://guides.github.com/

---

## 🎉 You're Deployed!

Congratulations! Your ThePortal app is now live on the internet.

**Next steps:**
1. Share your deployment URL with others
2. Monitor your app's performance
3. Fix bugs and deploy updates regularly
4. Scale when needed

**Questions?** Check the README.md and DEPLOYMENT_GUIDE.md files in the repository!
