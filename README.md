
# Expenses API

This service is a simple REST API for managing expenses. It provides an endpoint to create and list expenses.

## Features

- Create a new expense
- List all expenses
- Data validation using Zod
- PostgreSQL as a database

## Technologies

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

### Running the Application

To run the application with Docker Compose:

```bash
docker-compose up -d
```

This will start the API on port 3000 and a PostgreSQL database on port 5432.

## API Reference

### Create Expense

Creates a new expense.

- **URL:** `/expenses`
- **Method:** `POST`
- **Headers:**
  - `Content-Type`: `application/json`
  - `X-Correlation-Id`: `string` (optional) - A UUID to track the request.
  - `X-Source`: `string` (optional) - The source of the request.
- **Body:**

  ```json
  {
    "amount": 10000, // Stored in cents
    "description": "Lunch at a restaurant",
    "category": "fast food",
    "date": "2024-01-01"
  }
  ```

- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** The created expense object.

- **Error Response:**
  - **Code:** `400 Bad Request`
  - **Content:** `{ "message": "error message" }`

### List Expenses

Returns a list of all expenses.

- **URL:** `/expenses`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** An array of expense objects.

## Database Schema

The database schema is defined in `queries/schema.sql`. It consists of two tables: `transactions` and `expenses`.

```sql
CREATE TABLE transactions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    amount INT NOT NULL,
    date DATE NOT NULL,
    correlation_id UUID UNIQUE,
    source VARCHAR(50)
);

CREATE TABLE expenses (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    id_transaction INT UNIQUE,
    CONSTRAINT fk_expense_transaction
        FOREIGN KEY (id_transaction)
        REFERENCES transactions(id)
        ON DELETE CASCADE
);
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

To run the tests in watch mode:

```bash
npm run test:watch
```
