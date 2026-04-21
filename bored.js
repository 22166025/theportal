/* ============================================================
   BORED.JS — API-powered card content
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     NASA APOD API
     ============================================================ */
  async function fetchAPOD() {
    try {
      const response = await fetch('/api/apod');
      
      if (!response.ok) {
        console.error('APOD API Error:', response.status, response.statusText);
        throw new Error(`Failed to fetch APOD (Status: ${response.status})`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('APOD Error:', error);
      // Return a fallback image
      return {
        title: "Astronomy Picture of the Day",
        explanation: "The NASA API is currently unavailable. Check back later for the latest astronomy picture.",
        url: "https://apod.nasa.gov/apod/image/2404/M51_2024.jpg",
        date: new Date().toISOString().split('T')[0]
      };
    }
  }

  /* ============================================================
     QUOTABLE.IO API
     ============================================================ */
  async function fetchQuote() {
    try {
      const response = await fetch('/api/quote');
      
      if (!response.ok) {
        console.error('Quote API Error:', response.status, response.statusText);
        throw new Error(`Failed to fetch quote (Status: ${response.status})`);
      }
      
      const data = await response.json();
      console.log('Quote data received:', data);
      return data;
    } catch (error) {
      console.error('Quote Error:', error);
      // Return a fallback quote
      return {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      };
    }
  }

  /* ============================================================
     UPDATE APOD CARD
     ============================================================ */
  function updateAPODCard(data) {
    if (!data) return;

    // Format date
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Update card teaser
    const teaser = $('#apod-teaser');
    if (teaser) teaser.textContent = data.title;

    // Update card date
    const cardDate = $('#apod-date');
    if (cardDate) cardDate.textContent = formattedDate;

    // Update modal date
    const modalDate = $('#apod-modal-date');
    if (modalDate) modalDate.textContent = formattedDate;

    // Update modal content
    const apodContent = $('#apod-content');
    if (apodContent) {
      let mediaHTML = '';
      
      // Display image or video
      if (data.media_type === 'image') {
        mediaHTML = `<img src="${data.url}" alt="${data.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">`;
      } else if (data.media_type === 'video') {
        mediaHTML = `<iframe width="100%" height="400" src="${data.url}" frameborder="0" allowfullscreen style="border-radius: 12px; margin-bottom: 20px;"></iframe>`;
      }

      apodContent.innerHTML = `
        ${mediaHTML}
        <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.2rem;">${data.title}</h3>
        ${data.explanation ? `<p style="color: var(--text-secondary); line-height: 1.6;">${data.explanation}</p>` : ''}
        ${data.copyright ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 20px; border-top: 1px solid var(--border); padding-top: 15px;">© ${data.copyright}</p>` : ''}
      `;
    }
  }

  /* ============================================================
     UPDATE QUOTE CARD
     ============================================================ */
  function updateQuoteCard(data) {
    if (!data) {
      console.warn('No quote data provided');
      return;
    }

    console.log('Updating quote card with:', data);

    // Update card teaser (first 100 chars of quote)
    const teaser = $('#quote-teaser');
    if (teaser) {
      const shortQuote = data.content.length > 100 
        ? data.content.substring(0, 100) + '…' 
        : data.content;
      teaser.textContent = `"${shortQuote}"`;
      console.log('Quote teaser updated');
    }

    // Update card author
    const cardAuthor = $('#quote-author');
    if (cardAuthor) {
      cardAuthor.textContent = data.author.replace(', type.works', '');
      console.log('Card author updated');
    }

    // Update modal author
    const modalAuthor = $('#quote-modal-author');
    if (modalAuthor) {
      modalAuthor.textContent = data.author.replace(', type.works', '');
      console.log('Modal author updated');
    }

    // Update modal content
    const quoteContent = $('#quote-content');
    if (quoteContent) {
      quoteContent.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <p style="color: var(--text-primary); font-size: 1.3rem; font-weight: 500; line-height: 1.8; margin-bottom: 20px;">
            "${data.content}"
          </p>
          <p style="color: var(--primary); font-size: 1.1rem;">
            — ${data.author.replace(', type.works', '')}
          </p>
        </div>
      `;
      console.log('Quote content updated');
    }
  }

  /* ============================================================
     FETCH RANDOM MOVIE QUOTE IMAGE
     ============================================================ */
  async function fetchRandomMovieQuote() {
    try {
      const response = await fetch('/api/random-quote-image');
      
      if (!response.ok) {
        console.error('Movie Quote Error:', response.status, response.statusText);
        throw new Error(`Failed to fetch random quote (Status: ${response.status})`);
      }
      
      const data = await response.json();
      console.log('Movie quote data received:', data);
      return data;
    } catch (error) {
      console.error('Movie Quote Error:', error);
      return null;
    }
  }

  /* ============================================================
     UPDATE MOVIE QUOTE CARD
     ============================================================ */
  function updateMovieQuoteCard(data) {
    if (!data) {
      console.warn('No movie quote data provided');
      return;
    }

    console.log('Updating movie quote card with:', data);

    // Update modal title with movie name
    const modalTitle = $('#modal-3-title');
    const movieLink = $('#movie-quote-link');
    if (modalTitle && movieLink) {
      movieLink.textContent = data.movieName;
      movieLink.href = `movie-detail.html?title=${encodeURIComponent(data.movieName)}`;
      console.log('Movie title link updated');
    }

    // Display image
    const quoteImage = $('#movie-quote-image');
    const quoteContent = $('#movie-quote-content');
    if (quoteImage && quoteContent) {
      quoteImage.src = data.url;
      quoteImage.alt = `Quote from ${data.movieName}`;
      quoteImage.style.display = 'block';
      
      // Hide the loading text
      const loadingText = quoteContent.querySelector('p');
      if (loadingText) {
        loadingText.style.display = 'none';
      }
      
      console.log('Movie quote image updated');
    }
  }

  /* ============================================================
     INITIALIZE
     ============================================================ */
  async function init() {
    // Fetch and display APOD
    const apodData = await fetchAPOD();
    if (apodData) {
      updateAPODCard(apodData);
    }

    // Fetch and display Quote
    const quoteData = await fetchQuote();
    if (quoteData) {
      updateQuoteCard(quoteData);
    }

    // Fetch and display Movie Quote
    const movieQuoteData = await fetchRandomMovieQuote();
    if (movieQuoteData) {
      updateMovieQuoteCard(movieQuoteData);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
