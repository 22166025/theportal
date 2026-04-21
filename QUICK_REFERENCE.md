# ThePortal - Quick Start Reference Card

**Print this or bookmark for quick reference**

---

## 🚀 Deploy Yourself

### Step 1: Local Setup (10 min)
```bash
npm install
# Create .env with TMDB_API_KEY, MONGODB_URI, JWT_SECRET
npm start
# Visit: http://localhost:3000
```

### Step 2: Push to GitHub (5 min)
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 3: Deploy to Heroku (5 min)
```bash
heroku create your-app-name
heroku config:set TMDB_API_KEY=your_key
heroku config:set MONGODB_URI=your_db_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

**Done!** Visit: `https://your-app-name.herokuapp.com`

---

## 📤 Share with Others

### What to Send
- GitHub link: `https://github.com/YOUR_USERNAME/theportal`
- Or ZIP file (without node_modules and .env)
- Include all 5 README files

### What NOT to Send
- ❌ .env file (has your API keys!)
- ❌ node_modules folder (too big)

### Message Template
```
I'm sharing ThePortal with you!

Setup Instructions:
1. Clone: git clone https://github.com/YOUR_USERNAME/theportal.git
2. Read: SETUP_FOR_OTHERS.md
3. Follow: ENVIRONMENT_SETUP.md
4. Deploy: DEPLOYMENT_GUIDE.md

Questions? I'm here to help!
```

---

## 🔑 API Keys You Need

### TMDb (Movies)
- Get: https://www.themoviedb.org/settings/api
- Free? Yes ✓
- Time to get: 5 minutes

### MongoDB (Database)
- Get: https://www.mongodb.com/cloud/atlas
- Free? Yes (512MB) ✓
- Time to get: 10 minutes

### JWT Secret
- Get: Run `openssl rand -base64 32`
- Free? Yes ✓
- Time to get: 1 minute

---

## 📁 File Structure After Setup

```
theportal/
├── .env                    ← Create this (don't commit!)
├── .gitignore             ← Has .env already
├── package.json           ← npm dependencies
├── server.js              ← Backend
├── database.js            ← MongoDB connection
│
├── models/User.js         ← User schema
├── middleware/auth.js     ← JWT authentication
│
├── index.html, signin.html, etc.  ← Frontend
├── app.js, auth.js, etc.  ← Frontend scripts
├── style.css              ← Styles
├── imdb.csv               ← Movie data
│
├── README.md              ← Overview (read first!)
├── ENVIRONMENT_SETUP.md   ← How to get API keys
├── DEPLOYMENT_GUIDE.md    ← Deploy to server
├── GITHUB_DEPLOYMENT.md   ← Deploy to Heroku
└── SETUP_FOR_OTHERS.md    ← Share instructions
```

---

## 🐛 Quick Fixes

| Error | Fix |
|-------|-----|
| "Cannot find module" | `npm install` |
| MongoDB won't connect | Check `.env` MONGODB_URI |
| No API key | Create `.env` file |
| Port 3000 in use | Change PORT in .env |
| .env in GitHub | Run: `git rm --cached .env && git commit -m "Remove .env"` |

---

## ✅ Checklist

**Before you deploy:**
- [ ] `.env` created
- [ ] TMDB_API_KEY filled in
- [ ] MONGODB_URI filled in
- [ ] JWT_SECRET filled in (long random string)
- [ ] MongoDB is running (or Atlas configured)
- [ ] `npm install` completed
- [ ] `npm start` works locally
- [ ] `.env` NOT in `.gitignore` (it is!)

**For GitHub:**
- [ ] All code committed
- [ ] `.env` NOT committed (check with `git status`)
- [ ] Pushed to GitHub

**For Heroku (or other):**
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] App loads in browser

---

## 🔗 Important Links

**Documentation**
- GitHub: https://guides.github.com/
- Node.js: https://nodejs.org/docs

**Get Keys**
- TMDb: https://www.themoviedb.org/settings/api
- MongoDB: https://www.mongodb.com/cloud/atlas

**Deploy Services**
- Heroku: https://www.heroku.com
- Render: https://render.com
- DigitalOcean: https://www.digitalocean.com

---

## 📝 .env Template

```env
TMDB_API_KEY=your_key_here
MONGODB_URI=mongodb://localhost:27017/theportal
JWT_SECRET=super_long_random_secret_string_here
PORT=3000
```

---

## 💬 Common Questions

**Q: Can I modify the code?**
A: Yes! It's your copy now.

**Q: Can I use different database?**
A: Yes, but need to rewrite models/User.js

**Q: How do I update after deployment?**
A: `git pull origin main` → `npm install` → `npm start`

**Q: Cost to run forever?**
A: $0-10/month depending on hosting choice

**Q: Can I share with my team?**
A: Yes! Send GitHub link + SETUP_FOR_OTHERS.md

---

## 🆘 Emergency

**App crashed?**
```bash
# Check logs
npm start          # Show errors

# Restart (if using PM2)
pm2 restart theportal
```

**Lost your .env?**
```
Recreate with same values:
- Get TMDB_API_KEY from https://www.themoviedb.org/settings/api
- Get MONGODB_URI from your MongoDB
- Generate new JWT_SECRET: openssl rand -base64 32
```

**Git messed up?**
```
Have .env in GitHub by accident?
git rm --cached .env
git commit -m "Remove .env"
git push origin main
```

---

**Still need help? Read the full README.md or DEPLOYMENT_GUIDE.md**

**Deployed successfully? Celebrate! 🎉**
