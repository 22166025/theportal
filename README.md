# ThePortal 🎬

**Your Lists, Elevated** – A modern web application for discovering, organizing, and sharing your favorite movies.

[![Live Demo](https://img.shields.io/badge/Demo-theportal.onrender.com-blue?style=flat-square)](https://theportal.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-22166025/theportal-black?style=flat-square)](https://github.com/22166025/theportal)
[![License](https://img.shields.io/badge/License-Open%20Source-green?style=flat-square)](#license)

---

## 🌟 Features

### Movie Discovery
- 🔍 **Smart Search** – Find movies instantly with real-time search results
- 🎯 **Genre-Based Collections** – Browse curated lists of Thriller, Romance, Horror, Drama, Comedy, Sci-Fi, Fantasy, and Action movies
- 🎬 **Movie Details** – View posters, ratings, genres, and descriptions from TMDB
- ⭐ **Rating System** – See both IMDb ratings and personal ratings

### User Features
- 👤 **Authentication** – Secure sign-up and login with JWT tokens
- ❤️ **Wishlist** – Save your favorite movies to a personal wishlist
- 📋 **Profile Management** – View and manage your account
- 🌙 **Dark/Light Mode** – Toggle between themes with persistent storage

### Content & Community
- 🎭 **Random Movie Quotes** – Discover interesting quotes from movies
- 🌌 **Astronomy Picture of the Day** – NASA APOD integration
- 📖 **Daily Quotes** – Inspiring quotes from famous authors
- 🎲 **Bored Feature** – Get recommendations when you can't decide what to watch

---

## 🚀 Live Demo

**Try it now:** https://theportal.onrender.com

---

## 💻 Tech Stack

### Frontend
- **HTML5** – Semantic markup
- **CSS3** – Responsive design with CSS custom properties
- **JavaScript (ES6+)** – Modern vanilla JavaScript with no frameworks
- **Accessibility** – WCAG 2.1 compliant

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB & Mongoose** – NoSQL database
- **JWT** – Secure authentication
- **bcryptjs** – Password hashing

### APIs
- **TMDB API** – Movie data and posters
- **NASA API** – Astronomy Picture of the Day
- **Quotable API** – Quotes and authors

---

## 📋 Prerequisites

- Node.js v14.0.0 or higher
- npm (comes with Node.js)
- Git
- MongoDB (local or cloud)
- API Keys:
  - [TMDB API](https://www.themoviedb.org/settings/api) (required)
  - [NASA API](https://api.nasa.gov/) (optional)

---

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/22166025/theportal.git
cd theportal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment Variables
Create a `.env` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/theportal

# API Keys
TMDB_API_KEY=your_tmdb_api_key
NASA_API_KEY=your_nasa_api_key

# JWT Secret
JWT_SECRET=your_random_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Start the Server
```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Project Structure

```
theportal/
├── index.html                # Homepage
├── signin.html               # Login page
├── register.html             # Registration page
├── wishlist.html             # User wishlist
├── profile.html              # User profile
├── lists.html                # Genre-based movie lists
├── movie-detail.html         # Individual movie details
├── bored.html                # "Bored?" discovery page
├── app.js                    # Frontend logic
├── auth.js                   # Authentication utilities
├── bored.js                  # Bored page functionality
├── lists.js                  # Movie list management
├── movie-detail.js           # Movie detail page logic
├── server.js                 # Express server & API endpoints
├── database.js               # MongoDB connection
├── style.css                 # Stylesheet
├── imdb.csv                  # Movie database
├── package.json              # Dependencies
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   └── User.js              # MongoDB User schema
└── quotes/                  # Movie quote images
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` – Create a new account
- `POST /api/auth/login` – User login
- `GET /api/auth/verify` – Verify authentication token

### Movies & Search
- `GET /api/search?q=query` – Search movies
- `GET /api/last-movie` – Get the last watched movie
- `GET /api/apod` – Get NASA Astronomy Picture of the Day
- `GET /api/quote` – Get a random quote
- `GET /api/random-quote-image` – Get a random movie quote image

### User Data
- `POST /api/user/wishlist` – Add movie to wishlist
- `DELETE /api/user/wishlist/:movieId` – Remove from wishlist
- `GET /api/user/wishlist/check/:movieId` – Check if movie is in wishlist

---

## 📖 Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)

### Quick Deploy to Render

1. Fork this repository
2. Sign up at [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Add environment variables
6. Deploy!

Your site will be live in minutes.

---

## 🎨 Features in Detail

### Smart Search
- Real-time search results
- Displays posters, ratings, and years
- Keyboard navigation support
- Click to view full movie details

### Genre Collections
Filter your personal movie collection by genre:
- **Thriller** – Edge-of-your-seat action
- **Romance** – Heartwarming stories
- **Horror** – Spine-tingling scares
- **Drama** – Emotional narratives
- **Comedy** – Laugh-out-loud moments
- **Sci-Fi** – Futuristic adventures
- **Fantasy** – Magical worlds
- **Action** – High-octane excitement

### User Authentication
- Secure registration and login
- Password hashing with bcryptjs
- JWT token-based sessions
- Persistent authentication

### Wishlist
- Add/remove movies
- View all saved movies
- Track your favorite films
- Persistent storage in MongoDB

---

## 🌐 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## ♿ Accessibility

This project follows WCAG 2.1 guidelines:
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

---

## 🐛 Troubleshooting

**MongoDB connection fails?**
- Check your connection string in `.env`
- Ensure MongoDB is running
- Verify network access on MongoDB Atlas

**TMDB API errors?**
- Verify your API key is valid
- Check rate limiting (TMDB has free tier limits)
- Ensure the movie exists on TMDB

**Port already in use?**
- Change PORT in `.env` file
- Or kill the process using port 3000

For more help, see [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md#troubleshooting)

---

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Render Deployment Docs](https://render.com/docs)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available for educational and personal use.

---

## 👨‍💻 Author

Created as a Web Technologies project for Western Sydney University.

**GitHub:** [@22166025](https://github.com/22166025)

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data and posters
- [NASA](https://api.nasa.gov/) for Astronomy Picture of the Day
- [Quotable](https://quotable.io/) for quotes API
- [Render](https://render.com) for hosting

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [issue](https://github.com/22166025/theportal/issues) on GitHub
- Check the [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)
- Review the troubleshooting section above

---

**Happy Movie Hunting! 🎬✨**

Made with ❤️ for movie lovers everywhere.
