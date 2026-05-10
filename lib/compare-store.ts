const COMPARE_KEY = 'appliancewise_compare';

export function getCompareIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCompare(id: string): boolean {
  const ids = getCompareIds();
  if (ids.includes(id)) return true;
  if (ids.length >= 3) return false;
  localStorage.setItem(COMPARE_KEY, JSON.stringify([...ids, id]));
  window.dispatchEvent(new Event('compare-updated'));
  return true;
}

export function removeFromCompare(id: string): void {
  const ids = getCompareIds().filter(i => i !== id);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event('compare-updated'));
}

export function isInCompare(id: string): boolean {
  return getCompareIds().includes(id);
}

export function clearCompare(): void {
  localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('compare-updated'));
}
