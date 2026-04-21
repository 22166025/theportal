/* ============================================================
   AUTH.JS — Authentication utilities
   ============================================================ */

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Verify user is authenticated
async function verifyAuth() {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      localStorage.removeItem('authToken');
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Auth verification error:', error);
    localStorage.removeItem('authToken');
    return null;
  }
}

// Update navbar based on auth status
async function updateNavbarAuth() {
  const user = await verifyAuth();
  const navMenu = document.getElementById('nav-menu');
  
  if (!navMenu) return;

  // Find the Sign In link
  const signinLink = Array.from(navMenu.querySelectorAll('a')).find(link => 
    link.textContent.trim() === 'Sign In'
  );
  
  // Remove old auth links
  const oldAuthLinks = navMenu.querySelectorAll('[data-auth-link]');
  oldAuthLinks.forEach(link => link.remove());

  if (user) {
    // User is logged in - show profile, wishlist, and logout
    if (signinLink) {
      signinLink.parentElement.style.display = 'none';
    }

    const wishlistItem = document.createElement('li');
    wishlistItem.className = 'nav-item';
    wishlistItem.setAttribute('role', 'none');
    wishlistItem.setAttribute('data-auth-link', 'true');
    wishlistItem.innerHTML = `<a href="wishlist.html" class="nav-link" aria-label="View your wishlist">Wishlist</a>`;

    const profileItem = document.createElement('li');
    profileItem.className = 'nav-item';
    profileItem.setAttribute('role', 'none');
    profileItem.setAttribute('data-auth-link', 'true');
    profileItem.innerHTML = `<a href="profile.html" class="nav-link" aria-label="View your profile">Profile</a>`;

    const logoutItem = document.createElement('li');
    logoutItem.className = 'nav-item';
    logoutItem.setAttribute('role', 'none');
    logoutItem.setAttribute('data-auth-link', 'true');
    logoutItem.innerHTML = `<button class="nav-link" id="nav-logout" aria-label="Sign out of your account">Logout</button>`;

    // Find the Bored? link and insert after it
    const boredLink = Array.from(navMenu.querySelectorAll('a')).find(link => 
      link.textContent.trim() === 'Bored?'
    );
    
    if (boredLink) {
      const boredItem = boredLink.closest('.nav-item');
      boredItem.after(wishlistItem);
      wishlistItem.after(profileItem);
      profileItem.after(logoutItem);
    } else {
      // Fallback: insert before theme toggle
      const themeToggle = navMenu.querySelector('.theme-toggle');
      if (themeToggle) {
        const themeItem = themeToggle.closest('.nav-item');
        themeItem.before(wishlistItem);
        wishlistItem.after(profileItem);
        profileItem.after(logoutItem);
      }
    }

    // Add logout handler
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/signin.html';
      });
    }
  } else {
    // User is not logged in - show sign in
    if (signinLink) {
      signinLink.parentElement.style.display = 'block';
    }
  }

  // Reinitialize theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const html = document.documentElement;
    
    // Remove any existing listeners by cloning
    const newThemeToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
    
    // Add fresh listener
    newThemeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portal-theme', next);
      const isLight = next === 'light';
      newThemeToggle.setAttribute('aria-pressed', String(isLight));
      newThemeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }
}

// Initialize auth on page load
window.addEventListener('load', updateNavbarAuth);
