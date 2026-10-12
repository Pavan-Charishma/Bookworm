import {
  cancelOrder, getOrders, isOfflineMode, placeOrder, registerAccount, signIn,
} from "./api.js";
import { EMPTY_CHECKOUT } from "./storeUtils.js";

export function useOrderActions({
  account, orderEmail, checkout, cart, books, registerMode,
  setAccount, setOrderEmail, setCheckout, setCart, setOrders, setAvailablePoints,
  setConfirmation, setPage, setError, setOfflineDemo, setShowAccount,
}) {
  async function loadOrders(email) {
    const orders = await getOrders(email);
    setOrders(orders);
    setOrderEmail(email);
    setAvailablePoints(orders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + order.rewardPointsEarned - order.rewardPointsUsed, 0));
  }

  async function submitCheckout(event) {
    event.preventDefault();
    setError("");
    try {
      const order = await placeOrder({
        ...checkout,
        email: checkout.email.trim().toLowerCase(),
        rewardPointsToUse: Number(checkout.rewardPointsToUse) || 0,
        items: cart.map(({ book, quantity }) => ({ bookId: book.id, quantity })),
      });
      setOfflineDemo(isOfflineMode());
      setConfirmation(order);
      setOrders((orders) => [order, ...orders]);
      setAvailablePoints((points) => points - order.rewardPointsUsed + order.rewardPointsEarned);
      setOrderEmail(order.email);
      setCart([]);
      setCheckout(EMPTY_CHECKOUT);
      setPage("confirmation");
    } catch (problem) {
      setError(problem.message);
      setOfflineDemo(isOfflineMode());
    }
  }

  async function submitAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const details = { email: form.get("email"), password: form.get("password") };
    setError("");
    try {
      const saved = registerMode
        ? await registerAccount({ ...details, name: form.get("name") })
        : await signIn(details);
      setAccount(saved);
      setCheckout((current) => ({ ...current, customerName: saved.name, email: saved.email }));
      setOrderEmail(saved.email);
      setShowAccount(false);
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function openOrderHistory() {
    const email = account?.email || orderEmail;
    setPage("orders");
    if (!email) return;
    setError("");
    try {
      await loadOrders(email);
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function searchOrders(event) {
    event.preventDefault();
    setError("");
    try {
      await loadOrders(orderEmail);
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function cancelCurrentOrder(id) {
    setError("");
    try {
      const updated = await cancelOrder(id, orderEmail);
      setOrders((orders) => orders.map((order) => order.id === updated.id ? updated : order));
      setAvailablePoints((points) => Math.max(0, points - updated.rewardPointsEarned + updated.rewardPointsUsed));
    } catch (problem) {
      setError(problem.message);
    }
  }

  function buyAgain(order) {
    const booksById = new Map(books.map((book) => [book.id, book]));
    setCart((cartItems) => {
      const items = new Map(cartItems.map((item) => [item.book.id, item]));
      order.items.forEach(({ bookId, quantity }) => {
        const book = booksById.get(bookId);
        const current = items.get(bookId);
        if (book) items.set(bookId, { book, quantity: quantity + (current?.quantity || 0) });
      });
      return [...items.values()];
    });
    setPage("cart");
  }

  function startCheckout() {
    setCheckout((current) => ({
      ...current,
      customerName: account?.name || current.customerName,
      email: account?.email || current.email,
      rewardPointsToUse: 0,
    }));
    setPage("checkout");
  }

  function loadCheckoutEmail() {
    if (checkout.email.includes("@")) loadOrders(checkout.email).catch((problem) => setError(problem.message));
  }

  return {
    loadCheckoutEmail, openOrderHistory, searchOrders, buyAgain, cancelCurrentOrder,
    startCheckout, handleCheckout: submitCheckout, handleAccount: submitAccount,
    changeCheckout: (field, value) => setCheckout((current) => ({ ...current, [field]: value })),
  };
}
