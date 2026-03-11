const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

async function medusaFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${MEDUSA_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Medusa request failed: ${path}`);
  }
  return res.json();
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function createCart() {
  return medusaFetch<{ cart: MedusaCart }>('/store/carts', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getCart(cartId: string) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}`);
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items`, {
    method: 'POST',
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });
}

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'DELETE',
  });
}

export async function completeCart(cartId: string) {
  return medusaFetch<{ type: string; data: MedusaOrder }>(`/store/carts/${cartId}/complete`, {
    method: 'POST',
  });
}

// ─── Checkout ────────────────────────────────────────────────────────────────

export async function addShippingAddress(cartId: string, address: MedusaAddress) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}`, {
    method: 'POST',
    body: JSON.stringify({ shipping_address: address }),
  });
}

export async function addEmail(cartId: string, email: string) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function listShippingOptions(cartId: string) {
  return medusaFetch<{ shipping_options: MedusaShippingOption[] }>(
    `/store/shipping-options/${cartId}`,
  );
}

export async function addShippingMethod(cartId: string, optionId: string) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/shipping-methods`, {
    method: 'POST',
    body: JSON.stringify({ option_id: optionId }),
  });
}

export async function createPaymentSession(cartId: string) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/payment-sessions`, {
    method: 'POST',
  });
}

export async function setPaymentSession(cartId: string, providerId: string) {
  return medusaFetch<{ cart: MedusaCart }>(`/store/carts/${cartId}/payment-session`, {
    method: 'POST',
    body: JSON.stringify({ provider_id: providerId }),
  });
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginCustomer(email: string, password: string) {
  return medusaFetch<{ customer: MedusaCustomer }>('/store/auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerCustomer(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  return medusaFetch<{ customer: MedusaCustomer }>('/store/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logoutCustomer() {
  return medusaFetch('/store/auth', { method: 'DELETE' });
}

export async function getCustomer() {
  return medusaFetch<{ customer: MedusaCustomer }>('/store/auth');
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getMedusaProduct(productId: string) {
  return medusaFetch<{ product: MedusaProduct }>(`/store/products/${productId}`);
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MedusaCart {
  id: string;
  items: MedusaLineItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  email?: string;
  payment_sessions?: { provider_id: string; status: string }[];
}

export interface MedusaLineItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  thumbnail?: string;
  variant: { id: string; title: string; product: { title: string } };
}

export interface MedusaAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country_code: string;
  postal_code: string;
}

export interface MedusaShippingOption {
  id: string;
  name: string;
  amount: number;
}

export interface MedusaOrder {
  id: string;
  display_id: number;
  status: string;
  total: number;
  items: MedusaLineItem[];
}

export interface MedusaCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface MedusaProduct {
  id: string;
  title: string;
  variants: { id: string; title: string; prices: { amount: number; currency_code: string }[] }[];
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
