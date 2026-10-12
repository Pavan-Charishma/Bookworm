# Presentation guide

## Explain the project in one minute

“Bookworm is a small online bookstore with prices in Indian rupees. The React frontend shows books and collects a checkout form. When the API is running, it sends JSON requests to Spring Boot, which validates the request and reads or writes PostgreSQL rows. If the API is offline, the site uses sample books and stores demo orders in the browser so the presentation can still continue.”

## Explain each folder

- `frontend/` contains `App.jsx` to connect the screens, `useBookstore.js` for shared store state, `useSavedBooks.js` for cart and wishlist, and `useOrderActions.js` for checkout and order actions. `api.js` sends server requests; `demoApi.js` supports offline demos; page and UI files render the screens. `storeUtils.js` holds shared values, and `styles.css` controls appearance.
- `backend/` contains Java REST controllers, services, request/response records, and database access. Controllers handle HTTP; services contain the checkout and cancellation rules.
- `database/` contains Docker Compose for a local PostgreSQL database and database notes. The initial schema and book data live in the backend resources because Spring Boot initializes them when it starts.
- `docs/` contains these instructions, the setup steps, and the API contract.

## Explain a typical request

1. The browser calls `GET /api/books?category=Fantasy` using the helper in `frontend/src/api.js`.
2. `BookController` receives the request and `BookService` builds a parameterized query.
3. PostgreSQL returns matching rows.
4. Spring Boot serializes the book records to JSON.
5. React stores the response and draws the book cards.

## Explain checkout

The frontend sends book IDs and quantities, delivery details, the chosen demo payment type, and points to use. `OrderService` reloads the book prices from the database rather than trusting prices from the browser. It calculates the total in rupees, uses one point as a ₹1 discount, awards one point for every ₹100 spent, stores the order and its lines, and returns a confirmation. Cancellation checks that the order belongs to the supplied email and is no more than 48 hours old.

## Explain `.gitignore`

`.gitignore` tells Git not to include files that can be recreated or are specific to one computer. Its comments explain why each pattern is ignored. For example, `frontend/node_modules/` is restored with `npm install`, and `backend/target/` is recreated by Maven. The source code, SQL setup, and documentation are not ignored.

## Short demo script

1. Browse the ten sample books in five categories and search for a title.
2. Press `/` to focus search, type a title, and use the `×` button to clear it.
3. Filter by format or publisher, then sort by price. Choose “Clear all filters” to reset.
4. Open a book, add it to the wishlist, and adjust the book-card quantity with `−` and `+`.
5. Proceed to checkout, enter delivery details, select a simulated payment choice, and place the order.
6. Open order history with the same email, then demonstrate Buy Again.
7. Cancel the new order and explain the 48-hour rule.
8. Point out the setup guide, API contract, SQL seed data, and `.gitignore`.

## Concepts to explain

- **Frontend:** React components, state, forms, browser storage, and CSS.
- **Backend:** REST endpoints, JSON, validation, and separation between controllers and services.
- **Database:** tables, primary/foreign keys, parameterized SQL, and seed data.
- **Demo boundaries:** prices and reward points use rupees. Payment choices only demonstrate checkout; they do not contact a gateway or charge a card. Offline demo orders stay in the browser, and the account flow is not production authentication.
