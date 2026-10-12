import React from "react";
import { StoreHeader } from "./BookComponents.jsx";
import { AccountDialog, BookDialog } from "./StoreDialogs.jsx";
import { ShopPage } from "./CataloguePage.jsx";
import { CartPage, CheckoutPage } from "./ShoppingPages.jsx";
import { OrdersPage } from "./OrderHistoryPage.jsx";
import { ConfirmationPage, WishlistPage } from "./StorePages.jsx";
import { useBookstore } from "./useBookstore.js";

export default function App() {
  const { state, data, actions } = useBookstore();
  const { page, error, offlineDemo } = state;
  const { cardProps } = data;

  const pages = {
    shop: <ShopPage {...{
      ...state, ...data, setCategory: actions.setCategory, setPublisher: actions.setPublisher,
      setFormat: actions.setFormat, setMinPrice: actions.setMinPrice, setMaxPrice: actions.setMaxPrice,
      setSort: actions.setSort, onClearFilters: actions.clearFilters,
      onOpenBook: actions.setSelectedBook,
    }} />,
    wishlist: <WishlistPage wishlist={state.wishlist} cardProps={cardProps} />,
    cart: <CartPage cart={state.cart} subtotal={data.subtotal} onQuantity={actions.updateQuantity}
      onCheckout={actions.startCheckout} onShop={() => actions.setPage("shop")} />,
    checkout: <CheckoutPage {...{
      cart: state.cart, checkout: state.checkout, availablePoints: state.availablePoints,
      subtotal: data.subtotal, pointsDiscount: data.pointsDiscount, total: data.total,
      onFieldChange: actions.changeCheckout, onSubmit: actions.handleCheckout,
      onEmailBlur: actions.loadCheckoutEmail,
    }} />,
    confirmation: state.confirmation && <ConfirmationPage order={state.confirmation}
      onOrders={actions.openOrderHistory} onShop={() => actions.setPage("shop")} />,
    orders: <OrdersPage orders={state.orders} email={state.orderEmail} setEmail={actions.setOrderEmail}
      availablePoints={state.availablePoints} onSubmit={actions.searchOrders}
      onBuyAgain={actions.buyAgain} onCancel={actions.cancelCurrentOrder} />,
  };

  return (
    <div className="app-shell">
      <StoreHeader search={state.search} onSearch={actions.setSearch} account={state.account}
        cartCount={data.cartCount} onNavigate={actions.setPage} onOrders={actions.openOrderHistory}
        onAccount={actions.openAccount} />
      {error && <div className="error-banner" role="alert">{error}
        <button onClick={() => actions.setError("")} aria-label="Dismiss message">×</button></div>}
      {offlineDemo && <div className="offline-banner" role="status">
        Demo mode: the API is offline. Books and demo orders are saved in this browser.
      </div>}
      <main>{pages[page]}</main>
      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-icon">b</span><span>bookworm.</span></div>
        <p>A cozy corner for curious readers.</p>
        <span>Demo bookstore · Payments are simulated</span>
      </footer>
      <BookDialog book={state.selectedBook} books={state.books}
        onClose={() => actions.setSelectedBook(null)} onAddToCart={actions.addToCart}
        onOpenBook={actions.setSelectedBook} />
      {state.showAccount && <AccountDialog account={state.account} registerMode={state.registerMode}
        setRegisterMode={actions.setRegisterMode} onClose={() => actions.setShowAccount(false)}
        onSubmit={actions.handleAccount} onSignOut={actions.signOut} />}
    </div>
  );
}
