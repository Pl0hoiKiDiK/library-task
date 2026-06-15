import { getCoverUrl } from '../api/openLibrary.js';
import { isFavorite, addFavorite, removeFavorite } from '../utils/storage.js';
import grayHeart from '../assets/gray-heart-icon.svg';
import redHeart from '../assets/red-heart-icon.svg';
import grayHeartDark from '../assets/gray-heart-dark-theme-icon.svg';
import redHeartDark from '../assets/red-heart-dark-theme-icon.svg';

/**
 * Create a book card DOM element
 * @param {Object} book - book data object
 * @param {string} book.key - unique book identifier
 * @param {string} book.title - book title
 * @param {Array<string>} book.authors - list of authors
 * @param {number|null} book.year - publication year
 * @param {number|null} book.coverId - Open Library cover ID
 * @param {Function} onFavoriteToggle - callback fired after favorite state changes
 * @returns {HTMLElement} book card element
 */
export function createBookCard(book, onFavoriteToggle) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.dataset.key = book.key;

  const coverUrl = getCoverUrl(book.coverId);
  const authors = book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author';
  const favorite = isFavorite(book.key);

  // Pick heart icons based on the current theme
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const inactiveHeart = currentTheme === 'dark' ? grayHeartDark : grayHeart;
  const activeHeart = currentTheme === 'dark' ? redHeartDark : redHeart;

  card.innerHTML = `
    ${coverUrl
      ? `<img class="book-card__cover" src="${coverUrl}" alt="${book.title}" loading="lazy" />`
      : `<div class="book-card__cover-placeholder">No cover</div>`
    }
    <div class="book-card__info">
      <div class="book-card__title" title="${book.title}">${book.title}</div>
      <div class="book-card__author" title="${authors}">${authors}</div>
      ${book.year ? `<div class="book-card__year">${book.year}</div>` : ''}
    </div>
    <button class="book-card__fav-btn ${favorite ? 'active' : ''}" 
            aria-label="${favorite ? 'Remove from favorites' : 'Add to favorites'}">
      <img src="${favorite ? activeHeart : inactiveHeart}" alt="" width="30" height="30" />
    </button>
  `;

  const favBtn = card.querySelector('.book-card__fav-btn');
  const favIcon = favBtn.querySelector('img');

  // Toggle favorite state on button click
  favBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const inactiveIcon = theme === 'dark' ? grayHeartDark : grayHeart;
    const activeIcon = theme === 'dark' ? redHeartDark : redHeart;

    if (isFavorite(book.key)) {
      removeFavorite(book.key);
      favBtn.classList.remove('active');
      favIcon.src = inactiveIcon;
      favBtn.setAttribute('aria-label', 'Add to favorites');
    } else {
      addFavorite(book);
      favBtn.classList.add('active');
      favIcon.src = activeIcon;
      favBtn.setAttribute('aria-label', 'Remove from favorites');
    }
    onFavoriteToggle();
  });

  return card;
}