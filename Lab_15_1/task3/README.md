# Task 3 - Employee Payroll API

RESTful API for managing employees and payroll details, with a professional web UI.

## Suggested Data Model

```json
{
  "id": 1,
  "name": "Aarav Sharma",
  "role": "Backend Developer",
  "salary": 70000,
  "currency": "USD"
}
```

## Required Endpoints

- `GET /employees` → List all employees
- `POST /employees` → Add a new employee with salary details
- `PUT /employees/:id` → Update complete employee details
- `PUT /employees/:id/salary` → Update salary of an employee
- `DELETE /employees/:id` → Remove employee from system

## Additional Route

- `GET /api-info` → API metadata and data model

## Run

From `Lab_15_1` root:

```bash
npm --prefix task3 start
```

## URLs

- Frontend: `http://localhost:3003`
- API: `http://localhost:3003/employees`
- API Info: `http://localhost:3003/api-info`

## Notes

- In-memory storage is used; data resets when the server restarts.
- All endpoints return JSON responses.
- Endpoint comments/docstrings are included in `server.js`.
