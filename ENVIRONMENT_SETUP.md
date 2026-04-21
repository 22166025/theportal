# Environment Setup Guide

**How to Configure Environment Variables for ThePortal**

---

## 🚀 Quick Setup (2 minutes)

### 1. Create `.env` File

In the root directory of your project (same level as `server.js`), create a new file named `.env`:

```bash
# Linux/macOS (terminal)
touch .env
nano .env

# Windows (PowerShell)
New-Item -Name .env -Type File
notepad .env

# Or just create a text file named `.env` in your code editor
```

### 2. Copy Template Below

Copy all content from the **"Environment Variables Template"** section below into your `.env` file.

### 3. Fill in Your Values

Replace placeholder values with your actual API keys and settings.

### 4. Save File

- **Important**: Do **NOT** commit `.env` to Git (it's in `.gitignore`)
- Never share your `.env` file with others
- Keep API keys and secrets private!

---

## 📋 Environment Variables Template

Copy and paste this into your `.env` file, then fill in the values:

```env
# ============================================
# ThePortal Environment Variables
# ============================================

# 1. TMDb API Key (Movie Database)
# Get free from: https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here

# 2. MongoDB Connection String
# Choose ONE option below based on your setup:

# Option A: Local MongoDB (for development)
MONGODB_URI=mongodb://localhost:27017/theportal

# Option B: MongoDB Atlas (Cloud - recommended for production)
# Get from: https://www.mongodb.com/cloud/atlas
# Format: mongodb+srv://username:password@cluster.mongodb.net/theportal
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal

# 3. JWT Secret (Authentication)
# Use a long random string - CHANGE THIS IN PRODUCTION!
# Generate at: https://www.random.org/strings/ or use command below
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_at_least_32_characters

# 4. Server Port (Optional)
# Default is 3000 if not specified
PORT=3000

# 5. Node Environment (Optional)
# For deployment: NODE_ENV=production
NODE_ENV=development
```

---

## 🔑 Getting API Keys & Credentials

### 1. TMDb API Key (Free)

**Easy - Takes 5 minutes**

1. Go to https://www.themoviedb.org/settings/api
2. Create account (click "Sign Up")
3. Fill registration form
4. Verify email
5. Go to API settings page
6. Click "Create" under API request
7. Accept terms
8. Copy the **API Key (v3 auth)** value
9. Paste into `.env`: `TMDB_API_KEY=your_copied_key`

**Example:**
```env
TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### 2. MongoDB URI (Choose One Option)

#### Option A: Local MongoDB (Development)

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/theportal
```

**To verify your local MongoDB is running:**

```bash
# Linux/macOS
brew services list | grep mongo

# Windows
Get-Service MongoDB

# Or try to connect
mongo  # Should connect without errors
```

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)

**Free tier: 512MB storage**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Create an account"
3. Fill in details (company name can be "Personal")
4. Create account (or sign in if you have one)
5. Create a **Project** (default is fine)
6. Create a **Cluster**:
   - Select free tier (M0 - Sandbox)
   - Select region closest to you
   - Click "Create Cluster" (wait ~3-5 minutes)
7. Create **Database User**:
   - Go to Security → Database Access
   - Click "Add New Database User"
   - Set username and password (write these down!)
   - Click "Add User"
8. Get **Connection String**:
   - Go to Deployment → Databases
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Copy MongoDB URI (shows as: `mongodb+srv://...`)
   - Replace `<password>` with your database user password
   - Add `/theportal` at end for database name

9. **Whitelist Your IP**:
   - Go to Security → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" or add your server IP
   - Click "Confirm"

10. Paste into `.env`:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.abc123.mongodb.net/theportal
```

**Example:**
```env
MONGODB_URI=mongodb+srv://john:mypassword123@cluster0.xyz123.mongodb.net/theportal
```

⚠️ **Important**:
- Database user password is different from Atlas account password
- Don't include special characters in password (or URL-encode them)
- IP whitelist must include server IP or use `0.0.0.0/0` (allow all)

---

### 3. JWT Secret (Authentication Key)

This is a secret string used to sign authentication tokens.

**Option 1: Use Online Generator** (Easiest)
1. Go to https://www.random.org/strings/
2. Set length to **32 characters** or more
3. Copy generated string
4. Paste into `.env`: `JWT_SECRET=copied_string`

**Option 2: Generate from Terminal**

Linux/macOS:
```bash
openssl rand -base64 32
# Output: aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3x=
# Copy this value to JWT_SECRET=
```

Windows PowerShell:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
# Copy output to JWT_SECRET=
```

