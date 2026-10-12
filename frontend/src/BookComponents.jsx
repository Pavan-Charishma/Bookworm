import React, { useEffect, useRef } from "react";
import { money } from "./storeUtils.js";

export function BookCover({ book, small = false }) {
  return (
    <div className={`book-cover ${small ? "book-cover-small" : ""}`} style={{ backgroundColor: book.coverColor }}>
      <span className="cover-mark">B.</span>
      <span className="cover-title">{book.title}</span>
      <span className="cover-author">{book.author}</span>
    </div>
  );
}

export function BookCard({ book, cartQuantities, wishlistIds, onOpen, onToggleWishlist, onAddToCart, onRemoveFromCart }) {
  const saved = wishlistIds.has(book.id);
  const quantity = cartQuantities.get(book.id) || 0;

  return (
    <article className="book-card">
      <button className="cover-button" onClick={() => onOpen(book)} aria-label={`View ${book.title}`}>
        <BookCover book={book} />
      </button>
      <div className="book-card-info">
        <span className="eyebrow">{book.category}</span>
        <button className="book-title" onClick={() => onOpen(book)}>{book.title}</button>
        <p className="muted">by {book.author}</p>
        <div className="book-card-bottom">
          <strong>{money(book.price)}</strong>
          <div className="card-actions">
            <button className={`icon-button ${saved ? "saved" : ""}`} onClick={() => onToggleWishlist(book)}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved}>
              {saved ? "♥" : "♡"}
            </button>
            {quantity ? (
              <div className="card-quantity" aria-label={`${quantity} copies of ${book.title} in your bag`}>
                <button onClick={() => onRemoveFromCart(book)} aria-label={`Remove one ${book.title}`}>−</button>
                <span aria-live="polite">{quantity}</span>
                <button onClick={() => onAddToCart(book)} aria-label={`Add one ${book.title}`}>+</button>
              </div>
            ) : <button className="small-button" onClick={() => onAddToCart(book)}>Add to bag</button>}
          </div>
        </div>
        {quantity > 0 && <p className="bag-count" aria-live="polite">✓ {quantity} {quantity === 1 ? "copy" : "copies"} in your bag</p>}
      </div>
    </article>
  );
}

export function BookGrid({ books, ...cardProps }) {
  return <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} {...cardProps} />)}</div>;
}

export function StoreHeader({ search, onSearch, account, cartCount, onNavigate, onOrders, onAccount }) {
  const searchInput = useRef(null);

  useEffect(() => {
    function focusSearch(event) {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <>
      <div className="announcement">A little more wonder in every chapter <span>✦</span></div>
      <header className="site-header">
        <button className="brand" onClick={() => onNavigate("shop")} aria-label="Bookworm home">
          <span className="brand-icon">b</span>
          <span>bookworm<span className="brand-dot">.</span><small>YOUR NEIGHBOURHOOD BOOKSHOP</small></span>
        </button>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input ref={searchInput} value={search} onChange={(event) => onSearch(event.target.value)}
            placeholder="Search books or authors..." />
          {search ? <button className="clear-search" onClick={() => onSearch("")} aria-label="Clear search">×</button> : <kbd>/</kbd>}
        </label>
        <nav className="header-actions" aria-label="Main navigation">
          <button onClick={() => onNavigate("wishlist")}>♡ <span className="nav-label">Saved</span></button>
          <button onClick={onOrders}>▤ <span className="nav-label">Orders</span></button>
          <button onClick={onAccount}>☺ <span className="nav-label">{account ? account.name.split(" ")[0] : "Account"}</span></button>
          <button className="cart-link" onClick={() => onNavigate("cart")}>Bag <span>{cartCount}</span></button>
        </nav>
      </header>
    </>
  );
}

export function HomeHero({ onBrowse }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">WELCOME TO BOOKWORM INDIA</p>
          <h1>Find a book<br />you will love<span>.</span></h1>
          <p>Stories, ideas and new adventures, all on one friendly bookshelf. Start exploring and find your next read.</p>
          <button className="primary-button" onClick={onBrowse}>Browse books <span>→</span></button>
          <div className="hero-note">10 books · 5 categories · Prices in Indian rupees</div>
        </div>
        <div className="hero-art" aria-label="A small stack of books">
          <div className="sun-shape" />
          <div className="hero-book hero-book-back">THE<br />QUIET<br />THINGS</div>
          <div className="hero-book hero-book-middle">A MAP<br />OF<br />MAYBE</div>
          <div className="hero-book hero-book-front">GROW<br />TOWARD<br />THE LIGHT</div>
          <div className="hero-flower">✿</div>
        </div>
      </section>
      <section className="benefits" aria-label="Bookworm benefits">
        <div><span>₹</span><p><strong>Prices in INR</strong><small>Clear Indian rupee pricing</small></p></div>
        <div><span>10</span><p><strong>10 books to browse</strong><small>Across five categories</small></p></div>
        <div><span>♡</span><p><strong>Save your favourites</strong><small>Keep a personal wishlist</small></p></div>
      </section>
    </>
  );
}
