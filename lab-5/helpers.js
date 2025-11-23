// moduł funkcji pomocniczych np. losowanie kolorów

export function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}