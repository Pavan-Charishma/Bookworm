import { useEffect, useMemo, useState } from "react";
import { getBooks, isOfflineMode } from "./api.js";
import { EMPTY_CHECKOUT } from "./storeUtils.js";
import { useOrderActions } from "./useOrderActions.js";
import { useSavedBooks } from "./useSavedBooks.js";

export function useBookstore() {
  const [books, setBooks] = useState([]);
  const savedBooks = useSavedBooks();
  const { cart, setCart, wishlist, subtotal } = savedBooks;
  const [account, setAccount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bookworm-account") || "null");
    } catch {
      return null;
    }
  });
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState("shop");
  const [category, setCategory] = useState("All books");
  const [search, setSearch] = useState("");
  const [publisher, setPublisher] = useState("");
  const [format, setFormat] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [orderEmail, setOrderEmail] = useState("");
  const [checkout, setCheckout] = useState(EMPTY_CHECKOUT);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offlineDemo, setOfflineDemo] = useState(isOfflineMode);
  const orderActions = useOrderActions({
    account, orderEmail, checkout, cart, books, registerMode,
    setAccount, setOrderEmail, setCheckout, setCart, setOrders, setAvailablePoints,
    setConfirmation, setPage, setError, setOfflineDemo, setShowAccount,
  });

  const filters = useMemo(() => ({
    search: search.trim(),
    category: category === "All books" ? "" : category,
    publisher, format, minPrice, maxPrice,
    sort: sort === "featured" ? "" : sort,
  }), [search, category, publisher, format, minPrice, maxPrice, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getBooks(filters)
      .then((results) => {
        if (!active) return;
        setBooks(results);
        savedBooks.updateBooks(results);
        setOfflineDemo(isOfflineMode());
      })
      .catch((problem) => { if (active) setError(problem.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters]);

  useEffect(() => {
    if (account) localStorage.setItem("bookworm-account", JSON.stringify(account));
    else localStorage.removeItem("bookworm-account");
  }, [account]);

  const publishers = [...new Set(books.map((book) => book.publisher))].sort();
  const pointsDiscount = Math.min(subtotal, Math.max(0, Number(checkout.rewardPointsToUse) || 0));
  const total = Math.max(0, subtotal - pointsDiscount);
  const recommendations = useMemo(() => {
    const purchasedIds = new Set(orders.flatMap((order) => order.items.map((item) => item.bookId)));
    const categories = new Set(books.filter((book) => purchasedIds.has(book.id)).map((book) => book.category));
    return books.filter((book) => categories.has(book.category) && !purchasedIds.has(book.id)).slice(0, 4);
  }, [books, orders]);

  function clearFilters() {
    setSearch("");
    setPublisher("");
    setFormat("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("All books");
    setSort("featured");
  }

  function addToCart(book) {
    setError("");
    savedBooks.addToCart(book);
  }

  return {
    state: {
      account, books, cart, wishlist, orders, page, category, search, publisher, format, minPrice, maxPrice, sort,
      selectedBook, showAccount, registerMode, orderEmail, checkout, availablePoints, confirmation,
      loading, error, offlineDemo,
    },
    data: {
      publishers, cartCount: savedBooks.cartCount, subtotal: savedBooks.subtotal,
      pointsDiscount, total, recommendations,
      cardProps: {
        cartQuantities: savedBooks.cartQuantities, wishlistIds: savedBooks.wishlistIds,
        onOpen: setSelectedBook, onToggleWishlist: savedBooks.toggleWishlist,
        onAddToCart: addToCart, onRemoveFromCart: savedBooks.removeOneFromCart,
      },
    },
    actions: {
      setPage, setCategory, setSearch, setPublisher, setFormat, setMinPrice, setMaxPrice, setSort,
      setSelectedBook, setShowAccount, setRegisterMode, setOrderEmail, setError,
      updateQuantity: savedBooks.updateQuantity, clearFilters,
      addToCart,
      ...orderActions,
      signOut: () => { setAccount(null); setShowAccount(false); },
      openAccount: () => { setRegisterMode(false); setShowAccount(true); },
    },
  };
}
