const form = document.getElementById('student-form');
const studentIdField = document.getElementById('student-id');
const nameField = document.getElementById('name');
const ageField = document.getElementById('age');
const courseField = document.getElementById('course');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const statusText = document.getElementById('status');
const studentsBody = document.getElementById('students-body');

const endpoint = '/students';

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? '#b42318' : '#374151';
}

function resetForm() {
  studentIdField.value = '';
  form.reset();
  submitBtn.textContent = 'Add Student';
  formTitle.textContent = 'Add Student';
  cancelBtn.classList.add('hidden');
}

function startEdit(student) {
  studentIdField.value = String(student.id);
  nameField.value = student.name;
  ageField.value = String(student.age);
  courseField.value = student.course;
  submitBtn.textContent = 'Update Student';
  formTitle.textContent = 'Edit Student';
  cancelBtn.classList.remove('hidden');
}

async function fetchStudents() {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

function renderStudents(students) {
  studentsBody.innerHTML = '';

  if (!students.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No student records found.</td>';
    studentsBody.appendChild(row);
    return;
  }

  students.forEach((student) => {
    const row = document.createElement('tr');

    const actions = document.createElement('td');
    actions.className = 'actions-cell';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'secondary';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => startEdit(student));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm(`Delete student #${student.id}?`);
      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch(`${endpoint}/${student.id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete student');
        }
        setStatus('Student deleted successfully.');
        await loadStudents();
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.course}</td>
    `;
    row.appendChild(actions);

    studentsBody.appendChild(row);
  });
}

async function loadStudents() {
  try {
    const students = await fetchStudents();
    renderStudents(students);
  } catch (error) {
    setStatus(error.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: nameField.value.trim(),
    age: Number(ageField.value),
    course: courseField.value.trim()
  };

  const id = studentIdField.value;
  const isEdit = Boolean(id);

  try {
    const response = await fetch(isEdit ? `${endpoint}/${id}` : endpoint, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    setStatus(isEdit ? 'Student updated successfully.' : 'Student added successfully.');
    resetForm();
    await loadStudents();
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
  setStatus('Edit cancelled.');
});

loadStudents();
