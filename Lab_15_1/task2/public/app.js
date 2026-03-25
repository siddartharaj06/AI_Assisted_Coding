const apiBase = '/books';

const form = document.getElementById('book-form');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const availableInput = document.getElementById('available');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const formTitle = document.getElementById('form-title');
const statusEl = document.getElementById('status');
const booksBody = document.getElementById('books-body');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b42318' : '#334155';
}

function resetForm() {
  bookIdInput.value = '';
  form.reset();
  availableInput.checked = true;
  submitBtn.textContent = 'Add Book';
  formTitle.textContent = 'Add New Book';
  cancelBtn.classList.add('hidden');
}

function startEdit(book) {
  bookIdInput.value = String(book.id);
  titleInput.value = book.title;
  authorInput.value = book.author;
  availableInput.checked = book.available;
  submitBtn.textContent = 'Save Changes';
  formTitle.textContent = `Edit Book #${book.id}`;
  cancelBtn.classList.remove('hidden');
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

function createBadge(available) {
  const span = document.createElement('span');
  span.className = `badge ${available ? 'available' : 'unavailable'}`;
  span.textContent = available ? 'Available' : 'Unavailable';
  return span;
}

async function toggleAvailability(book) {
  try {
    await requestJson(`${apiBase}/${book.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !book.available })
    });

    setStatus(`Availability updated for book #${book.id}.`);
    await loadBooks();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function removeBook(bookId) {
  const confirmed = window.confirm(`Remove book #${bookId}?`);
  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`${apiBase}/${bookId}`, { method: 'DELETE' });
    setStatus(`Book #${bookId} removed.`);
    await loadBooks();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderBooks(books) {
  booksBody.innerHTML = '';

  if (!books.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No books found.</td>';
    booksBody.appendChild(row);
    return;
  }

  books.forEach((book) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td></td>
      <td class="actions-cell"></td>
    `;

    const badgeCell = row.children[3];
    badgeCell.appendChild(createBadge(book.available));

    const actionsCell = row.children[4];

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'secondary';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(book));

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'secondary';
    toggleBtn.textContent = book.available ? 'Mark Unavailable' : 'Mark Available';
    toggleBtn.addEventListener('click', () => toggleAvailability(book));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => removeBook(book.id));

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(toggleBtn);
    actionsCell.appendChild(deleteBtn);

    booksBody.appendChild(row);
  });
}

async function loadBooks() {
  try {
    const books = await requestJson(apiBase);
    renderBooks(books);
  } catch (error) {
    setStatus(error.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    available: availableInput.checked
  };

  const bookId = bookIdInput.value;
  const isEdit = Boolean(bookId);

  try {
    await requestJson(isEdit ? `${apiBase}/${bookId}` : apiBase, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setStatus(isEdit ? `Book #${bookId} updated.` : 'Book added successfully.');
    resetForm();
    await loadBooks();
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
  setStatus('Edit cancelled.');
});

refreshBtn.addEventListener('click', async () => {
  await loadBooks();
  setStatus('Book list refreshed.');
});

loadBooks();
