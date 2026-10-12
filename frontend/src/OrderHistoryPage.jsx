import React from "react";
import { money } from "./storeUtils.js";

export function OrdersPage({ orders, email, setEmail, availablePoints, onSubmit, onBuyAgain, onCancel }) {
  return (
    <section className="content-page narrow-page">
      <div className="section-heading"><div><p className="eyebrow">YOUR BOOK JOURNEY</p><h2>Order history</h2></div></div>
      <form className="history-search" onSubmit={onSubmit}>
        <label>Email used at checkout<input type="email" required value={email}
          onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        <button className="primary-button">Find my orders</button>
      </form>
      {orders.length ? <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-header">
              <div><span className="eyebrow">ORDER #{order.id}</span>
                <p>{new Date(order.createdAt).toLocaleDateString()} · {order.status.toLowerCase()}</p></div>
              <strong>{money(order.total)}</strong>
            </div>
            <div className="order-lines">{order.items.map((item) =>
              <span key={item.bookId}>{item.title} × {item.quantity}</span>)}</div>
            <div className="order-card-actions">
              <button className="secondary-button" onClick={() => onBuyAgain(order)}>Buy again</button>
              {order.status === "PLACED" &&
                <button className="text-button cancel-button" onClick={() => onCancel(order.id)}>Cancel within 48 hours</button>}
            </div>
          </article>
        ))}
        <p className="muted points-summary">Your available reward points: <strong>{availablePoints}</strong></p>
      </div> : <div className="empty-state">Enter the email used at checkout to find your orders.</div>}
    </section>
  );
}
