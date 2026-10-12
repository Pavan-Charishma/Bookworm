import React from "react";
import { BookCover } from "./BookComponents.jsx";
import { money } from "./storeUtils.js";

export function CartPage({ cart, subtotal, onQuantity, onCheckout, onShop }) {
  return (
    <section className="content-page narrow-page">
      <div className="section-heading"><div><p className="eyebrow">YOUR BOOK BAG</p><h2>A few good reads</h2></div></div>
      {cart.length ? (
        <div className="cart-layout">
          <div className="cart-items">{cart.map(({ book, quantity }) => (
            <div className="cart-row" key={book.id}>
              <BookCover book={book} small />
              <div className="cart-book-info"><strong>{book.title}</strong><span>by {book.author}</span>
                <button className="text-button" onClick={() => onQuantity(book.id, 0)}>Remove</button></div>
              <div className="quantity-control">
                <button onClick={() => onQuantity(book.id, quantity - 1)} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button onClick={() => onQuantity(book.id, quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
              <strong>{money(Number(book.price) * quantity)}</strong>
            </div>
          ))}</div>
          <aside className="order-summary">
            <h3>Order summary</h3><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div><span>Delivery</span><strong>Free</strong></div>
            <div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div>
            <button className="primary-button full-button" onClick={onCheckout}>Continue to checkout <span>→</span></button>
            <button className="text-button" onClick={onShop}>← Keep browsing</button>
          </aside>
        </div>
      ) : <div className="empty-state">Your bag is taking a quiet moment. Find a book to bring home.
        <button className="primary-button" onClick={onShop}>Browse books</button></div>}
    </section>
  );
}

export function CheckoutPage({
  cart, checkout, onFieldChange, availablePoints, subtotal, pointsDiscount, total, onSubmit, onEmailBlur,
}) {
  return (
    <section className="content-page narrow-page">
      <div className="section-heading"><div><p className="eyebrow">THE NEXT CHAPTER</p><h2>Checkout</h2></div></div>
      <div className="cart-layout">
        <form className="checkout-form" onSubmit={onSubmit}>
          <h3>Where should we send your books?</h3>
          <div className="form-grid">
            <label>Full name<input required maxLength="120" value={checkout.customerName}
              onChange={(event) => onFieldChange("customerName", event.target.value)} /></label>
            <label>Email address<input required type="email" value={checkout.email} onBlur={onEmailBlur}
              onChange={(event) => onFieldChange("email", event.target.value)} /></label>
            <label>Phone number<input required value={checkout.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)} /></label>
            <label>Street address<input required value={checkout.address}
              onChange={(event) => onFieldChange("address", event.target.value)} /></label>
            <label>City<input required value={checkout.city} onChange={(event) => onFieldChange("city", event.target.value)} /></label>
            <label>Postal code<input required value={checkout.postalCode}
              onChange={(event) => onFieldChange("postalCode", event.target.value)} /></label>
          </div>
          <h3 className="payment-heading">Payment choice</h3>
          <label>Demo payment method
            <select value={checkout.paymentMethod} onChange={(event) => onFieldChange("paymentMethod", event.target.value)}>
              <option value="CARD">Card option (demo only)</option><option value="PAYPAL">PayPal option (demo only)</option>
              <option value="CASH_ON_DELIVERY">Cash on delivery (demo only)</option>
            </select>
          </label>
          <div className="demo-note"><strong>Demo checkout only</strong>
            <span>This project is not connected to a payment provider. No card or PayPal details are requested, and no money will be charged.</span></div>
          <button className="primary-button full-button" type="submit">Place demo order · {money(total)}</button>
        </form>
        <aside className="order-summary">
          <h3>Your books</h3>
          {cart.map(({ book, quantity }) =>
            <div key={book.id}><span>{book.title} × {quantity}</span><strong>{money(Number(book.price) * quantity)}</strong></div>)}
          <label className="points-field">Use reward points <span>You have {availablePoints} points</span>
            <input type="number" min="0" max={availablePoints} value={checkout.rewardPointsToUse}
              onChange={(event) => onFieldChange("rewardPointsToUse", event.target.value)} /></label>
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          {pointsDiscount > 0 && <div><span>Points discount</span><strong>−{money(pointsDiscount)}</strong></div>}
          <div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>
          <small>Earn 1 reward point for every ₹100 spent.</small>
        </aside>
      </div>
    </section>
  );
}
