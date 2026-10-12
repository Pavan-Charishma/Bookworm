import { demoBooks } from "./demoBooks.js";

const ORDERS_KEY = "bookworm-demo-orders-inr";

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function findBooks(filters) {
  const search = (filters.search || "").toLowerCase();
  const matches = demoBooks.filter((book) =>
    (!search || book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search))
    && (!filters.category || book.category === filters.category)
    && (!filters.publisher || book.publisher === filters.publisher)
    && (!filters.format || book.format === filters.format)
    && (!filters.minPrice || book.price >= Number(filters.minPrice))
    && (!filters.maxPrice || book.price <= Number(filters.maxPrice)));

  const sorters = {
    title: (a, b) => a.title.localeCompare(b.title),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  return matches.sort(sorters[filters.sort] || (() => 0));
}

function placeOrder(order) {
  const orders = readOrders();
  const email = order.email.trim().toLowerCase();
  const points = orders
    .filter((saved) => saved.email === email && saved.status !== "CANCELLED")
    .reduce((sum, saved) => sum + saved.rewardPointsEarned - saved.rewardPointsUsed, 0);
  const items = order.items.map(({ bookId, quantity }) => {
    const book = demoBooks.find((item) => item.id === bookId);
    if (!book) throw new Error("One of the selected books could not be found.");
    return { bookId, title: book.title, author: book.author, unitPrice: book.price, quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const pointsUsed = Number(order.rewardPointsToUse) || 0;
  if (pointsUsed > points) throw new Error("There are not enough reward points on this email.");
  if (pointsUsed > subtotal) throw new Error("Reward points cannot be more than the order total.");

  const total = subtotal - pointsUsed;
  const saved = {
    id: Date.now(), customerName: order.customerName, email, address: order.address, city: order.city,
    postalCode: order.postalCode, paymentMethod: order.paymentMethod, subtotal,
    rewardPointsUsed: pointsUsed, rewardPointsEarned: Math.floor(total / 100), total,
    status: "PLACED", createdAt: new Date().toISOString(), items,
  };
  saveOrders([saved, ...orders]);
  return saved;
}

export function handleDemoRequest(path, options = {}) {
  const url = new URL(path, "http://localhost");
  const method = options.method || "GET";

  if (url.pathname === "/books" && method === "GET") {
    return findBooks(Object.fromEntries(url.searchParams));
  }
  if (url.pathname === "/orders" && method === "POST") {
    return placeOrder(JSON.parse(options.body));
  }
  if (url.pathname === "/orders" && method === "GET") {
    const email = (url.searchParams.get("email") || "").trim().toLowerCase();
    return readOrders().filter((order) => order.email === email);
  }

  const cancelPath = url.pathname.match(/^\/orders\/(\d+)\/cancel$/);
  if (cancelPath && method === "PUT") {
    const email = (url.searchParams.get("email") || "").trim().toLowerCase();
    const orders = readOrders();
    const order = orders.find((item) => item.id === Number(cancelPath[1]) && item.email === email);
    if (!order) throw new Error("Order not found for this email.");
    if (order.status !== "PLACED") throw new Error("This order can no longer be cancelled.");
    if (Date.now() - new Date(order.createdAt).getTime() > 48 * 60 * 60 * 1000) {
      throw new Error("Orders can only be cancelled within 48 hours.");
    }
    order.status = "CANCELLED";
    saveOrders(orders);
    return order;
  }

  throw new Error("Sign-in needs the API. You can still browse and check out as a guest.");
}
