import React from "react";
import { BookGrid, HomeHero } from "./BookComponents.jsx";
import { CATEGORIES } from "./storeUtils.js";

export function ShopPage({
  books, loading, category, setCategory, publisher, setPublisher, format, setFormat,
  minPrice, setMinPrice, maxPrice, setMaxPrice, sort, setSort, publishers,
  recommendations, search, onClearFilters, cardProps, onOpenBook,
}) {
  return (
    <>
      <HomeHero onBrowse={() => document.getElementById("catalogue").scrollIntoView({ behavior: "smooth" })} />
      <section className="catalogue-section" id="catalogue">
        <div className="section-heading">
          <div><p className="eyebrow">THE BOOKSHELF</p><h2>Find your next chapter</h2></div>
          <span className="muted">{loading ? "Finding books..." : `${books.length} books found`}</span>
        </div>
        <div className="category-tabs" role="group" aria-label="Filter books by category">
          {CATEGORIES.map((item) => (
            <button key={item} className={category === item ? "active" : ""} aria-pressed={category === item}
              onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="catalogue-layout">
          <aside className="filters">
            <h3>Make it yours</h3>
            <label>Publisher
              <select value={publisher} onChange={(event) => setPublisher(event.target.value)}>
                <option value="">All publishers</option>
                {publishers.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Format
              <select value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="">All formats</option>
                {["Paperback", "Hardcover", "E-book"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Maximum price
              <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
                <option value="">Any price</option>
                {["300", "400", "500", "700"].map((value) =>
                  <option key={value} value={value}>Under ₹{value}</option>)}
              </select>
            </label>
            <label>Minimum price
              <select value={minPrice} onChange={(event) => setMinPrice(event.target.value)}>
                <option value="">No minimum</option>
                {["300", "400", "500"].map((value) =>
                  <option key={value} value={value}>₹{value} and up</option>)}
              </select>
            </label>
            <button className="text-button" onClick={onClearFilters}>Clear all filters</button>
          </aside>
          <div className="catalogue-results">
            {recommendations.length > 0 && category === "All books" && !search && (
              <div className="recommendation-strip">
                <div><p className="eyebrow">A LITTLE MORE LIKE YOUR LAST READ</p><h3>Picked for you</h3></div>
                <div className="recommendation-books">
                  {recommendations.map((book) =>
                    <button key={book.id} onClick={() => onOpenBook(book)}>{book.title}<span>{book.category}</span></button>)}
                </div>
              </div>
            )}
            <div className="results-bar">
              <span>{loading ? "Finding books..." : `${books.length} ${books.length === 1 ? "book" : "books"}`}</span>
              <label>Sort by
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">Featured</option><option value="title">Title</option>
                  <option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>
            {loading ? <div className="empty-state">A moment while we open the shelves...</div> :
              books.length ? <BookGrid books={books} {...cardProps} /> :
                <div className="empty-state">No books match those filters. Try clearing a filter.</div>}
          </div>
        </div>
      </section>
    </>
  );
}
