const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/api-info', (req, res) => {
  res.status(200).json({
    message: 'Library Book Management API is running',
    endpoints: {
      getAllBooks: 'GET /books',
      createBook: 'POST /books',
      getBookById: 'GET /books/:id',
      updateBookPartially: 'PATCH /books/:id',
      deleteBook: 'DELETE /books/:id'
    }
  });
});

let nextId = 4;
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', available: true },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', available: true },
  { id: 3, title: 'Design Patterns', author: 'Erich Gamma', available: false }
];

const allowedPatchFields = ['title', 'author', 'available'];

const findBookById = (id) => books.find((book) => book.id === id);

const parseId = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'id must be a positive integer' });
    return null;
  }

  return id;
};

app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.post('/books', (req, res) => {
  const { title, author, available = true } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  if (typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'author is required and must be a non-empty string' });
  }

  if (typeof available !== 'boolean') {
    return res.status(400).json({ error: 'available must be a boolean value' });
  }

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    available
  };

  books.push(newBook);
  return res.status(201).json(newBook);
});

app.get('/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) {
    return;
  }

  const book = findBookById(id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  return res.status(200).json(book);
});

app.patch('/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) {
    return;
  }

  const book = findBookById(id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const fields = Object.keys(req.body);

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }

  const invalidFields = fields.filter((field) => !allowedPatchFields.includes(field));
  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: `Invalid field(s): ${invalidFields.join(', ')}`,
      allowedFields: allowedPatchFields
    });
  }

  if ('title' in req.body && (typeof req.body.title !== 'string' || !req.body.title.trim())) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }

  if ('author' in req.body && (typeof req.body.author !== 'string' || !req.body.author.trim())) {
    return res.status(400).json({ error: 'author must be a non-empty string' });
  }

  if ('available' in req.body && typeof req.body.available !== 'boolean') {
    return res.status(400).json({ error: 'available must be a boolean value' });
  }

  if ('title' in req.body) {
    book.title = req.body.title.trim();
  }

  if ('author' in req.body) {
    book.author = req.body.author.trim();
  }

  if ('available' in req.body) {
    book.available = req.body.available;
  }

  return res.status(200).json(book);
});

app.delete('/books/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) {
    return;
  }

  const existingLength = books.length;
  books = books.filter((book) => book.id !== id);

  if (books.length === existingLength) {
    return res.status(404).json({ error: 'Book not found' });
  }

  return res.status(200).json({ message: 'Book removed successfully' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Library Book Management API running on http://localhost:${PORT}`);
});
