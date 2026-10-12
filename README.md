**Simple E-Bookstore**

This is a beginner-friendly, full-stack e-bookstore application inspired by the IBM Cloud Full Stack Developer capstone requirements. It demonstrates the main steps of an online shopping experience, from browsing books to placing an order and receiving confirmation.

**Project Overview**

The application includes a React-based website and a Spring Boot REST API. It is intentionally kept simple so the code and the main application flow are easier to understand and present.

**Features**

Browse the available books.

Search for books and filter them by category.

View details for an individual book.

Add books to the cart or remove them.

Change the quantity of books in the cart.

Submit a simple checkout form.

View an order confirmation after checkout.

Use REST API endpoints to retrieve books and submit orders.

**Technology Stack**

**Frontend:**

React

Vite

JavaScript

HTML and plain CSS

**Backend:**

Java 21

Spring Boot

Spring Web

**Project Structure**

frontend/ – React user interface, pages, and styling.

backend/ – Spring Boot application and REST API.

README.md – Project overview and instructions.

**How the Application Works**

The user browses the book catalogue on the React website.

The user can search for books, filter by category, and open book details.

Selected books can be added to the cart, removed, or adjusted in quantity.

The user submits the checkout form to place an order.

The backend receives API requests and processes book and order operations.

The website displays the order confirmation.

**Run the Project Locally**

1. Start the Backend

Make sure Java 21 and Maven are installed. Open a terminal in the backend/ directory and run:

mvn spring-boot:run

The backend should start at http://localhost:8080.

2. Start the Frontend

Open a second terminal in the frontend/ directory and run:

npm install
npm run dev

Open the local URL shown by Vite. It is commonly http://localhost:5173.

API Endpoints

Method

Endpoint

Purpose

GET

/api/books

Retrieve the list of books

GET

/api/books/{id}

Retrieve details for a specific book

POST

/api/orders

Submit an order

**Example: Fetch Books Using the API**

The following JavaScript code sends a GET request to the backend to retrieve the list of available books.

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

This code uses fetch() to call the Spring Boot API, converts the response into JSON, and displays the books in the browser console. The backend must be running for the request to work.

**Project Demonstration**

Watch the application demonstration video:

▶ Watch Demo Video on Google Drive
https://drive.google.com/file/d/1wzpr3UpEi2AlDza26G3yxuckoy9T2WlZ/view?usp=sharing
