import { getFavorites, removeFavorite } from '../utils/storage.js';
import { getCoverUrl } from '../api/openLibrary.js';
import redHeartList from '../assets/red-heart-list-icon.svg';

/**
 * Render the favorites panel with all saved books
 * @param {Function} onRemove - callback fired after a book is removed, receives book key as argument
 */
export function renderFavorites(onRemove) {
  const list = document.getElementById('favorites-list');
  const count = document.getElementById('favorites-count');
  const favorites = getFavorites();

  // Update the books counter in the panel header
  count.textContent = `${favorites.length} book${favorites.length !== 1 ? 's' : ''} saved`;
  list.innerHTML = '';

  // Show empty state if no favorites saved
  if (favorites.length === 0) {
    list.innerHTML = `
      <div class="favorites-empty">
        <p>No favorites yet.</p>
        <p>Click ♡ on any book to save it.</p>
      </div>
    `;
    return;
  }

  // Render each favorite book as a list item
  favorites.forEach(book => {
    const coverUrl = getCoverUrl(book.coverId);
    const authors = book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author';

    const item = document.createElement('div');
    item.className = 'fav-item';
    item.innerHTML = `
      ${coverUrl
        ? `<img class="fav-item__cover" src="${coverUrl}" alt="${book.title}" loading="lazy" />`
        : `<div class="fav-item__cover"></div>`
      }
      <div class="fav-item__info">
        <div class="fav-item__title" title="${book.title}">${book.title}</div>
        <div class="fav-item__author">${authors}</div>
        ${book.year ? `<div class="fav-item__year">${book.year}</div>` : ''}
      </div>
      <button class="fav-item__remove" aria-label="Remove from favorites">
        <img src="${redHeartList}" alt="" width="16" height="16" />
      </button>
    `;

    // Remove book from favorites and re-render the panel
    item.querySelector('.fav-item__remove').addEventListener('click', () => {
      removeFavorite(book.key);
      renderFavorites(onRemove);
      onRemove(book.key);
    });

    list.appendChild(item);
  });
}