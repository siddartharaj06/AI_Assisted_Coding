# Task 4 - Online Food Ordering API

Professional fullstack implementation of a food ordering backend with a practical frontend.

## Required Endpoints

- GET /menu → List available dishes
- POST /order → Place a new order
- GET /order/:id → Track order status
- PUT /order/:id → Update an existing order (items, notes, status)
- DELETE /order/:id → Cancel an order

## Additional Route

- GET /api-info → API metadata and suggested backend improvements

## AI-Generated Suggested Improvements

- Add JWT-based authentication for customers and admins
- Add pagination and filtering for menu and order history
- Add role-based access control for order status transitions
- Integrate WebSockets for real-time order tracking updates
- Persist data in PostgreSQL or MongoDB

## Run

From Lab_15_1 root:

npm --prefix task4 start

## URLs

- Frontend: http://localhost:3004
- API menu: http://localhost:3004/menu
- API info: http://localhost:3004/api-info

## Notes

- Uses in-memory storage for simulation.
- All API responses are JSON.
- Data resets on server restart.
