const STORAGE_KEY = 'library_favorites';

/**
 * Get all favorites from localStorage
 * @returns {Array} array of book objects
 */
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Save favorites array to localStorage
 * @param {Array} favorites
 */
export function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Check if a book is in favorites by its key
 * @param {string} bookKey
 * @returns {boolean}
 */
export function isFavorite(bookKey) {
  return getFavorites().some(book => book.key === bookKey);
}

/**
 * Add a book to favorites
 * @param {Object} book
 */
export function addFavorite(book) {
  const favorites = getFavorites();
  if (!isFavorite(book.key)) {
    saveFavorites([...favorites, book]);
  }
}

/**
 * Remove a book from favorites by its key
 * @param {string} bookKey
 */
export function removeFavorite(bookKey) {
  saveFavorites(getFavorites().filter(book => book.key !== bookKey));
}