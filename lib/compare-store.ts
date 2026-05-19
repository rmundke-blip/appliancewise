const COMPARE_KEY = 'appliancewise_compare';

import { getProductById } from '@/lib/data';

export type AddToCompareResult =
  | { status: 'added' }
  | { status: 'limit' }
  | { status: 'category' }
  | { status: 'duplicate' };

export function getCompareIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCompare(id: string): AddToCompareResult {
  const ids = getCompareIds();
  if (ids.includes(id)) return { status: 'duplicate' };
  if (ids.length >= 3) return { status: 'limit' };

  const product = getProductById(id);
  if (!product) return { status: 'limit' };

  const existingCategory = ids
    .map((compareId) => getProductById(compareId)?.categorySlug)
    .filter(Boolean)[0];

  if (existingCategory && product.categorySlug !== existingCategory) {
    return { status: 'category' };
  }

  localStorage.setItem(COMPARE_KEY, JSON.stringify([...ids, id]));
  window.dispatchEvent(new Event('compare-updated'));
  return { status: 'added' };
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
