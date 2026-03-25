# Task 2 - Library Book Management API

RESTful API for managing library books with CRUD + partial update support.

## Endpoints

- `GET /books` → Retrieve all books
- `POST /books` → Add a new book
- `GET /books/:id` → Retrieve a specific book
- `PATCH /books/:id` → Update partial book details
- `DELETE /books/:id` → Remove a book

## Setup

Run from `Lab_15_1` root:

```bash
npm --prefix task2 start
```

Default URLs:

- `http://localhost:3001` (Frontend)
- `http://localhost:3001/api-info` (API info)

## Sample Request Bodies

POST `/books`

```json
{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "available": true
}
```

PATCH `/books/1`

```json
{
  "available": false
}
```

## Notes

- Uses in-memory storage; data resets when server restarts.
- Returns JSON responses for both success and error cases.
