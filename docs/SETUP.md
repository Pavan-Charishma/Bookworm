# Setup guide

## Requirements

- Node.js 20.19+ or 22.12+ and npm
- Java 17 or newer
- Maven 3.8 or newer
- Docker Desktop with Docker Compose, or a local PostgreSQL 15+ server

## 1. Start PostgreSQL

From the project root, run:

```powershell
docker compose -f database/docker-compose.yml up -d
```

The database listens on `localhost:5432`. The demo database and credentials are `bookworm`, `bookworm`, and `bookworm`. Prices are shown in Indian rupees (INR). Do not use these demo credentials for a public or production deployment.

Spring Boot creates the tables and loads the catalogue from `backend/src/main/resources/schema.sql` and `data.sql` when it starts.

## 2. Start the Spring Boot API

In a new terminal:

```powershell
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`. The database settings can be overridden with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.

Useful endpoints:

- `GET /api/books` — browse books and apply query filters
- `GET /api/books/{id}` — book details
- `POST /api/accounts/register` and `POST /api/accounts/login` — demo account flow
- `POST /api/orders` — place a demo order
- `GET /api/orders?email=...` — order history
- `PUT /api/orders/{id}/cancel?email=...` — cancel an eligible order

## 3. Start the React website

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). If the API is not running, the shop automatically uses sample books and saves demo orders in your browser. Start PostgreSQL and the API to save orders in the database. Account sign-in needs the API.

## Build checks

```powershell
cd frontend
npm run build
```

```powershell
cd backend
mvn test
```

If Docker is not available, point the API at a local PostgreSQL database by setting `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` before starting Maven.
