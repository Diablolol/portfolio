export function sanitizeHTML(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}
