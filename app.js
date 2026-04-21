/* ============================================================
   THEPORTAL — app.js
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const announce = (msg) => {
    const r = $('#live-region');
    if (!r) return;
    r.textContent = '';
    requestAnimationFrame(() => { r.textContent = msg; });
  };

  /* ============================================================
     HAMBURGER
     ============================================================ */
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open', !expanded);
      hamburger.setAttribute('aria-label', !expanded ? 'Close navigation menu' : 'Open navigation menu');
      if (!expanded) {
        const first = navMenu.querySelector('button, a');
        if (first) first.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        hamburger.focus();
      }
    });
  }

  /* ============================================================
     SEARCH
     ============================================================ */
  const searchToggle  = $('#search-toggle');
  const searchWrapper = $('#search-input-wrapper');
  const searchInput   = $('#search-input');
  const searchClose   = $('#search-close');
  const searchResults = $('#search-results');
  const searchResultsInner = $('.search-results-inner', searchResults);

  function openSearch() {
    searchToggle.hidden = true;
    searchWrapper.hidden = false;
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput.focus();
    announce('Search bar opened');
  }

  function closeSearch() {
    searchWrapper.hidden = true;
    searchToggle.hidden = false;
    searchToggle.setAttribute('aria-expanded', 'false');
    searchResults.hidden = true;
    searchToggle.focus();
    announce('Search bar closed');
  }

  function closeSearchResults() {
    searchResults.hidden = true;
  }

  function openSearchResults() {
    if (searchResultsInner.children.length > 0) {
      searchResults.hidden = false;
    }
  }

  // Debounce function to limit API calls
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Search for movies
  const performSearch = debounce(async (query) => {
    if (!query || query.trim().length === 0) {
      closeSearchResults();
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      
      if (results.length === 0) {
        searchResultsInner.innerHTML = '<div class="search-no-results">No movies found</div>';
      } else {
        searchResultsInner.innerHTML = results.map((movie, index) => `
          <a href="movie-detail.html?id=${encodeURIComponent(movie.id)}" 
             class="search-result-item" 
             role="option"
             data-index="${index}"
             aria-selected="false">
            <div class="search-result-poster">
              ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title} poster" />` : '<span>No Poster</span>'}
            </div>
            <div class="search-result-content">
              <div class="search-result-title">${escapeHtml(movie.title)}</div>
              <div class="search-result-meta">${movie.year} • ⭐ ${movie.imdbRating}</div>
            </div>
          </a>
        `).join('');
      }
      
      openSearchResults();
      announce(`${results.length} movies found`);
    } catch (error) {
      console.error('Search error:', error);
      searchResultsInner.innerHTML = '<div class="search-no-results">Error searching. Please try again.</div>';
      openSearchResults();
    }
  }, 300);

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose)  searchClose.addEventListener('click', closeSearch);
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { 
        e.preventDefault(); 
        closeSearch(); 
      }
      
      // Arrow key navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = $$('.search-result-item', searchResults);
        const currentIndex = items.findIndex(item => item === document.activeElement);
        
        if (items.length === 0) return;
        
        if (e.key === 'ArrowDown') {
          items[(currentIndex + 1) % items.length]?.focus();
        } else {
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
        }
      }
    });
  }

  if (searchWrapper) {
    searchWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
    });
  }

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchWrapper.contains(e.target)) {
      closeSearchResults();
    }
  });


  /* ============================================================
     LISTS DROPDOWN
     ============================================================ */
  const listsBtn      = $('#lists-btn');
  const listsDropdown = $('#lists-dropdown');
  const listsNavItem  = $('#lists-nav-item');
  let dropdownOpen    = false;

  function openDropdown() {
    if (dropdownOpen) return;
    dropdownOpen = true;
    listsBtn.setAttribute('aria-expanded', 'true');
    listsDropdown.hidden = false;
    $$('.dropdown-item', listsDropdown).forEach(i => i.setAttribute('tabindex', '0'));
  }

  function closeDropdown(returnFocus = false) {
    if (!dropdownOpen) return;
    dropdownOpen = false;
    listsBtn.setAttribute('aria-expanded', 'false');
    listsDropdown.hidden = true;
    $$('.dropdown-item', listsDropdown).forEach(i => i.setAttribute('tabindex', '-1'));
    if (returnFocus) listsBtn.focus();
  }

  if (listsNavItem) {
    listsNavItem.addEventListener('mouseenter', openDropdown);
    listsNavItem.addEventListener('mouseleave', closeDropdown);

    listsBtn.addEventListener('click', () => dropdownOpen ? closeDropdown(true) : openDropdown());

    listsBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openDropdown();
        listsDropdown.querySelector('.dropdown-item')?.focus();
      }
      if (e.key === 'Escape') closeDropdown(true);
    });

    listsDropdown.addEventListener('keydown', (e) => {
      const items = $$('.dropdown-item', listsDropdown);
      const idx   = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
      if (e.key === 'Escape')    { e.preventDefault(); closeDropdown(true); }
      if (e.key === 'Tab')       closeDropdown(false);
    });

    document.addEventListener('click', (e) => {
      if (!listsNavItem.contains(e.target)) closeDropdown();
    });
  }

  window.addEventListener('scroll', () => { if (dropdownOpen) closeDropdown(); }, { passive: true });

  /* ============================================================
     THEME TOGGLE
     ============================================================ */
  const themeToggle = $('#theme-toggle');
  const html        = document.documentElement;

  // Restore saved preference
  const savedTheme = localStorage.getItem('portal-theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
      themeToggle?.setAttribute('aria-pressed', 'true');
      themeToggle?.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current  = html.getAttribute('data-theme');
      const next     = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portal-theme', next);
      const isLight = next === 'light';
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      announce(`${next === 'dark' ? 'Dark' : 'Light'} mode enabled`);
    });
  }

  /* ============================================================
     MODALS
     ============================================================ */
  let lastFocusedElement = null;

  // All focusable elements inside a container
  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function openModal(modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;

    lastFocusedElement = document.activeElement;

    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus the modal container itself
    const modal = backdrop.querySelector('.modal');
    if (modal) {
      modal.focus();
      announce(`${backdrop.getAttribute('aria-labelledby') ? document.getElementById(backdrop.getAttribute('aria-labelledby'))?.textContent : 'List'} opened`);
    }

    // Trap focus inside modal
    backdrop.addEventListener('keydown', trapFocus);
    backdrop.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modalId));
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(modalId);
    });
  }

  function closeModal(modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;

    backdrop.hidden = true;
    document.body.style.overflow = '';
    backdrop.removeEventListener('keydown', trapFocus);
    announce('Modal closed');

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' && e.key !== 'Escape') return;

    if (e.key === 'Escape') {
      e.preventDefault();
      // Find which modal backdrop this event is on
      const backdrop = e.currentTarget;
      closeModal(backdrop.id);
      return;
    }

    // Tab trap
    const backdrop  = e.currentTarget;
    const focusable = [...backdrop.querySelectorAll(FOCUSABLE)].filter(el => !el.hidden && el.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  // Wire up all card toggle buttons and title buttons
  $$('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(btn.dataset.modal); }
    });
  });

  /* ============================================================
     FEATURED MOVIE (Home page only)
     ============================================================ */
  const featuredMovie = $('#featured-movie');
  
  if (featuredMovie) {
    (async function loadFeaturedMovie() {
      try {
        const response = await fetch('/api/last-movie');
        if (!response.ok) throw new Error('Failed to fetch movie');
        
        const movie = await response.json();
        
        // Try to find the movie in CSV to get its IMDb ID
        let movieId = null;
        try {
          const csvResponse = await fetch('imdb.csv');
          if (csvResponse.ok) {
            const csvText = await csvResponse.text();
            const movies = parseCSV(csvText);
            const csvMovie = movies.find(m => 
              m.Title === movie.title || 
              (m.Title && m.Title.toLowerCase() === (movie.title || '').toLowerCase())
            );
            if (csvMovie) {
              movieId = csvMovie.Const;
            }
          }
        } catch (csvError) {
          console.warn('Could not find movie in CSV');
        }
        
        // Make the card clickable
        featuredMovie.style.cursor = 'pointer';
        featuredMovie.addEventListener('click', (e) => {
          // Don't navigate if clicking on a link
          if (e.target.tagName !== 'A') {
            if (movieId) {
              window.location.href = `movie-detail.html?id=${encodeURIComponent(movieId)}`;
            } else {
              // Fallback: use movie title as identifier
              window.location.href = `movie-detail.html?title=${encodeURIComponent(movie.title)}`;
            }
          }
        });
        // Handle keyboard navigation (Enter key)
        featuredMovie.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (movieId) {
              window.location.href = `movie-detail.html?id=${encodeURIComponent(movieId)}`;
            } else {
              // Fallback: use movie title as identifier
              window.location.href = `movie-detail.html?title=${encodeURIComponent(movie.title)}`;
            }
          }
        });
        
        // Update DOM elements
        $('#movie-title').textContent = movie.title;
        
        // Display poster if available, otherwise show placeholder
        if (movie.poster) {
          const posterImg = $('#movie-poster');
          posterImg.src = movie.poster;
          posterImg.alt = `${movie.title} poster`;
          posterImg.style.display = 'block';
          
          // Hide placeholder
          const placeholder = $('#movie-poster-placeholder');
          if (placeholder) placeholder.style.display = 'none';
        } else {
          // Show placeholder
          const placeholder = $('#movie-poster-placeholder');
          if (placeholder) placeholder.style.display = 'flex';
        }
        
        // Display ratings
        $('#movie-your-rating').textContent = `My Rating: ${movie.yourRating}`;
        $('#movie-rating').textContent = `IMDb: ${movie.imdbRating}`;
        
        // Display year and genres
        $('#movie-year').textContent = movie.year;
        $('#movie-genres').textContent = movie.genres;
        
        // Display description
        const descriptionEl = $('#movie-description');
        if (descriptionEl) {
          if (movie.description) {
            descriptionEl.textContent = movie.description;
          } else {
            descriptionEl.textContent = 'No description available';
          }
        }
      } catch (error) {
        console.error('Error loading featured movie:', error);
        featuredMovie.innerHTML = '<p style="color: var(--text-muted);">Unable to load featured movie</p>';
      }
    })();
  }

  /* ============================================================
     THRILLER MOVIES MODAL
     ============================================================ */
  const thrillerToggle = $('#thriller-toggle');
  const thrillerModal = $('#thriller-modal');
  const thrillerModalClose = $('#thriller-modal-close');
  
  if (thrillerToggle && thrillerModal) {
    thrillerToggle.addEventListener('click', () => {
      thrillerModal.hidden = false;
      thrillerToggle.setAttribute('aria-expanded', 'true');
      announce('Thriller Movies modal opened');
    });
  }
  
  if (thrillerModalClose) {
    thrillerModalClose.addEventListener('click', () => {
      thrillerModal.hidden = true;
      thrillerToggle.setAttribute('aria-expanded', 'false');
      announce('Thriller Movies modal closed');
    });
  }
  
  if (thrillerModal) {
    thrillerModal.addEventListener('click', (e) => {
      if (e.target === thrillerModal) {
        thrillerModal.hidden = true;
        thrillerToggle.setAttribute('aria-expanded', 'false');
        announce('Thriller Movies modal closed');
      }
    });
    
    thrillerModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        thrillerModal.hidden = true;
        thrillerToggle.setAttribute('aria-expanded', 'false');
        announce('Thriller Movies modal closed');
      }
    });
  }

  /* ============================================================
     ROMANCE MOVIES MODAL
     ============================================================ */
  const romanceToggle = $('#romance-toggle');
  const romanceModal = $('#romance-modal');
  const romanceModalClose = $('#romance-modal-close');
  
  if (romanceToggle && romanceModal) {
    romanceToggle.addEventListener('click', () => {
      romanceModal.hidden = false;
      romanceToggle.setAttribute('aria-expanded', 'true');
      announce('Romance Movies modal opened');
    });
  }
  
  if (romanceModalClose) {
    romanceModalClose.addEventListener('click', () => {
      romanceModal.hidden = true;
      romanceToggle.setAttribute('aria-expanded', 'false');
      announce('Romance Movies modal closed');
    });
  }
  
  if (romanceModal) {
    romanceModal.addEventListener('click', (e) => {
      if (e.target === romanceModal) {
        romanceModal.hidden = true;
        romanceToggle.setAttribute('aria-expanded', 'false');
        announce('Romance Movies modal closed');
      }
    });
    
    romanceModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        romanceModal.hidden = true;
        romanceToggle.setAttribute('aria-expanded', 'false');
        announce('Romance Movies modal closed');
      }
    });
  }

  /* ============================================================
     HORROR MOVIES MODAL
     ============================================================ */
  const horrorToggle = $('#horror-toggle');
  const horrorModal = $('#horror-modal');
  const horrorModalClose = $('#horror-modal-close');
  
  if (horrorToggle && horrorModal) {
    horrorToggle.addEventListener('click', () => {
      horrorModal.hidden = false;
      horrorToggle.setAttribute('aria-expanded', 'true');
      announce('Horror Movies modal opened');
    });
  }
  
  if (horrorModalClose) {
    horrorModalClose.addEventListener('click', () => {
      horrorModal.hidden = true;
      horrorToggle.setAttribute('aria-expanded', 'false');
      announce('Horror Movies modal closed');
    });
  }
  
  if (horrorModal) {
    horrorModal.addEventListener('click', (e) => {
      if (e.target === horrorModal) {
        horrorModal.hidden = true;
        horrorToggle.setAttribute('aria-expanded', 'false');
        announce('Horror Movies modal closed');
      }
    });
    
    horrorModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        horrorModal.hidden = true;
        horrorToggle.setAttribute('aria-expanded', 'false');
        announce('Horror Movies modal closed');
      }
    });
  }

  /* ============================================================
     THRILLER MOVIES (Home page only)
     ============================================================ */
  const thrillerList = $('#thriller-list');
  
  if (thrillerList) {
    (async function loadThrillerMovies() {
      try {
        const response = await fetch('imdb.csv');
        if (!response.ok) throw new Error('Failed to fetch CSV');
        
        const csvText = await response.text();
        const movies = parseCSV(csvText);
        
        // Filter: Thriller genre AND My Rating (Your Rating) > 7
        const thrillerMovies = movies.filter(movie => {
          const genres = movie.Genres || '';
          const myRating = parseFloat(movie['Your Rating'] || 0);
          return genres.toLowerCase().includes('thriller') && myRating > 7;
        });
        
        // Sort by Release Date descending (latest first)
        thrillerMovies.sort((a, b) => {
          const dateA = parseDate(a['Release Date'] || '');
          const dateB = parseDate(b['Release Date'] || '');
          return dateB - dateA;
        });
        
        // Get top 10 movies
        const topTenMovies = thrillerMovies.slice(0, 10);
        
        // Populate the list
        thrillerList.innerHTML = '';
        
        for (const [index, movie] of topTenMovies.entries()) {
          const li = document.createElement('li');
          li.className = 'thriller-list-item';
          
          // Create link wrapper
          const a = document.createElement('a');
          a.href = `movie-detail.html?id=${encodeURIComponent(movie.Const)}`;
          a.className = 'thriller-link-wrapper';
          
          // Add item number
          const span = document.createElement('span');
          span.className = 'item-num';
          span.textContent = String(index + 1).padStart(2, '0');
          a.appendChild(span);
          
          // Add poster placeholder
          const posterDiv = document.createElement('div');
          posterDiv.className = 'thriller-poster-container';
          
          const posterImg = document.createElement('img');
          posterImg.className = 'thriller-poster';
          posterImg.alt = `${movie.Title} poster`;
          posterImg.style.display = 'none';
          
          const posterPlaceholder = document.createElement('div');
          posterPlaceholder.className = 'thriller-poster-placeholder';
          posterPlaceholder.textContent = '—';
          
          posterDiv.appendChild(posterImg);
          posterDiv.appendChild(posterPlaceholder);
          a.appendChild(posterDiv);
          
          // Add title and ratings container
          const infoDiv = document.createElement('div');
          infoDiv.className = 'thriller-info';
          
          // Add title
          const titleSpan = document.createElement('span');
          titleSpan.className = 'thriller-title';
          titleSpan.textContent = movie.Title;
          infoDiv.appendChild(titleSpan);
          
          // Add ratings
          const ratingsSpan = document.createElement('span');
          ratingsSpan.className = 'thriller-ratings';
          const imdbRating = movie['IMDb Rating'] || '—';
          const myRating = movie['Your Rating'] || '—';
          ratingsSpan.textContent = `IMDb: ${imdbRating} • Mine: ${myRating}`;
          infoDiv.appendChild(ratingsSpan);
          
          a.appendChild(infoDiv);
          
          li.appendChild(a);
          thrillerList.appendChild(li);
          
          // For the first movie, also fetch poster for card preview
          if (index === 0) {
            const cardPosterImg = $('#thriller-poster-img');
            const cardPosterPreview = $('#thriller-poster-preview');
            const cardPosterPlaceholder = $('#thriller-poster-placeholder');
            
            fetchTMDBPoster(movie.Title, movie.Year, cardPosterImg, cardPosterPlaceholder, (posterUrl) => {
              if (posterUrl && cardPosterPreview) {
                cardPosterPreview.style.display = 'block';
              }
            });
          }
          
          // Fetch poster from TMDB asynchronously for list item
          fetchTMDBPoster(movie.Title, movie.Year, posterImg, posterPlaceholder);
        }
      } catch (error) {
        console.error('Error loading thriller movies:', error);
        thrillerList.innerHTML = '<li class="thriller-list-item"><span style="color: var(--text-muted);">Unable to load thriller movies</span></li>';
      }
    })();
  }
  
  // Helper function to fetch poster from TMDB
  async function fetchTMDBPoster(title, year, posterImg, posterPlaceholder, callback) {
    try {
      // TMDB API Key - add your key here for better reliability
      // Get a free key at: https://www.themoviedb.org/settings/api
      const TMDB_API_KEY = '99d5132ea896f2ea9f1ff32ef2f4baf0';
      
      // Search for the movie on TMDB
      const query = encodeURIComponent(title);
      const yearParam = year ? `&year=${year}` : '';
      const keyParam = TMDB_API_KEY ? `&api_key=${TMDB_API_KEY}` : '';
      const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${query}${yearParam}${keyParam}`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const tmdbMovie = data.results[0];
        
        if (tmdbMovie.poster_path) {
          const posterUrl = `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`;
          posterImg.src = posterUrl;
          posterImg.style.display = 'block';
          posterPlaceholder.style.display = 'none';
          
          // Call optional callback with poster URL (for card previews)
          if (callback) callback(posterUrl);
          return posterUrl;
        }
      }
    } catch (error) {
      console.warn(`Could not fetch poster for ${title}:`, error);
      // Silently fail - poster placeholder will remain visible
    }
  }

  /* ============================================================
     ROMANCE MOVIES (Home page only)
     ============================================================ */
  const romanceList = $('#romance-list');
  
  if (romanceList) {
    (async function loadRomanceMovies() {
      try {
        const response = await fetch('imdb.csv');
        if (!response.ok) throw new Error('Failed to fetch CSV');
        
        const csvText = await response.text();
        const movies = parseCSV(csvText);
        
        // Filter: Romance genre AND My Rating (Your Rating) > 7
        const romanceMovies = movies.filter(movie => {
          const genres = movie.Genres || '';
          const myRating = parseFloat(movie['Your Rating'] || 0);
          return genres.toLowerCase().includes('romance') && myRating > 7;
        });
        
        // Sort by Release Date descending (latest first)
        romanceMovies.sort((a, b) => {
          const dateA = parseDate(a['Release Date'] || '');
          const dateB = parseDate(b['Release Date'] || '');
          return dateB - dateA;
        });
        
        // Get top 10 movies
        const topTenMovies = romanceMovies.slice(0, 10);
        
        // Populate the list
        romanceList.innerHTML = '';
        
        for (const [index, movie] of topTenMovies.entries()) {
          const li = document.createElement('li');
          li.className = 'romance-list-item';
          
          // Create link wrapper
          const a = document.createElement('a');
          a.href = `movie-detail.html?id=${encodeURIComponent(movie.Const)}`;
          a.className = 'romance-link-wrapper';
          
          // Add item number
          const span = document.createElement('span');
          span.className = 'item-num';
          span.textContent = String(index + 1).padStart(2, '0');
          a.appendChild(span);
          
          // Add poster placeholder
          const posterDiv = document.createElement('div');
          posterDiv.className = 'romance-poster-container';
          
          const posterImg = document.createElement('img');
          posterImg.className = 'romance-poster';
          posterImg.alt = `${movie.Title} poster`;
          posterImg.style.display = 'none';
          
          const posterPlaceholder = document.createElement('div');
          posterPlaceholder.className = 'romance-poster-placeholder';
          posterPlaceholder.textContent = '—';
          
          posterDiv.appendChild(posterImg);
          posterDiv.appendChild(posterPlaceholder);
          a.appendChild(posterDiv);
          
          // Add title and ratings container
          const infoDiv = document.createElement('div');
          infoDiv.className = 'romance-info';
          
          // Add title
          const titleSpan = document.createElement('span');
          titleSpan.className = 'romance-title';
          titleSpan.textContent = movie.Title;
          infoDiv.appendChild(titleSpan);
          
          // Add ratings
          const ratingsSpan = document.createElement('span');
          ratingsSpan.className = 'romance-ratings';
          const imdbRating = movie['IMDb Rating'] || '—';
          const myRating = movie['Your Rating'] || '—';
          ratingsSpan.textContent = `IMDb: ${imdbRating} • Mine: ${myRating}`;
          infoDiv.appendChild(ratingsSpan);
          
          a.appendChild(infoDiv);
          
          li.appendChild(a);
          romanceList.appendChild(li);
          
          // For the first movie, also fetch poster for card preview
          if (index === 0) {
            const cardPosterImg = $('#romance-poster-img');
            const cardPosterPreview = $('#romance-poster-preview');
            const cardPosterPlaceholder = $('#romance-poster-placeholder');
            
            fetchTMDBPoster(movie.Title, movie.Year, cardPosterImg, cardPosterPlaceholder, (posterUrl) => {
              if (posterUrl && cardPosterPreview) {
                cardPosterPreview.style.display = 'block';
              }
            });
          }
          
          // Fetch poster from TMDB asynchronously for list item
          fetchTMDBPoster(movie.Title, movie.Year, posterImg, posterPlaceholder);
        }
      } catch (error) {
        console.error('Error loading romance movies:', error);
        romanceList.innerHTML = '<li class="romance-list-item"><span style="color: var(--text-muted);">Unable to load romance movies</span></li>';
      }
    })();
  }

  /* ============================================================
     HORROR MOVIES (Home page only)
     ============================================================ */
  const horrorList = $('#horror-list');
  
  if (horrorList) {
    (async function loadHorrorMovies() {
      try {
        const response = await fetch('imdb.csv');
        if (!response.ok) throw new Error('Failed to fetch CSV');
        
        const csvText = await response.text();
        const movies = parseCSV(csvText);
        
        // Filter: Horror genre AND My Rating (Your Rating) > 7
        const horrorMovies = movies.filter(movie => {
          const genres = movie.Genres || '';
          const myRating = parseFloat(movie['Your Rating'] || 0);
          return genres.toLowerCase().includes('horror') && myRating > 7;
        });
        
        // Sort by Release Date descending (latest first)
        horrorMovies.sort((a, b) => {
          const dateA = parseDate(a['Release Date'] || '');
          const dateB = parseDate(b['Release Date'] || '');
          return dateB - dateA;
        });
        
        // Get top 10 movies
        const topTenMovies = horrorMovies.slice(0, 10);
        
        // Populate the list
        horrorList.innerHTML = '';
        
        for (const [index, movie] of topTenMovies.entries()) {
          const li = document.createElement('li');
          li.className = 'horror-list-item';
          
          // Create link wrapper
          const a = document.createElement('a');
          a.href = `movie-detail.html?id=${encodeURIComponent(movie.Const)}`;
          a.className = 'horror-link-wrapper';
          
          // Add item number
          const span = document.createElement('span');
          span.className = 'item-num';
          span.textContent = String(index + 1).padStart(2, '0');
          a.appendChild(span);
          
          // Add poster placeholder
          const posterDiv = document.createElement('div');
          posterDiv.className = 'horror-poster-container';
          
          const posterImg = document.createElement('img');
          posterImg.className = 'horror-poster';
          posterImg.alt = `${movie.Title} poster`;
          posterImg.style.display = 'none';
          
          const posterPlaceholder = document.createElement('div');
          posterPlaceholder.className = 'horror-poster-placeholder';
          posterPlaceholder.textContent = '—';
          
          posterDiv.appendChild(posterImg);
          posterDiv.appendChild(posterPlaceholder);
          a.appendChild(posterDiv);
          
          // Add title and ratings container
          const infoDiv = document.createElement('div');
          infoDiv.className = 'horror-info';
          
          // Add title
          const titleSpan = document.createElement('span');
          titleSpan.className = 'horror-title';
          titleSpan.textContent = movie.Title;
          infoDiv.appendChild(titleSpan);
          
          // Add ratings
          const ratingsSpan = document.createElement('span');
          ratingsSpan.className = 'horror-ratings';
          const imdbRating = movie['IMDb Rating'] || '—';
          const myRating = movie['Your Rating'] || '—';
          ratingsSpan.textContent = `IMDb: ${imdbRating} • Mine: ${myRating}`;
          infoDiv.appendChild(ratingsSpan);
          
          a.appendChild(infoDiv);
          
          li.appendChild(a);
          horrorList.appendChild(li);
          
          // For the first movie, also fetch poster for card preview
          if (index === 0) {
            const cardPosterImg = $('#horror-poster-img');
            const cardPosterPreview = $('#horror-poster-preview');
            const cardPosterPlaceholder = $('#horror-poster-placeholder');
            
            fetchTMDBPoster(movie.Title, movie.Year, cardPosterImg, cardPosterPlaceholder, (posterUrl) => {
              if (posterUrl && cardPosterPreview) {
                cardPosterPreview.style.display = 'block';
              }
            });
          }
          
          // Fetch poster from TMDB asynchronously for list item
          fetchTMDBPoster(movie.Title, movie.Year, posterImg, posterPlaceholder);
        }
      } catch (error) {
        console.error('Error loading horror movies:', error);
        horrorList.innerHTML = '<li class="horror-list-item"><span style="color: var(--text-muted);">Unable to load horror movies</span></li>';
      }
    })();
  }
  
  /* ============================================================
     CSV PARSER
     ============================================================ */
  function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const movies = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      // Simple CSV parsing - split by comma
      const values = lines[i].split(',').map(v => v.trim());
      const movie = {};
      
      headers.forEach((header, index) => {
        movie[header] = values[index] || '';
      });
      
      movies.push(movie);
    }
    
    return movies;
  }

  // Helper function to parse date in DD/MM/YYYY format
  function parseDate(dateString) {
    if (!dateString) return new Date(0);
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(0);
  }

})();

