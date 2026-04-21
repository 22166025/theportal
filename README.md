# ThePortal 🎬

**Your Lists, Elevated** - A full-featured movie discovery and wishlist management platform with user authentication, search functionality, and MongoDB integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Deployment Guide](#deployment-guide)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### User Authentication & Profiles
- User registration and login with secure JWT tokens
- Editable user profiles (name, username, email)
- 30-day token expiry for security
- Password hashing with bcryptjs

### Movie Search & Discovery
- Real-time search across all pages
- Debounced API calls (300ms delay)
- Movie detail pages with IMDb ratings and descriptions
- Featured movie display on homepage
- Movie lists (Bored?, Lists) for browsing

### Wishlist Management
- Add/remove movies to personal wishlist
- Wishlist persistence in MongoDB
- Wishlist button hidden for non-logged-in users
- Track wishlist status across all movie displays

### UI/UX
- Dark/Light theme toggle with localStorage persistence
- Responsive design (mobile, tablet, desktop)
- Dynamic navbar that updates based on auth state
- Clean, modern interface with CSS Grid and Flexbox

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Variables, Grid, Flexbox, Dark/Light themes
- **JavaScript (Vanilla)** - No framework dependencies
- **LocalStorage** - Client-side state management (auth token, theme)

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** (v7.0.0) - MongoDB ODM
- **JWT** (v9.0.0) - Authentication
- **bcryptjs** (v2.4.3) - Password hashing

### External APIs
- **TMDb API** - Movie data, posters, descriptions

### Development
- **npm** - Package manager
- **dotenv** - Environment variable management

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or [use MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Local Development (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/theportal.git
cd theportal

# 2. Install dependencies
npm install

# 3. Create .env file with required variables
# See "Environment Variables" section below

# 4. Start MongoDB (if running locally)
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 5. Start the server
npm start
# Server runs at http://localhost:3000
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Deployment Guide

### Option 1: Deploy to Heroku (Free Tier Available)

1. **Create Heroku Account**
   - Sign up at [heroku.com](https://heroku.com)
   - Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create MongoDB Atlas Database** (Free 512MB tier)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/theportal`

3. **Deploy to Heroku**
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set TMDB_API_KEY=your_key
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_random_secret_key
   git push heroku main
   heroku open
   ```

### Option 2: Deploy to Render (Free Tier)

1. **Sign up at [render.com](https://render.com)**

2. **Create MongoDB Atlas Database** (as above)

3. **Connect GitHub Repository**
   - Create new Web Service
   - Connect your GitHub repo
   - Set environment variables
   - Deploy

### Option 3: Deploy to DigitalOcean / AWS / Azure (Paid)

Follow your provider's Node.js deployment guide and ensure:
- Node.js runtime is available
- Environment variables are set
- MongoDB connection string is accessible
- Port 3000 (or configured port) is open

### Option 4: Deploy on Your Own Server

See **DEPLOYMENT_GUIDE.md** for detailed server setup instructions (Ubuntu/CentOS/Windows Server).

---

## 🔐 Environment Variables

Create a `.env` file in the root directory (do **NOT** commit to git):

```env
# TheMovieDatabase API Key (free from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here

# MongoDB Connection String
# For local: mongodb://localhost:27017/theportal
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/theportal
MONGODB_URI=mongodb://localhost:27017/theportal

# JWT Secret (use a long random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Optional: Server Port (default: 3000)
PORT=3000
```

### Getting API Keys

**TMDb API (Free)**
1. Go to [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Create account (free)
3. Request API access
4. Get your API key (shows immediately)

**MongoDB Atlas (Free 512MB)**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Get connection string: `mongodb+srv://username:password@cluster.net/theportal`
5. Add your IP to whitelist (or `0.0.0.0/0` to allow all)

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: { token, user: { id, name, username, email } }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: { token, user: { id, name, username, email } }
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer your_jwt_token

Response: { valid: true, user: {...} }
```

### User Profile Endpoints

#### Get Profile
```
GET /api/user/profile
Authorization: Bearer your_jwt_token

Response: { user: { id, name, username, email, wishlist } }
```

#### Update Profile
```
PUT /api/user/profile
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com"
}

Response: { user: {...} }
```

### Wishlist Endpoints

#### Add to Wishlist
```
POST /api/user/wishlist
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "movieId": "550",
  "title": "Fight Club",
  "year": "1999",
  "imdbRating": "8.8",
  "poster": "poster_url"
}

Response: { message: "Added to wishlist", wishlist: [...] }
```

#### Remove from Wishlist
```
DELETE /api/user/wishlist/:movieId
Authorization: Bearer your_jwt_token

Response: { message: "Removed from wishlist" }
```

#### Get Wishlist
```
GET /api/user/wishlist
Authorization: Bearer your_jwt_token

Response: { wishlist: [ { movieId, title, year, ... } ] }
```

#### Check if Movie in Wishlist
```
GET /api/user/wishlist/check/:movieId
Authorization: Bearer your_jwt_token

Response: { inWishlist: true|false }
```

---

## 📁 Project Structure

```
theportal/
├── server.js                 # Main Express server
├── database.js               # MongoDB connection
├── package.json              # Dependencies
├── .env                       # Environment variables (don't commit!)
├── .gitignore               # Git ignore rules
│
├── models/
│   └── User.js              # Mongoose User schema
│
├── middleware/
│   └── auth.js              # JWT authentication middleware
│
├── index.html               # Homepage
├── signin.html              # Login page
├── register.html            # Registration page
├── profile.html             # User profile page
├── wishlist.html            # Wishlist display page
├── movie-detail.html        # Movie detail page
├── lists.html               # Movie lists page
├── bored.html               # "I'm Bored" page
│
├── app.js                   # Homepage logic
├── auth.js                  # Authentication & navbar management
├── movie-detail.js          # Detail page logic
├── lists.js                 # Lists page logic
├── bored.js                 # Bored page logic
│
├── style.css                # Global styles
├── imdb.csv                 # Movie data CSV
├── quotes/                  # Quote images
└── temp/                    # Temporary files
```

---

## 🐛 Troubleshooting

### "MongoDB Connection Failed"
**Problem:** Server won't connect to MongoDB

**Solutions:**
- **Local MongoDB:** Make sure `mongod` is running
  - Windows: `mongod` in terminal
  - macOS: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

- **MongoDB Atlas:** Check connection string in `.env`
  - Verify username/password are correct
  - Add your IP to whitelist in Atlas: Security → Network Access
  - Use `mongodb+srv://` URL (not `mongodb://`)

### "TMDB_API_KEY not found"
**Problem:** Server exits with API key error

**Solution:**
- Create `.env` file with `TMDB_API_KEY=your_key`
- Restart server with `npm start`
- Don't forget to add `.env` to `.gitignore`

### "Cannot POST /api/auth/register"
**Problem:** API endpoints returning 404

**Solution:**
- Ensure `server.js` is running (`npm start`)
- Check server is running at `http://localhost:3000`
- Verify request URL doesn't have extra slashes: `/api/auth/register` (not `/api//auth/register`)

### "Wishlist button not working"
**Problem:** Adding/removing from wishlist fails

**Solutions:**
- Check browser console (F12) for error details
- Verify you're logged in (token in localStorage)
- Ensure MongoDB is connected (check server logs)
- Try logging out and in again

### "Theme toggle not persisting"
**Problem:** Dark/Light mode resets on page reload

**Solution:**
- Clear browser cache or use private window
- Check localStorage is enabled (not in private/incognito mode)

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review API endpoints in [API Documentation](#api-documentation)
- Open a GitHub issue

---

**Made with ❤️ for movie lovers**
