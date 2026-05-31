/* ============================================================
   RECOMMENDATION.JS — Smart movie recommendations
   ============================================================ */

const MAX_SELECTIONS = 3;
const MIN_SELECTIONS = 2;
const SEARCH_DEBOUNCE_DELAY = 300;

let selectedMovies = [];
let searchTimeout;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/signin.html';
    return;
  }

  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  const searchInput = document.getElementById('movie-search-input');
  const searchResults = document.getElementById('search-movie-results');
  const getRecommendationsBtn = document.getElementById('get-recommendations-btn');
  const startOverBtn = document.getElementById('start-over-btn');

  // Search input handling
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
      searchResults.hidden = true;
      return;
    }

    // Debounce search
    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, SEARCH_DEBOUNCE_DELAY);
  });

  // Close search results on Escape key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchResults.hidden = true;
    }
  });

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    const searchWrapper = document.querySelector('.search-movie-wrapper');
    if (!searchWrapper.contains(e.target)) {
      searchResults.hidden = true;
    }
  });

  // Get recommendations button
  getRecommendationsBtn.addEventListener('click', getRecommendations);

  // Start over button
  startOverBtn.addEventListener('click', startOver);
}

// Perform search
async function performSearch(query) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }

    const results = await response.json();
    displaySearchResults(results);
  } catch (error) {
    console.error('Error performing search:', error);
    showError('Search failed. Please try again.');
  }
}

