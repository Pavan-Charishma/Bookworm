import React from "react";
import { BookGrid } from "./BookComponents.jsx";
import { money } from "./storeUtils.js";

export function WishlistPage({ wishlist, cardProps }) {
  return (
    <section className="content-page">
      <div className="section-heading"><div><p className="eyebrow">YOUR LITTLE LIST</p><h2>Saved for later</h2></div></div>
      {wishlist.length ? <BookGrid books={wishlist} {...cardProps} /> :
        <div className="empty-state">Your wishlist is waiting for a story. Tap the heart on any book to save it.</div>}
    </section>
  );
}

export function ConfirmationPage({ order, onOrders, onShop }) {
  return (
    <section className="content-page confirmation-page">
      <div className="confirmation-icon">✓</div>
      <p className="eyebrow">ORDER #{order.id}</p>
      <h2>Your next chapter is on its way.</h2>
      <p>Thanks, {order.customerName}. Your demo order is confirmed for {money(order.total)}.</p>
      <p className="muted">Demo order only — no payment was processed. You earned {order.rewardPointsEarned} reward points.</p>
      <div className="confirmation-actions">
        <button className="primary-button" onClick={onOrders}>View order history</button>
        <button className="secondary-button" onClick={onShop}>Back to the books</button>
      </div>
    </section>
  );
}
