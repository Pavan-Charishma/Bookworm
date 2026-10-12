import React from "react";
import { BookCover } from "./BookComponents.jsx";
import { money } from "./storeUtils.js";

export function BookDialog({ book, books, onClose, onAddToCart, onOpenBook }) {
  if (!book) return null;
  const relatedBooks = books.filter((item) => item.category === book.category && item.id !== book.id).slice(0, 3);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="book-modal" role="dialog" aria-modal="true" aria-label={book.title} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        <BookCover book={book} />
        <div className="book-modal-copy">
          <p className="eyebrow">{book.category} · {book.format}</p>
          <h2>{book.title}</h2><p className="muted">by {book.author}</p>
          <p>{book.description}</p><p className="muted">Published by {book.publisher}</p>
          <strong className="modal-price">{money(book.price)}</strong>
          <button className="primary-button" onClick={() => onAddToCart(book)}>Add to bag</button>
          <h3>More to explore</h3>
          <div className="related-books">
            {relatedBooks.map((item) => <button key={item.id} onClick={() => onOpenBook(item)}>{item.title}<span>{money(item.price)}</span></button>)}
          </div>
        </div>
      </section>
    </div>
  );
}

export function AccountDialog({ account, registerMode, setRegisterMode, onClose, onSubmit, onSignOut }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="account-modal" role="dialog" aria-modal="true" aria-label={registerMode ? "Create an account" : "Sign in"}
        onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close sign in">×</button>
        <p className="eyebrow">YOUR BOOKWORM ACCOUNT</p>
        <h2>{registerMode ? "Join the book club" : "Welcome back"}</h2>
        <p className="muted">Sign in to make checkout a little easier.</p>
        <form onSubmit={onSubmit}>
          {registerMode && <label>Your name<input name="name" required maxLength="120" /></label>}
          <label>Email address<input name="email" type="email" required maxLength="180" /></label>
          <label>Password<input name="password" type="password" required minLength={registerMode ? 6 : 1} /></label>
          <button className="primary-button full-button">{registerMode ? "Create account" : "Sign in"}</button>
        </form>
        <button className="text-button account-switch" onClick={() => setRegisterMode(!registerMode)}>
          {registerMode ? "Already have an account? Sign in" : "New to Bookworm? Create an account"}
        </button>
        {account && <button className="text-button signout-button" onClick={onSignOut}>Sign out</button>}
      </section>
    </div>
  );
}