// Display search results
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('search-results-inner');
  const searchResultsWrapper = document.getElementById('search-movie-results');

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-results">No movies found. Try another search.</div>';
    searchResultsWrapper.hidden = false;
    return;
  }

  resultsContainer.innerHTML = results.map((movie) => `
    <div class="search-result-item" data-movie-id="${movie.id}" data-movie-title="${movie.title}" data-movie-year="${movie.year}" data-movie-genres="${movie.genres}" data-movie-rating="${movie.imdbRating}" data-movie-poster="${movie.poster || ''}" data-movie-description="${movie.description || ''}">
      <div class="search-result-poster">
        ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" />` : '<span>No Poster</span>'}
      </div>
      <div class="search-result-content">
        <div class="search-result-title">${escapeHtml(movie.title)}</div>
        <div class="search-result-meta">${movie.year} • ⭐ ${movie.imdbRating}</div>
      </div>
      <div class="search-result-action">
        ${isMovieSelected(movie.id) ? '<span class="selected-badge">✓ Selected</span>' : '<button class="btn-select-small">Select</button>'}
      </div>
    </div>
  `).join('');

  // Add click handlers to results
  resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => selectMovie(item));
  });

  searchResultsWrapper.hidden = false;
}

// Select a movie from search results
function selectMovie(movieElement) {
  const movieId = movieElement.dataset.movieId;

  // Check if already selected
  if (isMovieSelected(movieId)) {
    removeSelectedMovie(movieId);
    movieElement.querySelector('.search-result-action').innerHTML = '<button class="btn-select-small">Select</button>';
    return;
  }

  // Check if can add more
  if (selectedMovies.length >= MAX_SELECTIONS) {
    showError(`You can select up to ${MAX_SELECTIONS} movies`);
    return;
  }

  // Extract movie data
  const movieData = {
    id: movieId,
    title: movieElement.dataset.movieTitle,
    year: parseInt(movieElement.dataset.movieYear),
    genres: movieElement.dataset.movieGenres,
    imdbRating: parseFloat(movieElement.dataset.movieRating),
    poster: movieElement.dataset.moviePoster,
    description: movieElement.dataset.movieDescription
  };

  // Add to selected movies
  selectedMovies.push(movieData);
  
  // Update UI
  movieElement.querySelector('.search-result-action').innerHTML = '<span class="selected-badge">✓ Selected</span>';
  displaySelectedMovies();
  updateSelectionUI();

  // Show selected movies section
  document.getElementById('selected-movies-section').style.display = 'block';
}

// Check if movie is already selected
function isMovieSelected(movieId) {
  return selectedMovies.some(m => m.id === movieId);
}

// Remove selected movie
function removeSelectedMovie(movieId) {
  selectedMovies = selectedMovies.filter(m => m.id !== movieId);
  displaySelectedMovies();
  updateSelectionUI();

  // Update search results to reflect removal
  const searchResults = document.getElementById('search-movie-results');
  if (!searchResults.hidden) {
    const resultItem = searchResults.querySelector(`[data-movie-id="${movieId}"]`);
    if (resultItem) {
      resultItem.querySelector('.search-result-action').innerHTML = '<button class="btn-select-small">Select</button>';
    }
  }

  // Hide selected movies section if empty
  if (selectedMovies.length === 0) {
    document.getElementById('selected-movies-section').style.display = 'none';
  }
}

// Display selected movies
function displaySelectedMovies() {
  const selectedList = document.getElementById('selected-movies-list');

  selectedList.innerHTML = selectedMovies.map((movie, index) => `
    <div class="selected-movie-card">
      <div class="selected-movie-index">${index + 1}</div>
      <div class="selected-movie-poster">
        ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" />` : '<span>No Poster</span>'}
      </div>
      <div class="selected-movie-info">
        <h4>${escapeHtml(movie.title)}</h4>
        <p class="selected-movie-year">${movie.year}</p>
      </div>
      <button class="btn-remove-movie" data-movie-id="${movie.id}" aria-label="Remove ${movie.title}">✕</button>
    </div>
  `).join('');

  // Add remove handlers
  selectedList.querySelectorAll('.btn-remove-movie').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeSelectedMovie(btn.dataset.movieId);
    });
  });
}

// Update selection UI
function updateSelectionUI() {
  const btn = document.getElementById('get-recommendations-btn');
  
  if (selectedMovies.length >= MIN_SELECTIONS) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

// Get recommendations
async function getRecommendations() {
  if (selectedMovies.length < MIN_SELECTIONS) {
    showError(`Please select 2-3 movies to get recommendations`);
    // Highlight the instruction text in red
    document.getElementById('select-instruction').classList.add('error-text');
    return;
  }

  // Remove error state if exists
  document.getElementById('select-instruction').classList.remove('error-text');

  try {
    document.getElementById('recommendations-section').style.display = 'block';
    document.getElementById('recommendations-grid').innerHTML = '<div class="loading-message">Finding perfect recommendations...</div>';
    
    // Scroll to recommendations
    document.getElementById('recommendations-section').scrollIntoView({ behavior: 'smooth' });

    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        selectedMovieIds: selectedMovies.map(m => m.id)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    const recommendations = await response.json();
    displayRecommendations(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    showError('Failed to get recommendations. Please try again.');
    document.getElementById('recommendations-section').style.display = 'none';
  }
}

// Display recommendations
function displayRecommendations(recommendations) {
  const container = document.getElementById('recommendations-grid');
  
  console.log('📥 Received recommendations:', recommendations);
  
  if (!recommendations || recommendations.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No recommendations found matching your criteria. Try selecting different movies!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  recommendations.forEach((movie, index) => {
    console.log(`Movie ${index + 1}: ${movie.title}, yourRating=${movie.yourRating}`);
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    card.innerHTML = `
      <div class="recommendation-poster">
        ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}" />` : '<span>No Poster</span>'}
        <div class="recommendation-badge">Your Rating: ${movie.yourRating || 'N/A'}</div>
      </div>
      <div class="recommendation-info">
        <h3>${escapeHtml(movie.title)}</h3>
        <p class="recommendation-year">${movie.year}</p>
        <p class="recommendation-genres">${escapeHtml(movie.genres)}</p>
        <p class="recommendation-description">${escapeHtml(movie.description ? movie.description.substring(0, 100) + '...' : 'No description available')}</p>
        <div class="recommendation-actions">
          <a href="movie-detail.html?id=${encodeURIComponent(movie.id)}" class="btn btn-primary btn-small">View Details</a>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Start over
function startOver() {
  selectedMovies = [];
  document.getElementById('movie-search-input').value = '';
  document.getElementById('search-movie-results').hidden = true;
  document.getElementById('selected-movies-section').style.display = 'none';
  document.getElementById('recommendations-section').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
  document.getElementById('select-instruction').classList.remove('error-text');
  updateSelectionUI();
  
  // Scroll back to search
  document.querySelector('.recommendation-section').scrollIntoView({ behavior: 'smooth' });
}

// Show error message
function showError(message) {
  const errorContainer = document.getElementById('error-message');
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

// XSS protection
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
