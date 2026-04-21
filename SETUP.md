# ThePortal Setup Guide

## Changes Made for Featured Movie Display

### 1. **Updated Files**
- `server.js` - Added OMDB API integration for movie posters
- `index.html` - Updated featured movie card HTML structure
- `app.js` - Updated JavaScript to handle poster and both ratings
- `style.css` - Added styling for poster and ratings layout
- `package.json` - Added `node-fetch` dependency

### 2. **Installation Steps**

```bash
# Install dependencies (required before running)
npm install

# Start the server
npm start
```

Server will run at `http://localhost:3000`

### 3. **Featured Movie Display Features**

The home page now shows:
- **Movie Poster** - Fetched from OMDB API
- **Title** - "Last Watched"
- **Your Rating** - Blue star (your rating from CSV) e.g., "⭐ My Rating: 7/10"
- **IMDb Rating** - Pink badge with IMDb rating e.g., "IMDb: 7.1"
- **Year & Genres** - Below the ratings
- **IMDb Link** - "View on IMDb →" button

### 4. **OMDB API Key**

The setup uses a demo OMDB API key with limited requests. For production:

1. Get a free API key from: https://www.omdbapi.com/apikey.aspx
2. Set environment variable:
   ```bash
   # Windows PowerShell
   $env:OMDB_API_KEY = "your_api_key_here"
   npm start
   
   # Windows CMD
   set OMDB_API_KEY=your_api_key_here
   npm start
   
   # macOS/Linux
   export OMDB_API_KEY=your_api_key_here
   npm start
   ```

Or create a `.env` file (add to .gitignore):
```
OMDB_API_KEY=your_api_key_here
```

### 5. **Data Source**

The featured movie is pulled from `imdb.csv`:
- Finds the most recent movie by "Date Rated" column
- Displays title, your rating, IMDb rating, year, and genres
- Fetches poster image from OMDB using the movie title

### 6. **Dependencies**

- **express** - Web server framework
- **csv-parse** - Parse CSV files
- **node-fetch** - Fetch HTTP requests (for Node.js compatibility)

### 7. **Responsive Design**

- Desktop: Poster on left, info on right
- Tablet (max-width: 768px): Poster on top, info below, centered
- Mobile: Full width, optimized for small screens
