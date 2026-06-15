/**
 * Returns a debounced version of the given function.
 * The function will only be called after `delay` ms of inactivity.
 * @param {Function} fn - function to debounce
 * @param {number} delay - delay in milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    // Если пользователь снова печатает — сбрасываем предыдущий таймер
    clearTimeout(timer);

    // Запускаем новый таймер
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}