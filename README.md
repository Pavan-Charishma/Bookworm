# Simple E-Bookstore

***A Beginner-Friendly Full-Stack Online Bookstore***

This is a beginner-friendly, full-stack e-bookstore application inspired by the **IBM Cloud Full Stack Developer Capstone** requirements. It demonstrates the online shopping experience, from browsing books to placing an order and receiving confirmation.


## Project Overview

The application includes a **React-based frontend** and a **Spring Boot REST API**. The project demonstrates the main features and workflow of an online bookstore in a simple and understandable way.

## Features

- **Browse Books** - Explore the available book catalogue.
- **Search and Filter** - Search for books and filter them by category.
- **Book Details** - View information about individual books.
- **Shopping Cart** - Add or remove books from the cart.
- **Quantity Management** - Change the quantity of books.
- **Checkout** - Submit the checkout form to place an order.
- **Order Confirmation** - View confirmation after checkout.
- **REST API** - Retrieve book information and submit orders.

## Technology Stack

### Frontend

- **React**
- **Vite**
- **JavaScript**
- **HTML**
- **CSS**

### Backend

- **Java 21**
- **Spring Boot**
- **Spring Web**

## Project Structure

```text
Bookworm/
├── backend/
├── frontend/
├── docs/
├── .gitignore
├── PROJECT_EXPLAINED.md
└── README.md
```

- **backend/** — Spring Boot application and REST API.
- **frontend/** — React user interface, pages, and styling.
- **docs/** — Project documentation.
- **.gitignore** — Files excluded from Git.
- **PROJECT_EXPLAINED.md** — Project explanation.
- **README.md** — Project overview and instructions.

## How the Application Works

1. The user browses the book catalogue on the React website.
2. The user searches for books, filters by category, and views book details.
3. The user adds books to the cart, removes books, or adjusts quantities.
4. The user submits the checkout form to place an order.
5. The Spring Boot backend receives API requests and processes book and order operations.
6. The website displays the order confirmation.

## Run the Project Locally

### 1. Start the Backend

Make sure **Java 21** and **Maven** are installed.

Open a terminal in the `backend/` directory and run:

```bash
mvn spring-boot:run
```

The backend should start at:

http://localhost:8080

### 2. Start the Frontend

Open a second terminal in the `frontend/` directory and run:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, commonly:

http://localhost:5173

## API Endpoints

| Method | Endpoint | Purpose |
|:---:|---|---|
| `GET` | `/api/books` | Retrieve the list of books |
| `GET` | `/api/books/{id}` | Retrieve details for a specific book |
| `POST` | `/api/orders` | Submit an order |

## Example: Fetch Books Using the API

The following JavaScript code sends a GET request to the backend to retrieve available books.

```javascript
fetch("http://localhost:8080/api/books")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Unable to fetch books");
    }
    return response.json();
  })
  .then((books) => {
    console.log("Available books:", books);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

This example uses `fetch()` to call the Spring Boot API, converts the response into JSON, and displays the books in the browser console. The backend must be running for the request to work.

## Project Demonstration

Watch the application demonstration video:

**[Watch Demo Video on Google Drive](https://drive.google.com/file/d/1wzpr3UpEi2AlDza26G3yxuckoy9T2Wl/view?usp=sharing)**

## Project Objective

The objective of this project is to demonstrate the fundamentals of **full-stack web development** by connecting a React frontend with a Spring Boot REST API and implementing a basic online shopping workflow.
