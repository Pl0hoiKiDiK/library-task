import './styles/main.css';
import bookIcon from './assets/book-icon.svg';
import favoritesIcon from './assets/favorites-icon.svg';
import searchIcon from './assets/search-icon.svg';
import grayHeart from './assets/gray-heart-icon.svg';
import lightThemeIcon from './assets/light-theme-icon.svg';
import darkThemeIcon from './assets/dark-theme-icon.svg';
import favoritesDarkIcon from './assets/favorites-dark-theme-icon.svg';
import grayHeartDark from './assets/gray-heart-dark-theme-icon.svg';
import redHeartDark from './assets/red-heart-dark-theme-icon.svg';
import redHeart from './assets/red-heart-icon.svg';
import { searchBooks } from './api/openLibrary.js';
import { createBookCard } from './components/bookCard.js';
import { renderFavorites } from './components/favorites.js';
import { showStatus, hideStatus } from './components/loader.js';
import { debounce } from './utils/debounce.js';
import { getSavedTheme, applyTheme, saveTheme } from './utils/theme.js';

// ===== ICONS =====
document.querySelector('.header__logo img').src = bookIcon;
document.getElementById('search-icon').src = searchIcon;
document.querySelector('.favorites-panel__title img').src = favoritesIcon;

// ===== ELEMENTS =====
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const booksGrid = document.getElementById('books-grid');
const authorFilter = document.getElementById('author-filter');
const themeToggle = document.getElementById('theme-toggle');

// Stores all books from the last search — used for client-side author filtering
let allBooks = [];

// ===== RENDER BOOKS =====
/**
 * Render book cards into the grid
 * @param {Array} books - array of book objects to display
 */
function renderBooks(books) {
  booksGrid.innerHTML = '';

  if (books.length === 0) {
    showStatus('Nothing found. Try a different query.');
    return;
  }

  hideStatus();

  books.forEach(book => {
    const card = createBookCard(book, () => {
      renderFavorites(refreshCardButtons);
    });
    booksGrid.appendChild(card);
  });
}

/**
 * Reset favorite button icon on a specific card after book is removed from favorites
 * @param {string} removedKey - key of the book that was removed
 */
function refreshCardButtons(removedKey) {
  if (!removedKey) return;

  const cards = booksGrid.querySelectorAll('.book-card');
  const theme = document.documentElement.getAttribute('data-theme');
  const inactiveHeart = theme === 'dark' ? grayHeartDark : grayHeart;

  cards.forEach(card => {
    const btn = card.querySelector('.book-card__fav-btn');
    if (!btn) return;

    const cardKey = card.dataset.key;

    if (cardKey === removedKey) {
      btn.classList.remove('active');
      btn.querySelector('img').src = inactiveHeart;
      btn.setAttribute('aria-label', 'Add to favorites');
    }
  });
}

// ===== SEARCH =====
/**
 * Fetch books from the API and render results
 */
async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    showStatus('Please enter a search query.');
    return;
  }

  booksGrid.innerHTML = '';
  showStatus('Loading...');
  searchBtn.disabled = true;

  // Reset author filter on new search
  authorFilter.value = '';

  try {
    const books = await searchBooks(query);
    allBooks = books;
    renderBooks(allBooks);
  } catch (error) {
    showStatus('Network error. Please try again.', true);
  } finally {
    searchBtn.disabled = false;
  }
}

/**
 * Filter already loaded books by author name (client-side, no API call)
 */
function handleAuthorFilter() {
  const filterValue = authorFilter.value.trim().toLowerCase();

  if (!filterValue) {
    // Empty filter — show all books
    renderBooks(allBooks);
    return;
  }

  const filtered = allBooks.filter(book =>
    book.authors.some(author =>
      author.toLowerCase().includes(filterValue)
    )
  );

  renderBooks(filtered);

  if (filtered.length === 0) {
    showStatus(`No books found by author "${authorFilter.value.trim()}".`);
  }
}

// ===== THEME =====
/**
 * Update theme toggle button icon and favorites panel icon
 * @param {'light'|'dark'} theme
 */
function updateToggleIcon(theme) {
  const icon = document.getElementById('theme-icon');
  icon.src = theme === 'dark' ? lightThemeIcon : darkThemeIcon;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  // Update favorites panel icon
  const favIcon = document.querySelector('.favorites-panel__title img');
  favIcon.src = theme === 'dark' ? favoritesDarkIcon : favoritesIcon;
}

/**
 * Update heart icons on all visible book cards to match the current theme
 * @param {'light'|'dark'} theme
 */
function updateCardsOnThemeChange(theme) {
  const inactiveHeart = theme === 'dark' ? grayHeartDark : grayHeart;
  const activeHeart = theme === 'dark' ? redHeartDark : redHeart;

  const cards = booksGrid.querySelectorAll('.book-card');
  cards.forEach(card => {
    const btn = card.querySelector('.book-card__fav-btn');
    if (!btn) return;

    if (btn.classList.contains('active')) {
      btn.querySelector('img').src = activeHeart;
    } else {
      btn.querySelector('img').src = inactiveHeart;
    }
  });
}

// ===== EVENTS =====
searchBtn.addEventListener('click', handleSearch);

const debouncedFilter = debounce(handleAuthorFilter, 200);
authorFilter.addEventListener('input', debouncedFilter);

// Trigger search on Enter key
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// Trigger search while typing with 300ms debounce
const debouncedSearch = debounce(handleSearch, 300);
searchInput.addEventListener('input', debouncedSearch);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
  updateToggleIcon(next);
  updateCardsOnThemeChange(next);
});

// ===== INIT =====
const INITIAL_QUERIES = ['adventure', 'mystery', 'science', 'history', 'fantasy', 'classic'];

/**
 * Load a random set of books on page start so the grid is never empty
 */
async function loadInitialBooks() {
  const randomQuery = INITIAL_QUERIES[Math.floor(Math.random() * INITIAL_QUERIES.length)];

  showStatus('Loading...');

  try {
    const books = await searchBooks(randomQuery);
    allBooks = books;
    renderBooks(allBooks);
    // Show the loaded topic as a placeholder hint
    searchInput.placeholder = `Try "${randomQuery}" or search your own...`;
  } catch {
    hideStatus();
  }
}

// Apply saved theme before rendering anything
const savedTheme = getSavedTheme();
applyTheme(savedTheme);
updateToggleIcon(savedTheme);

renderFavorites(refreshCardButtons);
loadInitialBooks();