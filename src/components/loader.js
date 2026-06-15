const statusMessage = document.getElementById('status-message');

/**
 * Show a status message in the books area
 * @param {string} text
 * @param {boolean} isError
 */
export function showStatus(text, isError = false) {
  statusMessage.textContent = text;
  statusMessage.className = `status-message${isError ? ' error' : ''}`;
}

/**
 * Hide the status message
 */
export function hideStatus() {
  statusMessage.className = 'status-message hidden';
}