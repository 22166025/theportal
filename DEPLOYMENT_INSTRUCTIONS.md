# ThePortal - Deployment Instructions

Quick setup guide to run ThePortal on your server.

**Project Source:** https://github.com/22166025/theportal  
**Live Demo:** https://theportal.onrender.com

---

## Prerequisites

Make sure you have the following installed:

1. **Node.js** (v14.0.0 or higher)
2. **npm** (comes with Node.js)
3. **Git**

That's it! The MongoDB Atlas database is already configured and ready to use.

---

## Setup (3 Simple Steps)

### Step 1: Clone the Repository

```bash
git clone https://github.com/22166025/theportal.git
cd theportal
```

---

### Step 2: Create the `.env` File

Create a `.env` file in the project root directory with the following:

```env
TMDB_API_KEY=99d5132ea896f2ea9f1ff32ef2f4baf0
MONGODB_URI=mongodb+srv://admin:MyPassword123!@webtech01.fqjncm4.mongodb.net/theportal?appName=WebTech01
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

**Note:** Just copy-paste this configuration as-is. No changes needed.

---

### Step 3: Install & Run

```bash
npm install
npm start
```

The application will be running at `http://localhost:3000` ✅

---

## What You Can Do

✅ Browse the homepage with featured movies  
✅ Search for movies in real-time  
✅ View genre-based collections (Thriller, Romance, Horror, etc.)  
✅ See movie details with posters and descriptions  
✅ Register a new account and login  
✅ Add movies to your personal wishlist  
✅ Toggle between light and dark themes  
✅ Explore the "Bored?" page for random content  

---

## Configuration

### TMDB API
- **API Key:** `99d5132ea896f2ea9f1ff32ef2f4baf0`
- **Purpose:** Fetches movie posters and descriptions

### MongoDB Atlas
- **Connection String:** `mongodb+srv://admin:MyPassword123!@webtech01.fqjncm4.mongodb.net/theportal?appName=WebTech01`
- **Database Name:** `theportal`
- **Status:** Already set up and ready to use
- **Purpose:** Stores user accounts and wishlists

### JWT Secret
- **Secret:** `your_jwt_secret_key_change_this_in_production`
- **Purpose:** Secures user authentication tokens

---

## Troubleshooting

### "Cannot find module 'express'"
Run `npm install` to install all dependencies.

### "Port 3000 already in use"
Change PORT in `.env` to `3001` and access at `http://localhost:3001`

### "MongoDB connection failed"
- Ensure the `.env` file is created correctly
- Check your internet connection
- The MongoDB Atlas cluster is already active

### "Posters not loading"
This is usually a network issue. The TMDB API key is active and valid.

---

## Project Structure

```
theportal/
├── server.js                # Express server & API endpoints
├── app.js                   # Frontend JavaScript
├── auth.js                  # Authentication utilities
├── database.js              # MongoDB connection
├── style.css                # Website styling
├── imdb.csv                 # Movie database
├── package.json             # Dependencies
├── .env                     # Configuration (create this)
├── index.html               # Homepage
├── signin.html              # Login page
├── register.html            # Registration page
├── wishlist.html            # User wishlist
├── profile.html             # User profile
├── lists.html               # Movie lists by genre
├── movie-detail.html        # Movie details
├── bored.html               # Bored feature
├── middleware/auth.js       # JWT middleware
├── models/User.js           # Database schema
└── quotes/                  # Movie quote images
```

---

## Features

🎬 Movie Discovery & Search  
🎯 Genre-Based Collections  
❤️ Personal Wishlist  
👤 User Authentication  
🌙 Dark/Light Mode  
🖼️ Movie Posters from TMDB  
🎭 Random Quotes & Content  

---

**That's it! Your application is now running.** 🚀
