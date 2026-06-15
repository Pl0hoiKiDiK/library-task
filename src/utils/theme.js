const STORAGE_KEY = 'library_theme';

/**
 * Get saved theme from localStorage, default to 'light'
 * @returns {'light'|'dark'}
 */
export function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'light';
}

/**
 * Apply theme to the document
 * @param {'light'|'dark'} theme
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Save theme preference to localStorage
 * @param {'light'|'dark'} theme
 */
export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}