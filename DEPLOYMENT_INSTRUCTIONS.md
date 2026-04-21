# ThePortal - Deployment Instructions

A complete guide to deploy ThePortal to your own server.

## Live Demo

- **Current Deployment:** https://theportal.onrender.com
- **GitHub Repository:** https://github.com/22166025/theportal

---

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Git** - [Download](https://git-scm.com/)
4. **MongoDB** (local or cloud-based)
5. **API Keys:**
   - **TMDB API Key** - [Get it here](https://www.themoviedb.org/settings/api)
   - **NASA API Key** (optional for APOD) - [Get it here](https://api.nasa.gov/)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/22166025/theportal.git
cd theportal
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- Express.js (web framework)
- Mongoose (MongoDB driver)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- dotenv (environment variables)
- And other dependencies

---

## Step 3: Set Up Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal

# API Keys
TMDB_API_KEY=your_tmdb_api_key_here
NASA_API_KEY=your_nasa_api_key_here

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret_key_here

# Server Port (default: 3000)
PORT=3000

# Node Environment
NODE_ENV=production
```

### How to Get API Keys:

**TMDB API Key:**
1. Visit https://www.themoviedb.org/settings/api
2. Sign up or log in to TMDB
3. Create an API request
4. Accept terms and submit
5. Copy your API key from the settings page

**NASA API Key:**
1. Visit https://api.nasa.gov/
2. Fill in the form with your information
3. Submit - you'll receive an API key via email
4. Copy the key to your `.env` file

---

## Step 4: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster
4. Set up database credentials
5. Get your connection string
6. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal
   ```

### Option B: Local MongoDB

1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **Windows:** `mongod`
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
3. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/theportal
   ```

---

## Step 5: Prepare Your Movie Data

The application expects an `imdb.csv` file in the project root. This file should contain your movie database with columns:

```
Const,Title,Year,Genres,Release Date,IMDb Rating,Your Rating
tt0111161,The Shawshank Redemption,1994,Drama,1994-10-14,9.3,10
...
```

The `imdb.csv` file is already included in the repository.

---

## Step 6: Start the Application Locally

To test locally before deployment:

```bash
npm start
```

The server will run on `http://localhost:3000`

---

## Step 7: Deploy to Production

### Option A: Render (Recommended - Currently Used)

1. **Create a Render Account** at https://render.com
2. **Connect GitHub Repository:**
   - Go to Dashboard → New → Web Service
   - Select "GitHub" and authorize
   - Choose the `theportal` repository
3. **Configure the Service:**
   - **Name:** theportal
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for better performance)
4. **Add Environment Variables:**
   - Click "Environment"
   - Add all variables from your `.env` file:
     - `MONGODB_URI`
     - `TMDB_API_KEY`
     - `NASA_API_KEY`
     - `JWT_SECRET`
     - `NODE_ENV=production`
5. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - You'll receive a URL like `https://theportal.onrender.com`

### Option B: Heroku

1. **Install Heroku CLI** from https://devcenter.heroku.com/articles/heroku-cli
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Create a Heroku App:**
   ```bash
   heroku create your-app-name
   ```
4. **Add Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set TMDB_API_KEY="your_key"
   heroku config:set NASA_API_KEY="your_key"
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set NODE_ENV="production"
   ```
5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option C: AWS, Google Cloud, or Microsoft Azure

Refer to their respective Node.js deployment documentation.

---

## Step 8: Verify Deployment

1. Visit your deployed URL
2. Check the following:
   - Homepage loads correctly
   - Navigation menu works
   - Search functionality works
   - Movie lists display with posters
   - Login/Register pages are accessible
   - Theme toggle works

---

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install` to install all dependencies

### Issue: "MongoDB connection failed"
**Solution:** 
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB service is running
- Verify database credentials are correct
- Check network access on MongoDB Atlas (if using cloud)

### Issue: "TMDB_API_KEY not found"
**Solution:** 
- Add `TMDB_API_KEY` to your `.env` file
- Restart the application
- For Render/Heroku, redeploy after adding the variable

### Issue: "Port 3000 is already in use"
**Solution:** 
- Kill the process using port 3000
- Or set a different port in `.env`: `PORT=3001`

### Issue: "Static files not loading (CSS, JS)"
**Solution:**
- Ensure `app.use(express.static(...))` is configured correctly
- Clear browser cache (Ctrl+F5)
- Check that `style.css` exists in the root directory

### Issue: "Posters not loading from TMDB"
**Solution:**
- Verify `TMDB_API_KEY` is valid and has sufficient quota
- Check network connection
- Ensure movie titles in CSV match TMDB database

---

## File Structure

```
theportal/
├── server.js                 # Main Express server
├── app.js                    # Frontend JavaScript
├── auth.js                   # Authentication utilities
├── database.js               # MongoDB connection
├── style.css                 # Stylesheet
├── imdb.csv                  # Movie database
├── package.json              # Dependencies
├── .env                      # Environment variables (create this)
├── .gitignore                # Git ignore rules
├── index.html                # Homepage
├── signin.html               # Login page
├── register.html             # Registration page
├── wishlist.html             # User wishlist
├── profile.html              # User profile
├── lists.html                # Movie lists by genre
├── movie-detail.html         # Movie detail page
├── bored.html                # Bored feature page
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User database model
├── quotes/                  # Quote images
└── node_modules/            # Installed packages

```

---

## Features

- 🎬 Movie search and discovery
- 🎯 Genre-based movie lists (Thriller, Romance, Horror, etc.)
- ❤️ Add movies to personal wishlist
- 👤 User authentication (Sign up/Login)
- 🌙 Light/Dark theme toggle
- 🎨 Beautiful responsive UI
- 📱 Mobile-friendly design
- 🖼️ Movie posters from TMDB
- 🎭 Random movie quotes

---

## Support & Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **MongoDB Documentation:** https://docs.mongodb.com/
- **TMDB API Guide:** https://developer.themoviedb.org/docs
- **Render Deployment:** https://render.com/docs

---

## License

This project is open source and available on GitHub.

---

**Happy Deploying! 🚀**
