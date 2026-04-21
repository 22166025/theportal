# ThePortal - Simple Deployment Guide

**3 Easy Steps for You | 3 Easy Steps for Others**

---

## 🚀 STEP 1: Upload Your Files to GitHub (5 minutes)

### A. Create GitHub Account (if you don't have one)
- Go to https://github.com
- Click "Sign up"
- Complete registration

### B. Create a New Repository
- Click "+" (top right) → "New repository"
- Repository name: `theportal`
- Description: "ThePortal - Your Lists, Elevated"
- Make it **Public** (so others can see it)
- Click "Create repository"

### C. Upload Your Files
Open **Terminal/PowerShell** in your project folder:

```bash
# Navigate to your project folder
cd "d:\Western Sydney University\Semester 04 (Autumn 2026)\INFS7009 Web Technologies\Project 01\ThePortal"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/theportal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Done!** Your files are on GitHub: `https://github.com/YOUR_USERNAME/theportal`

---

## 🌍 STEP 2: Deploy to Heroku (Free!) (10 minutes)

### A. Get MongoDB Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a free cluster (M0 Sandbox)
4. Create database user (username & password)
5. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/theportal`

### B. Get TMDb API Key
1. Go to https://www.themoviedb.org/settings/api
2. Sign up (free account)
3. Request API access
4. Copy your **API Key**

### C. Deploy to Heroku
1. Go to https://www.heroku.com
2. Sign up (free account)
3. Click "Create app"
4. Name: `your-app-name` (must be unique)
5. Create app
6. Go to "Settings" tab
7. Click "Reveal Config Vars"
8. Add 3 variables:
   - **TMDB_API_KEY** = your API key
   - **MONGODB_URI** = your MongoDB connection string
   - **JWT_SECRET** = any long random text (e.g., `super_secret_key_12345_change_this_in_production`)

9. Go to "Deploy" tab
10. Click "Connect to GitHub"
11. Search for `theportal` repository
12. Click "Connect"
13. Click "Deploy Branch"
14. Wait 2-3 minutes
15. Click "Open app"

**Done!** Your app is live: `https://your-app-name.herokuapp.com`

---

## 📋 STEP 3: Give Instructions to Others

**Send them this:**

---

### 👉 **INSTRUCTIONS FOR SOMEONE ELSE TO DEPLOY**

**Hi! I've uploaded ThePortal to GitHub. Follow these steps to run it:**

#### Step 1: Download (2 minutes)
```bash
git clone https://github.com/YOUR_USERNAME/theportal.git
cd theportal
```

#### Step 2: Set Up Environment (5 minutes)
Create a file named `.env` in the project folder with:
```env
TMDB_API_KEY=get_from_https://www.themoviedb.org/settings/api
MONGODB_URI=mongodb://localhost:27017/theportal
JWT_SECRET=any_long_random_string_here
```

#### Step 3: Install & Run (5 minutes)
```bash
npm install
npm start
```

**Done!** Open `http://localhost:3000` in your browser.

---

### To Deploy on a Server Instead:

1. **Get Heroku account**: https://www.heroku.com
2. **Get MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
3. **Follow STEP 2 above** (Deploy to Heroku section)

---

**Questions? Ask me!**

---

## ⚠️ Important: Never Share Your `.env` File!

Your `.env` file has:
- API keys (secret!)
- Database password (secret!)
- JWT secret (secret!)

**NEVER:**
- ❌ Commit `.env` to GitHub
- ❌ Send `.env` to others
- ❌ Post `.env` in chat/email

It's already protected by `.gitignore` ✓

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm: command not found` | Install Node.js from https://nodejs.org/ |
| `MongoDB connection failed` | Check MONGODB_URI in `.env` is correct |
| `TMDB_API_KEY not found` | Create `.env` file and add the key |
| `Cannot find module` | Run `npm install` |
| `Port 3000 already in use` | Change PORT in `.env` to 3001 or kill the process using 3000 |

---

## 📞 That's It!

- **You**: Push to GitHub → Deploy to Heroku ✓
- **Others**: Clone from GitHub → Deploy locally or to Heroku ✓

Good luck! 🎉
