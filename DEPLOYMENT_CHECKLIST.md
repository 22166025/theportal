# ThePortal - Complete Deployment Checklist

**Master Reference Guide - All Steps in One Place**

---

## 🎯 Quick Reference - What to Do First

| Goal | Read This | Time |
|------|-----------|------|
| Understand the project | README.md | 5 min |
| Set up environment | ENVIRONMENT_SETUP.md | 10 min |
| Deploy yourself | DEPLOYMENT_GUIDE.md | 30-60 min |
| Share with others | SETUP_FOR_OTHERS.md | 5 min |
| Use GitHub deploy | GITHUB_DEPLOYMENT.md | 20 min |

---

## 📋 STEP-BY-STEP CHECKLIST

### ✅ Phase 1: Prepare Files (5 minutes)

```bash
# 1. Verify .gitignore is correct
cat .gitignore
# Should contain: node_modules/, .env, .DS_Store, *.log

# 2. Create .env file with your API keys
# Read: ENVIRONMENT_SETUP.md
touch .env
# Then add: TMDB_API_KEY, MONGODB_URI, JWT_SECRET

# 3. Verify .env is NOT tracked by Git
git status .env
# Should show: not in any list (good!)

# 4. Verify all dependencies are in package.json
cat package.json
# Should list: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv
```

**Status Check:**
- [ ] .env file created locally
- [ ] .env NOT showing in `git status`
- [ ] All API keys filled in .env
- [ ] package.json has all dependencies

---

### ✅ Phase 2: Test Locally (10 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (if using local)
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 3. Run the server
npm start

# Expected output:
# 🎬 ThePortal server running at http://localhost:3000
# ✅ MongoDB Connected successfully

# 4. Test in browser
# Open: http://localhost:3000
```

**Status Check:**
- [ ] `npm install` completed without errors
- [ ] MongoDB is running
- [ ] Server starts with `npm start`
- [ ] Browser shows ThePortal homepage
- [ ] Can register new user
- [ ] Can login
- [ ] Search works
- [ ] Wishlist works

---

### ✅ Phase 3: Push to GitHub (10 minutes)

```bash
# 1. Initialize Git (if not already done)
git init
git remote add origin https://github.com/YOUR_USERNAME/theportal.git

# 2. Add all files (except .env)
git add .
git status
# Verify .env is NOT listed

# 3. Create first commit
git commit -m "Initial commit: ThePortal with auth and wishlist"

# 4. Push to GitHub
git branch -M main
git push -u origin main

# 5. Verify on GitHub.com
# Visit: https://github.com/YOUR_USERNAME/theportal
# Should see all files, .env should NOT be visible
```

**Status Check:**
- [ ] Git repository created
- [ ] All files committed (except .env)
- [ ] Pushed to GitHub
- [ ] .env NOT visible on GitHub
- [ ] All documentation files visible on GitHub

---

### ✅ Phase 4: Choose Deployment Method

#### Option A: Deploy to Heroku (Easiest)

```bash
# 1. Create Heroku account: https://heroku.com
# 2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# 3. Login
heroku login

# 4. Create app
heroku create your-app-name

# 5. Create MongoDB Atlas account and get connection string
# https://www.mongodb.com/cloud/atlas

# 6. Set environment variables
heroku config:set TMDB_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# 7. Deploy
git push heroku main

# 8. Test
heroku open
heroku logs --tail
```

**Status Check:**
- [ ] Heroku account created
- [ ] MongoDB Atlas set up
- [ ] Environment variables set on Heroku
- [ ] Deployed successfully
- [ ] App loads at https://your-app-name.herokuapp.com

---

#### Option B: Deploy to Your Own Server

See **DEPLOYMENT_GUIDE.md** for complete server setup including:
- Install Node.js
- Install MongoDB
- Clone GitHub repo
- Set up environment
- Start with PM2/systemd
- Setup Nginx/Apache
- Configure SSL certificate
- Setup firewall

```bash
# Quick summary:
ssh username@server_ip
git clone https://github.com/YOUR_USERNAME/theportal.git
cd theportal
nano .env           # Create .env with API keys
npm install
npm start           # Or use PM2/systemd for production
```

**Status Check:**
- [ ] SSH access to server
- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Repository cloned
- [ ] .env configured
- [ ] App running on port 3000
- [ ] Web server (Nginx) configured
- [ ] SSL certificate installed
- [ ] App accessible from internet

---

### ✅ Phase 5: Share with Others

**To share the project:**

1. **Via GitHub (Recommended)**
   ```
   Send link: https://github.com/YOUR_USERNAME/theportal
   Have them read: SETUP_FOR_OTHERS.md
   ```

2. **Via ZIP File**
   ```bash
   # Exclude node_modules and .env
   zip -r theportal.zip . -x "node_modules/*" ".env" ".git/*"
   # Send ZIP file + link to SETUP_FOR_OTHERS.md
   ```

3. **Via File Sharing**
   - Upload ZIP to Google Drive, Dropbox, etc.
   - Share link with access permissions
   - Include link to this repository

**Status Check:**
- [ ] Sent GitHub link or ZIP file
- [ ] Shared SETUP_FOR_OTHERS.md
- [ ] Shared README.md
- [ ] Shared ENVIRONMENT_SETUP.md
- [ ] Shared DEPLOYMENT_GUIDE.md

---

## 📚 Documentation Files Explained

| File | Purpose | Who Reads | Time |
|------|---------|-----------|------|
| **README.md** | Project overview, features, stack | Everyone | 5 min |
| **ENVIRONMENT_SETUP.md** | How to get API keys and set .env | Developers | 10 min |
| **DEPLOYMENT_GUIDE.md** | Deploy to your own server (Linux/Windows) | Sys Admins | 30-60 min |
| **GITHUB_DEPLOYMENT.md** | Deploy to Heroku/Render/GitHub | Developers | 20 min |
| **SETUP_FOR_OTHERS.md** | Share instructions with team | Team Members | 5 min |
| **This File** | Master checklist | You (now) | 10 min |

---

## 🔐 Security Checklist

**Before any deployment:**

- [ ] `.env` file created locally (not in GitHub)
- [ ] All API keys are valid
- [ ] JWT_SECRET is long and random (32+ characters)
- [ ] MongoDB password is strong
- [ ] No hardcoded secrets in code
- [ ] `.gitignore` includes `.env`
- [ ] HTTPS/SSL enabled (use Let's Encrypt free)
- [ ] Firewall configured (port 3000 closed to public)
- [ ] Web server (Nginx) acting as proxy
- [ ] MongoDB backups configured (for production)

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `npm install` |
| "MongoDB connection failed" | Check MongoDB running, check MONGODB_URI in .env |
| "TMDB_API_KEY not found" | Create .env file, add TMDB_API_KEY |
| "Port 3000 already in use" | Change PORT in .env or kill process |
| "App won't start" | Check .env exists, check all vars filled, see logs |
| ".env visible on GitHub" | Run `git rm --cached .env` then commit |
| "Wishlist not working" | Check logged in (token in localStorage), check MongoDB connected |

---

## 🚀 Deployment Paths

### Path 1: Simplest (30 minutes)

```
Local Development
  ↓
