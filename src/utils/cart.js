export const CART_KEY = "cart_items";

export function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: getCartCount(items) } }));
}

export function getCartCount(items = getCartItems()) {
  return items.reduce((sum, it) => sum + Number(it.qty || 0), 0);
}

export function getCartSubtotal(items = getCartItems()) {
  return items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0), 0);
}

