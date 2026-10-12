import { handleDemoRequest } from "./demoApi.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
let offlineMode = false;

async function request(path, options = {}) {
  if (offlineMode) return handleDemoRequest(path, options);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    offlineMode = true;
    throw new Error("The bookstore API is offline.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || body.message || "Something went wrong. Please try again.");
  }
  return response.json();
}

export function isOfflineMode() {
  return offlineMode;
}

export async function getBooks(filters = {}) {
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value !== "" && value != null),
  );
  try {
    return await request(`/books?${query}`);
  } catch (error) {
    if (offlineMode) return handleDemoRequest(`/books?${query}`);
    throw error;
  }
}

export const getBook = (id) => request(`/books/${id}`);
export const placeOrder = (order) => request("/orders", { method: "POST", body: JSON.stringify(order) });
export const getOrders = (email) => request(`/orders?email=${encodeURIComponent(email)}`);
export const cancelOrder = (id, email) => request(`/orders/${id}/cancel?email=${encodeURIComponent(email)}`, { method: "PUT" });
export const signIn = (details) => request("/accounts/login", { method: "POST", body: JSON.stringify(details) });
export const registerAccount = (account) => request("/accounts/register", { method: "POST", body: JSON.stringify(account) });
