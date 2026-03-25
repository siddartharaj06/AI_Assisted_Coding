const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let nextId = 3;
let students = [
  { id: 1, name: 'John Smith', age: 20, course: 'Computer Science' },
  { id: 2, name: 'Emma Johnson', age: 21, course: 'Information Technology' }
];

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Student Records API',
    version: '1.0.0',
    description: 'RESTful API for managing student records'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local development server'
    }
  ]
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./server.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const isValidStudentPayload = (payload, requireAllFields) => {
  const { name, age, course } = payload;

  if (requireAllFields) {
    if (typeof name !== 'string' || !name.trim()) {
      return { valid: false, message: 'name is required and must be a non-empty string' };
    }

    if (!Number.isInteger(age) || age <= 0) {
      return { valid: false, message: 'age is required and must be a positive integer' };
    }

    if (typeof course !== 'string' || !course.trim()) {
      return { valid: false, message: 'course is required and must be a non-empty string' };
    }

    return { valid: true };
  }

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return { valid: false, message: 'name must be a non-empty string' };
  }

  if (age !== undefined && (!Number.isInteger(age) || age <= 0)) {
    return { valid: false, message: 'age must be a positive integer' };
  }

  if (course !== undefined && (typeof course !== 'string' || !course.trim())) {
    return { valid: false, message: 'course must be a non-empty string' };
  }

  return { valid: true };
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Smith
 *         age:
 *           type: integer
 *           example: 20
 *         course:
 *           type: string
 *           example: Computer Science
 *     NewStudent:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - course
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         course:
 *           type: string
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: List all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
app.get('/students', (req, res) => {
  res.status(200).json(students);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewStudent'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input data
 */
app.post('/students', (req, res) => {
  const { name, age, course } = req.body;
  const validation = isValidStudentPayload(req.body, true);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    age,
    course: course.trim()
  };

  students.push(newStudent);
  return res.status(201).json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update student details
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewStudent'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
app.put('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, age, course } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const validation = isValidStudentPayload(req.body, false);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  students[studentIndex] = {
    ...students[studentIndex],
    name: typeof name === 'string' ? name.trim() : students[studentIndex].name,
    age: age ?? students[studentIndex].age,
    course: typeof course === 'string' ? course.trim() : students[studentIndex].course
  };

  return res.status(200).json(students[studentIndex]);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student record
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const originalLength = students.length;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  students = students.filter((student) => student.id !== id);

  if (students.length === originalLength) {
    return res.status(404).json({ error: 'Student not found' });
  }

  return res.status(200).json({ message: 'Student deleted successfully' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
