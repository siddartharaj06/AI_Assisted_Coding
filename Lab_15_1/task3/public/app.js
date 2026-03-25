const apiBase = '/employees';

const form = document.getElementById('employee-form');
const employeeIdInput = document.getElementById('employee-id');
const nameInput = document.getElementById('name');
const roleInput = document.getElementById('role');
const salaryInput = document.getElementById('salary');
const currencyInput = document.getElementById('currency');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const refreshBtn = document.getElementById('refresh-btn');
const formTitle = document.getElementById('form-title');
const statusEl = document.getElementById('status');
const employeesBody = document.getElementById('employees-body');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b42318' : '#334155';
}

function resetForm() {
  employeeIdInput.value = '';
  form.reset();
  currencyInput.value = 'USD';
  submitBtn.textContent = 'Add Employee';
  formTitle.textContent = 'Add Employee';
  cancelBtn.classList.add('hidden');
}

function startEdit(employee) {
  employeeIdInput.value = String(employee.id);
  nameInput.value = employee.name;
  roleInput.value = employee.role;
  salaryInput.value = String(employee.salary);
  currencyInput.value = employee.currency;
  submitBtn.textContent = 'Save Employee';
  formTitle.textContent = `Edit Employee #${employee.id}`;
  cancelBtn.classList.remove('hidden');
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

async function loadEmployees() {
  try {
    const employees = await requestJson(apiBase);
    renderEmployees(employees);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteEmployee(id) {
  const confirmDelete = window.confirm(`Remove employee #${id}?`);
  if (!confirmDelete) {
    return;
  }

  try {
    await requestJson(`${apiBase}/${id}`, { method: 'DELETE' });
    setStatus(`Employee #${id} removed.`);
    await loadEmployees();
  } catch (error) {
    setStatus(error.message, true);
  }
}

function formatSalary(salary, currency) {
  return `${currency} ${Number(salary).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function renderEmployees(employees) {
  employeesBody.innerHTML = '';

  if (!employees.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No employees found.</td>';
    employeesBody.appendChild(row);
    return;
  }

  employees.forEach((employee) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.id}</td>
      <td>${employee.name}</td>
      <td>${employee.role}</td>
      <td>${formatSalary(employee.salary, employee.currency)}</td>
      <td class="actions-cell"></td>
    `;

    const actionsCell = row.querySelector('.actions-cell');

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'secondary';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(employee));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteEmployee(employee.id));

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    employeesBody.appendChild(row);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    role: roleInput.value.trim(),
    salary: Number(salaryInput.value),
    currency: currencyInput.value.trim().toUpperCase()
  };

  const employeeId = employeeIdInput.value;
  const isEdit = Boolean(employeeId);

  try {
    if (isEdit) {
      await requestJson(`${apiBase}/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setStatus(`Employee #${employeeId} updated successfully.`);
    } else {
      await requestJson(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setStatus('Employee added successfully.');
    }

    resetForm();
    await loadEmployees();
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
  setStatus('Edit cancelled.');
});

refreshBtn.addEventListener('click', async () => {
  await loadEmployees();
  setStatus('Employee list refreshed.');
});

loadEmployees();
