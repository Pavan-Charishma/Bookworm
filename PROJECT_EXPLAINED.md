# Bookworm Project Explained

This project is a small online bookstore. It lets a user browse books, search for books, add books to a cart, save books in a wishlist, register/login to an account, and place an order. The project has three main parts:

- Frontend: the website users see in the browser
- Backend: the Java API that handles requests and logic
- Database: the PostgreSQL database that stores book and order information

The project is made for learning and presentation. It is simple to run and easy to understand.

## What this project is doing

The website shows a collection of books in different categories like Fiction, Romance, Mystery, Fantasy, and Self-help.

A user can:

- see the full list of books
- search by book name or author
- filter by category, publisher, format, and price
- sort books by price or title
- open a book to see more details
- save books to a wishlist
- add books to a shopping bag
- create an account or sign in
- place a demo order
- check order history
- cancel an order if it is still within 48 hours

The app uses Indian Rupee prices (₹) and a demo checkout. It does not connect to a real payment company. It is a sample project, not a real online store for production use.

## How the project works

The app works like this:

1. The user opens the React website in the browser.
2. The website sends requests to the Spring Boot backend.
3. The backend checks the request and talks to the PostgreSQL database.
4. The database returns the needed data.
5. The backend sends the data back as JSON.
6. The frontend shows the result on the page.

So the full flow is:

Browser -> React frontend -> Java API -> PostgreSQL database -> Java API -> React frontend

If the backend API is offline, the frontend still works using local demo data saved in the browser. This is useful for demo presentations.

## Main folders and what is inside them

### 1. frontend/

This folder is the website that users see.

Important files:

- `frontend/src/App.jsx`
  - Main page of the store
  - Contains the UI for home page, search, filters, cart, wishlist, account, checkout, and order list
  - Controls the main behavior of the website

- `frontend/src/api.js`
  - Connects the frontend to the backend API
  - Sends requests like get books, place order, login, register, get order history, and cancel order
  - If the API is unavailable, it switches to demo data saved in local browser storage

- `frontend/src/demoBooks.js`
  - Stores sample book data used when the API is offline

- `frontend/src/main.jsx`
  - Starts the React app

- `frontend/src/styles.css`
  - All design and layout styling for the website

- `frontend/package.json`
  - Lists the frontend project settings and scripts

### 2. backend/

This folder has the Java backend server that handles the app logic.

Important files:

- `backend/src/main/java/com/bookworm/BookwormApplication.java`
  - Main Java class that starts the Spring Boot project
  - Sets up password encoding and CORS so the frontend can talk to the backend

- `backend/src/main/java/com/bookworm/book/BookController.java`
  - Handles requests like getting all books or one book by ID
  - Example: GET /api/books

- `backend/src/main/java/com/bookworm/book/BookService.java`
  - Finds books from the database with filters like category, keyword, price, format, and sorting
  - Keeps the database query logic separate from the controller

- `backend/src/main/java/com/bookworm/account/AccountController.java`
  - Handles user registration and login
  - Stores account names and hashed passwords

- `backend/src/main/java/com/bookworm/order/OrderController.java`
  - Handles order create, order list, and cancel order requests

- `backend/src/main/java/com/bookworm/order/OrderService.java`
  - Very important file for the checkout process
  - Checks book prices from the database
  - Calculates totals
  - Applies reward points
  - Creates orders
  - Stores order items in the database
  - Allows cancellation only within 48 hours

- `backend/src/main/resources/application.properties`
  - Stores backend settings such as the PostgreSQL database URL and port

- `backend/src/main/resources/schema.sql`
  - Creates all database tables

- `backend/src/main/resources/data.sql`
  - Adds the initial list of books into the database

- `backend/pom.xml`
  - Maven file that manages Java dependencies

### 3. database/

This folder contains the PostgreSQL setup.

Important files:

- `database/docker-compose.yml`
  - Starts PostgreSQL in Docker
  - Creates the local demo database

- `database/README.md`
  - Gives simple notes about database setup and usage