Heroku Deploy (free tier)
  ↓
Share GitHub Link
```

**Commands:**
```bash
# Local
npm install
npm start

# GitHub
git add .
git commit -m "..."
git push origin main

# Heroku
heroku create app-name
heroku config:set TMDB_API_KEY=... MONGODB_URI=... JWT_SECRET=...
git push heroku main
```

### Path 2: Custom Server (1-2 hours)

```
Local Development
  ↓
GitHub Push
  ↓
SSH to Server
  ↓
Clone & Setup
  ↓
PM2 Process Manager
  ↓
Nginx Reverse Proxy
  ↓
Let's Encrypt SSL
  ↓
Live on Custom Domain
```

**Follow:** DEPLOYMENT_GUIDE.md

### Path 3: Share with Team (45 minutes)

```
Local Development
  ↓
GitHub Push
  ↓
Send Documentation
  ↓
Team Member Clones
  ↓
Team Member Sets .env
  ↓
Team Member Deploys
```

**Share:** SETUP_FOR_OTHERS.md

---

## 📊 What Gets Pushed to GitHub?

**✅ Include:**
- All `.html`, `.js`, `.css` files
- `package.json` (but not `node_modules/`)
- `package-lock.json`
- `.gitignore`
- All documentation files
- `models/`, `middleware/`, `quotes/` folders
- `imdb.csv`

**❌ Exclude (via .gitignore):**
- `.env` (has your API keys!)
- `node_modules/` (too big, rebuilt with npm install)
- `.git/` (internal folder)
- `*.log` (temporary files)

**Check before pushing:**
```bash
git status
# Should NOT show .env or node_modules
```

---

## 💰 Cost Breakdown

| Platform | Cost | Notes |
|----------|------|-------|
| **Heroku** | Free tier | 512MB RAM, sleeps after 30 min inactivity |
| **Heroku Paid** | $7+/month | Full uptime, faster |
| **Render** | Free tier | Like Heroku, more generous |
| **MongoDB Atlas** | Free tier | 512MB storage, no credit card needed* |
| **DigitalOcean** | $4-5/month | Full server, complete control |
| **AWS** | Free tier | First 12 months free, then $5-10/month |
| **Custom Server** | $0-100/month | Depends on host |

*MongoDB Atlas free tier needs credit card after 3 months, but doesn't auto-charge.

---

## 🎓 Learning Resources

**Git & GitHub**
- https://guides.github.com/
- https://git-scm.com/book/en/v2

**Node.js & Express**
- https://nodejs.org/en/docs/
- https://expressjs.com/

**MongoDB**
- https://docs.mongodb.com/
- https://www.mongodb.com/docs/drivers/node/

**Deployment**
- Heroku: https://devcenter.heroku.com/
- Render: https://render.com/docs
- DigitalOcean: https://docs.digitalocean.com/

---

## 📞 Getting Help

1. **Local development issues** → Check npm/Node.js logs
2. **Database issues** → Check MongoDB connection string
3. **Deployment issues** → Check web server (Nginx) logs
4. **API issues** → Check TMDb API key is valid
5. **Still stuck?** → Open GitHub issue or contact deployer

---

## ✨ After Deployment

**Ongoing tasks:**
- Monitor logs regularly: `pm2 logs theportal`
- Keep dependencies updated: `npm outdated`
- Backup MongoDB regularly
- Update JWT_SECRET periodically
- Monitor server resources (CPU, RAM)
- Check error logs for issues
- Update code and redeploy: `git pull && npm install && pm2 restart theportal`

---

## 🎉 Success Criteria

You're done when:

- ✅ Local development: App runs at http://localhost:3000
- ✅ GitHub: Code pushed to https://github.com/YOUR_USERNAME/theportal
- ✅ Deployed: App accessible at public URL (Heroku/custom domain)
- ✅ Shared: Others can clone and deploy using SETUP_FOR_OTHERS.md
- ✅ Working: Users can register, login, search, and add to wishlist
- ✅ Secure: .env not in GitHub, HTTPS enabled, secrets protected

---

**You're all set! 🚀**

Pick your deployment path above and follow the steps. Good luck!
