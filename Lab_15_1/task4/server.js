const express = require('express');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(express.static('public'));

const menu = [
  { id: 1, name: 'Margherita Pizza', category: 'Main Course', price: 10.99, available: true },
  { id: 2, name: 'Veggie Burger', category: 'Main Course', price: 8.49, available: true },
  { id: 3, name: 'Caesar Salad', category: 'Starter', price: 6.75, available: true },
  { id: 4, name: 'Pasta Alfredo', category: 'Main Course', price: 11.5, available: true },
  { id: 5, name: 'Chocolate Brownie', category: 'Dessert', price: 4.25, available: true }
];

let nextOrderId = 1;
let orders = [];

const allowedStatuses = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'items is required and must be a non-empty array' };
  }

  const normalizedItems = [];

  for (const entry of items) {
    if (!entry || !Number.isInteger(entry.menuItemId) || entry.menuItemId <= 0) {
      return { error: 'each item must include a valid menuItemId' };
    }

    const quantity = entry.quantity ?? 1;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { error: 'quantity must be a positive integer' };
    }

    const menuItem = menu.find((dish) => dish.id === entry.menuItemId && dish.available);
    if (!menuItem) {
      return { error: `menu item ${entry.menuItemId} is not available` };
    }

    normalizedItems.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      lineTotal: Number((menuItem.price * quantity).toFixed(2))
    });
  }

  return { value: normalizedItems };
};

const computeOrderTotal = (items) => Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

const parseOrderId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'id must be a positive integer' });
    return null;
  }
  return id;
};

const findOrder = (id) => orders.find((order) => order.id === id);

/**
 * GET /menu
 * List all available dishes.
 */
app.get('/menu', (req, res) => {
  res.status(200).json(menu.filter((dish) => dish.available));
});

/**
 * POST /order
 * Place a new order.
 */
app.post('/order', (req, res) => {
  const { customerName, items, notes = '' } = req.body;

  if (typeof customerName !== 'string' || !customerName.trim()) {
    return res.status(400).json({ error: 'customerName is required and must be a non-empty string' });
  }

  const normalized = normalizeItems(items);
  if (normalized.error) {
    return res.status(400).json({ error: normalized.error });
  }

  const now = new Date().toISOString();
  const newOrder = {
    id: nextOrderId++,
    customerName: customerName.trim(),
    items: normalized.value,
    notes: typeof notes === 'string' ? notes.trim() : '',
    status: 'placed',
    total: computeOrderTotal(normalized.value),
    createdAt: now,
    updatedAt: now
  };

  orders.push(newOrder);
  return res.status(201).json(newOrder);
});

/**
 * GET /order/:id
 * Track order status by id.
 */
app.get('/order/:id', (req, res) => {
  const id = parseOrderId(req, res);
  if (id === null) {
    return;
  }

  const order = findOrder(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.status(200).json(order);
});

/**
 * PUT /order/:id
 * Update an existing order (items, notes, status).
 */
app.put('/order/:id', (req, res) => {
  const id = parseOrderId(req, res);
  if (id === null) {
    return;
  }

  const order = findOrder(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    return res.status(400).json({ error: 'Delivered or cancelled orders cannot be modified' });
  }

  const { items, notes, status } = req.body;

  if (items !== undefined) {
    const normalized = normalizeItems(items);
    if (normalized.error) {
      return res.status(400).json({ error: normalized.error });
    }
    order.items = normalized.value;
    order.total = computeOrderTotal(order.items);
  }

  if (notes !== undefined) {
    if (typeof notes !== 'string') {
      return res.status(400).json({ error: 'notes must be a string' });
    }
    order.notes = notes.trim();
  }

  if (status !== undefined) {
    if (typeof status !== 'string' || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${allowedStatuses.join(', ')}`
      });
    }
    order.status = status;
  }

  order.updatedAt = new Date().toISOString();
  return res.status(200).json(order);
});

/**
 * DELETE /order/:id
 * Cancel an order.
 */
app.delete('/order/:id', (req, res) => {
  const id = parseOrderId(req, res);
  if (id === null) {
    return;
  }

  const order = findOrder(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status === 'cancelled') {
    return res.status(400).json({ error: 'Order is already cancelled' });
  }

  if (order.status === 'delivered') {
    return res.status(400).json({ error: 'Delivered order cannot be cancelled' });
  }

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();

  return res.status(200).json({ message: 'Order cancelled successfully', order });
});

app.get('/api-info', (req, res) => {
  res.status(200).json({
    message: 'Online Food Ordering API is running',
    endpoints: {
      listMenu: 'GET /menu',
      placeOrder: 'POST /order',
      getOrder: 'GET /order/:id',
      updateOrder: 'PUT /order/:id',
      cancelOrder: 'DELETE /order/:id'
    },
    suggestedImprovements: [
      'Add JWT-based authentication for customers and admins',
      'Add pagination and filtering for menu and order history',
      'Add role-based access control for order status transitions',
      'Integrate real-time updates with WebSockets for order tracking',
      'Persist data using PostgreSQL or MongoDB with migrations'
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Online Food Ordering API running on http://localhost:${PORT}`);
});