**Example:**
```env
JWT_SECRET=aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xYz
```

**🔒 Security Note**: In production, use a different, more complex secret. Change it occasionally for added security.

---

## ✅ Verification Checklist

After creating `.env`, verify:

1. **File Location**: `.env` is in root directory (same level as `package.json`)
   ```
   theportal/
   ├── .env           ← Should be here
   ├── package.json
   ├── server.js
   └── ...
   ```

2. **TMDB API Key**: Value starts with letters/numbers, ~32 characters

3. **MongoDB URI**: 
   - Local: `mongodb://localhost:27017/theportal`
   - Atlas: `mongodb+srv://username:password@...`

4. **JWT Secret**: Long random string, at least 32 characters

5. **In .gitignore**: Verify `.env` is in `.gitignore` (so it won't be committed to Git)
   ```bash
   cat .gitignore | grep .env
   # Should show: .env
   ```

---

## 🧪 Test Your Configuration

Run the server to verify everything works:

```bash
npm install     # Install dependencies if not done yet
npm start       # Start server
```

**Expected output** (if everything is correct):
```
🎬 ThePortal server running at http://localhost:3000
✅ MongoDB Connected successfully
```

If you see errors, check:
- Is MongoDB running?
- Is the MongoDB connection string correct?
- Did you copy the TMDB API key correctly?
- Is `.env` in the correct location?

---

## 🌍 Different Environments

### Development Environment

```env
TMDB_API_KEY=your_dev_api_key
MONGODB_URI=mongodb://localhost:27017/theportal
JWT_SECRET=dev_secret_key_not_secure
NODE_ENV=development
PORT=3000
```

### Production Environment (For Deployment)

```env
TMDB_API_KEY=your_prod_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal
JWT_SECRET=super_long_secure_random_key_never_share_this
NODE_ENV=production
PORT=3000
```

---

## 🔒 Security Best Practices

1. **Never Commit `.env`**
   - It's already in `.gitignore`
   - Double-check with: `git status .env`
   - Should show nothing (or "not tracked")

2. **Keep Secrets Private**
   - Don't share `.env` file
   - Don't push to GitHub
   - Don't include in emails or messages

3. **Change Secrets Regularly**
   - Update JWT_SECRET every 6 months
   - Use new TMDB API key if it gets compromised
   - Rotate database passwords quarterly

4. **Use Different Keys per Environment**
   - Development: Separate API keys
   - Production: Different, more secure keys
   - Never use dev keys in production

5. **Limit API Key Permissions**
   - TMDB API: Usually read-only by default
   - MongoDB: Create dedicated user for this app only
   - Consider IP whitelisting

---

## 🐛 Troubleshooting

### "Cannot find module: dotenv" Error

```bash
npm install dotenv
npm start
```

### "MONGODB_URI not found" Error

- Check `.env` file exists
- Verify spelling: `MONGODB_URI` (not `MONGO_URI`)
- Ensure no spaces around `=`
- Restart server after creating `.env`

### "MongoDB connection refused" Error

- MongoDB not running?
  - Linux: `systemctl start mongod`
  - macOS: `brew services start mongodb-community`
  - Windows: Check Services → MongoDB
- Connection string wrong? Check in `.env`
- Using Atlas but whitelist not set? Add IP to Atlas

### "Invalid API key" Error

- Copy API key exactly (no spaces before/after)
- Verify key from TMDb site is correct
- Check if key got accidentally modified

### "Unable to create token" Error

- JWT_SECRET might be missing
- Restart server: `npm start`
- Regenerate JWT_SECRET with new long random string

---

## 📚 More Information

- **TMDb API Docs**: https://developer.themoviedb.org/docs
- **MongoDB Connection**: https://docs.mongodb.com/manual/reference/connection-string/
- **Environment Variables**: https://nodejs.org/en/docs/guides/nodejs-web-app-performance/
- **JWT Security**: https://tools.ietf.org/html/rfc7519

---

**Your `.env` is ready! Now run `npm start` to begin development or deployment. 🚀**
