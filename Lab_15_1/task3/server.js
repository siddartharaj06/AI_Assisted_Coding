const express = require('express');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(express.static('public'));

let nextId = 4;
let employees = [
  { id: 1, name: 'Aarav Sharma', role: 'Backend Developer', salary: 70000, currency: 'USD' },
  { id: 2, name: 'Priya Nair', role: 'QA Engineer', salary: 52000, currency: 'USD' },
  { id: 3, name: 'Rohan Mehta', role: 'Project Manager', salary: 86000, currency: 'USD' }
];

const parseEmployeeId = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'id must be a positive integer' });
    return null;
  }

  return id;
};

const findEmployee = (id) => employees.find((employee) => employee.id === id);

/**
 * Suggested Employee data model:
 * {
 *   id: number,
 *   name: string,
 *   role: string,
 *   salary: number,
 *   currency: string
 * }
 */

/**
 * GET /employees
 * Lists all employees and their salary details.
 */
app.get('/employees', (req, res) => {
  res.status(200).json(employees);
});

/**
 * POST /employees
 * Adds a new employee with salary details.
 */
app.post('/employees', (req, res) => {
  const { name, role, salary, currency = 'USD' } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }

  if (typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ error: 'role is required and must be a non-empty string' });
  }

  if (typeof salary !== 'number' || Number.isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: 'salary is required and must be a positive number' });
  }

  if (typeof currency !== 'string' || !currency.trim()) {
    return res.status(400).json({ error: 'currency must be a non-empty string' });
  }

  const newEmployee = {
    id: nextId++,
    name: name.trim(),
    role: role.trim(),
    salary,
    currency: currency.trim().toUpperCase()
  };

  employees.push(newEmployee);
  return res.status(201).json(newEmployee);
});

/**
 * PUT /employees/:id/salary
 * Updates salary details of a specific employee.
 */
app.put('/employees/:id/salary', (req, res) => {
  const id = parseEmployeeId(req, res);
  if (id === null) {
    return;
  }

  const employee = findEmployee(id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const { salary, currency } = req.body;

  if (typeof salary !== 'number' || Number.isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: 'salary is required and must be a positive number' });
  }

  if (currency !== undefined && (typeof currency !== 'string' || !currency.trim())) {
    return res.status(400).json({ error: 'currency must be a non-empty string' });
  }

  employee.salary = salary;
  if (currency !== undefined) {
    employee.currency = currency.trim().toUpperCase();
  }

  return res.status(200).json(employee);
});

/**
 * PUT /employees/:id
 * Updates complete employee details (name, role, salary, currency).
 */
app.put('/employees/:id', (req, res) => {
  const id = parseEmployeeId(req, res);
  if (id === null) {
    return;
  }

  const employee = findEmployee(id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const { name, role, salary, currency = employee.currency } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }

  if (typeof role !== 'string' || !role.trim()) {
    return res.status(400).json({ error: 'role is required and must be a non-empty string' });
  }

  if (typeof salary !== 'number' || Number.isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: 'salary is required and must be a positive number' });
  }

  if (typeof currency !== 'string' || !currency.trim()) {
    return res.status(400).json({ error: 'currency must be a non-empty string' });
  }

  employee.name = name.trim();
  employee.role = role.trim();
  employee.salary = salary;
  employee.currency = currency.trim().toUpperCase();

  return res.status(200).json(employee);
});

/**
 * DELETE /employees/:id
 * Removes an employee from the system.
 */
app.delete('/employees/:id', (req, res) => {
  const id = parseEmployeeId(req, res);
  if (id === null) {
    return;
  }

  const initialLength = employees.length;
  employees = employees.filter((employee) => employee.id !== id);

  if (employees.length === initialLength) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  return res.status(200).json({ message: 'Employee removed successfully' });
});

/**
 * GET /api-info
 * Returns API metadata and available endpoints.
 */
app.get('/api-info', (req, res) => {
  res.status(200).json({
    message: 'Employee Payroll API is running',
    dataModel: {
      id: 'number',
      name: 'string',
      role: 'string',
      salary: 'number',
      currency: 'string'
    },
    endpoints: {
      listEmployees: 'GET /employees',
      addEmployee: 'POST /employees',
      updateEmployee: 'PUT /employees/:id',
      updateSalary: 'PUT /employees/:id/salary',
      deleteEmployee: 'DELETE /employees/:id'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Employee Payroll API running on http://localhost:${PORT}`);
});
