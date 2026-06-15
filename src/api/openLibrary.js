const BASE_URL = 'https://openlibrary.org';
const COVER_URL = 'https://covers.openlibrary.org/b/id';

/**
 * Search books by query
 * @param {string} query - search term (title, author or keyword)
 * @returns {Promise<Array>} array of book objects
 */
export async function searchBooks(query) {
  const encoded = encodeURIComponent(query.trim());
  const response = await fetch(`${BASE_URL}/search.json?q=${encoded}&limit=20`);

  if (!response.ok) {
    throw new Error('Network error');
  }

  const data = await response.json();

  return data.docs.map(doc => ({
    key: doc.key,
    title: doc.title || 'Unknown title',
    authors: doc.author_name || [],
    year: doc.first_publish_year || null,
    coverId: doc.cover_i || null,
  }));
}

/**
 * Get cover image URL by cover ID
 * @param {number|null} coverId
 * @returns {string|null}
 */
export function getCoverUrl(coverId) {
  if (!coverId) return null;
  return `${COVER_URL}/${coverId}-M.jpg`;
}