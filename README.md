# Bookworm Bookstore

A small bookstore capstone project with a React website, a Spring Boot REST API, and PostgreSQL. It is designed to be easy to run, read, and explain in a presentation.

## Start here

Follow [docs/SETUP.md](docs/SETUP.md) to start PostgreSQL, the API, and the website.

## Project folders

- `frontend/` — React pages, browser interactions, and CSS.
- `backend/` — Spring Boot API, request validation, and database queries.
- `docs/` — setup and presentation guides.

## What the website can do

- Browse 10 seeded books: two each in Fiction, Romance, Mystery, Fantasy, and Self-help.
- Shop with Indian rupee prices (₹). If the API cannot be reached, the site switches to a local demo catalogue and saves demo orders in this browser.
- Search and filter by category, publisher, format, and price; sort the results.
- Open book details and view other books in the same category.
- Save a wishlist and cart in the browser; book cards show how many copies are in the bag and update when another is added.
- Create an account or sign in for the capstone demonstration.
- Check out as a guest or signed-in customer with delivery details and simulated payment choices.
- Apply reward points, see an order confirmation, look up order history by email, buy again, and cancel an order within 48 hours.
- See suggestions from categories in previous orders.

## Important demo limitations

Payments are simulations: no card or payment-provider service is contacted, and the checkout never asks for card details. Offline demo orders are saved only in this browser; start PostgreSQL and the API to save orders in the database. Account sign-in is for learning the API flow, not production security. The demo has no real payment processing, shipping provider, email service, or production-grade authentication/session management.

## Presentation guide

See [docs/PRESENTATION.md](docs/PRESENTATION.md) for a plain-language explanation of the folders, request flow, and a short demo script.

## API reference

The OpenAPI document is at [docs/openapi.yaml](docs/openapi.yaml). The database tables and seed data are described in [database/README.md](database/README.md).

## Ignored files

The root `.gitignore` has comments explaining each excluded generated or local-only file. The `.gitignore` does not contain the explanation of the application; that belongs in this README and the presentation guide.

## Project Demonstartion

Watch the ReadNest application demostration video.
(https://drive.google.com/file/d/1wzpr3UpEi2AlDza26G3yxuckoy9T2WlZ/view?usp=sharing)
