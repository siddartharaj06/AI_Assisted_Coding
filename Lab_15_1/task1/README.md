# Student Records API

A professional RESTful API for managing student records using an in-memory data store, with a clean web interface.

## Features

- CRUD operations for student records
- JSON request/response handling
- Auto-generated Swagger API documentation
- Professional frontend for managing records

## Tech Stack

- Node.js
- Express.js
- Swagger UI + JSDoc

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open:

- Web App: `http://localhost:3000`
- API Base URL: `http://localhost:3000/students`
- API Docs: `http://localhost:3000/api-docs`

## Endpoints

- `GET /students` → List all students
- `POST /students` → Add a new student
- `PUT /students/:id` → Update student details
- `DELETE /students/:id` → Delete a student record

## Example Request Body

```json
{
  "name": "Alice Brown",
  "age": 22,
  "course": "Data Science"
}
```

## Notes

- Data is stored in memory and resets when the server restarts.
