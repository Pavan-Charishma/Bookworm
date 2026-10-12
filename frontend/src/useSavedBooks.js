import { useEffect, useState } from "react";
import { readSaved } from "./storeUtils.js";

export function useSavedBooks() {
  const [cart, setCart] = useState(() => readSaved("bookworm-cart"));
  const [wishlist, setWishlist] = useState(() => readSaved("bookworm-wishlist"));

  useEffect(() => localStorage.setItem("bookworm-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("bookworm-wishlist", JSON.stringify(wishlist)), [wishlist]);

  function updateBooks(books) {
    const latestBooks = new Map(books.map((book) => [book.id, book]));
    setCart((items) => items.map((item) => ({
      ...item, book: latestBooks.get(item.book.id) || item.book,
    })));
    setWishlist((items) => items.map((book) => latestBooks.get(book.id) || book));
  }

  function addToCart(book) {
    setCart((items) => {
      const existing = items.find((item) => item.book.id === book.id);
      return existing
        ? items.map((item) => item.book.id === book.id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
        : [...items, { book, quantity: 1 }];
    });
  }

  function updateQuantity(bookId, quantity) {
    setCart((items) => quantity < 1
      ? items.filter((item) => item.book.id !== bookId)
      : items.map((item) => item.book.id === bookId ? { ...item, quantity } : item));
  }

  function removeOneFromCart(book) {
    const item = cart.find((entry) => entry.book.id === book.id);
    if (item) updateQuantity(book.id, item.quantity - 1);
  }

  function toggleWishlist(book) {
    setWishlist((items) => items.some((item) => item.id === book.id)
      ? items.filter((item) => item.id !== book.id)
      : [...items, book]);
  }

  return {
    cart, setCart, wishlist, setWishlist, updateBooks, addToCart, updateQuantity, removeOneFromCart, toggleWishlist,
    cartCount: cart.reduce((count, item) => count + item.quantity, 0),
    subtotal: cart.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0),
    cartQuantities: new Map(cart.map(({ book, quantity }) => [book.id, quantity])),
    wishlistIds: new Set(wishlist.map((book) => book.id)),
  };
}