### 4. docs/

This folder contains project guides.

Important files:

- `docs/SETUP.md`
  - Step-by-step run instructions

- `docs/PRESENTATION.md`
  - Short explanation for presentation and demo

### 5. root files

- `README.md`
  - Main project overview and project summary

- `.gitignore`
  - Tells Git to ignore files like generated build output and local environment files

## Database tables

The backend uses PostgreSQL. The important tables are:

- `books`
  - Stores book details: title, author, category, publisher, format, price, description, cover color

- `orders`
  - Stores customer, delivery, payment, totals, reward points, created time, and order status

- `order_items`
  - Stores each book inside an order and quantity of each book

- `accounts`
  - Stores account name, email, and encrypted password

The SQL setup is created automatically when the backend starts, so the database is ready with the project data.

## What the project is doing in simple words

This project is like a small bookstore website.

- The frontend shows books like a normal online shop.
- The backend acts like the shop manager and the database acts like the stock room.
- The user adds books to the bag.
- The user enters address and payment details.
- The backend checks the books and prices.
- It saves the order in the database.
- It gives the user a confirmation.

This is a full flow of a simple online shopping system.

## How checkout works

The project uses a demo checkout flow.

When a user places an order:

1. The frontend sends the selected books, email, address, and payment choice.
2. The backend checks if the selected books really exist.
3. It calculates the subtotal.
4. It checks reward points the user wants to use.
5. It subtracts reward points from the bill.
6. It calculates the total price.
7. It saves the order and each book item in the database.
8. It sends back an order summary.

Reward points rule:

- 1 reward point = ₹1 discount
- points are earned after purchase
- a user can only use points they actually have

Order cancellation rule:

- the email must match the order owner
- the order must still be in the PLACED state
- the order must be cancelled within 48 hours

## How the website behaves without the backend

The app is built to keep working even if the API is not running.

If the backend is not started:

- the frontend uses demo books from `demoBooks.js`
- the order is saved in the browser local storage
- the user can still browse and test the shop flow

This is helpful for a presentation or a classroom demo.

## Commands to run the project

The commands below are written for Windows PowerShell.

### 1. Go to the project folder

```powershell
cd C:\Users\PAVANCHARISHMAKANCHU\Documents\capstone
```

### 2. Start PostgreSQL database

```powershell
docker compose -f database/docker-compose.yml up -d
```

This starts the PostgreSQL database. The app uses the database name `bookworm` with username and password `bookworm`.

### 3. Start the Java backend

Open a new terminal and run:

```powershell
cd C:\Users\PAVANCHARISHMAKANCHU\Documents\capstone\backend
mvn spring-boot:run
```

This starts the API at:

- `http://localhost:8080`

### 4. Start the React frontend

Open another terminal and run:

```powershell
cd C:\Users\PAVANCHARISHMAKANCHU\Documents\capstone\frontend
npm install
npm run dev
```

After that, open the local URL shown by Vite. Usually it is:

- `http://localhost:5173`

### 5. Optional: check frontend build

```powershell
cd C:\Users\PAVANCHARISHMAKANCHU\Documents\capstone\frontend
npm run build
```

### 6. Optional: run backend tests

```powershell
cd C:\Users\PAVANCHARISHMAKANCHU\Documents\capstone\backend
mvn test
```

## Simple summary

This project is a bookstore app made with:

- React for the website
- Spring Boot for the backend API
- PostgreSQL for the database

It allows users to:

- see books
- search and filter books
- save favorite books
- add to cart
- create account
- place orders
- view order history
- cancel orders

The app is a demo project that shows how a real bookstore app can work in a simple way.

## Good next step

If you want to understand the project even more, open these files first:

- `README.md`
- `docs/SETUP.md`
- `frontend/src/App.jsx`
- `frontend/src/api.js`
- `backend/src/main/java/com/bookworm/order/OrderService.java`
- `backend/src/main/resources/schema.sql`

This will help you understand the project step by step.
