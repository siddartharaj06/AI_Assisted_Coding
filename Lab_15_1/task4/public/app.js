const menuList = document.getElementById('menu-list');
const menuItemSelect = document.getElementById('menu-item');
const updateMenuItemSelect = document.getElementById('update-menu-item');
const orderForm = document.getElementById('order-form');
const trackForm = document.getElementById('track-form');
const updateForm = document.getElementById('update-form');
const cancelOrderBtn = document.getElementById('cancel-order-btn');
const statusEl = document.getElementById('status');

const customerNameInput = document.getElementById('customer-name');
const quantityInput = document.getElementById('quantity');
const notesInput = document.getElementById('notes');
const trackOrderIdInput = document.getElementById('track-order-id');
const updateQuantityInput = document.getElementById('update-quantity');
const updateStatusInput = document.getElementById('update-status');
const updateNotesInput = document.getElementById('update-notes');

const orderPanel = document.getElementById('order-panel');
const viewId = document.getElementById('view-id');
const viewCustomer = document.getElementById('view-customer');
const viewStatus = document.getElementById('view-status');
const viewTotal = document.getElementById('view-total');
const viewItems = document.getElementById('view-items');

let cachedMenu = [];
let currentOrder = null;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b42318' : '#334155';
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function formatCurrency(value) {
  return `USD ${Number(value).toFixed(2)}`;
}

function renderMenu(menu) {
  menuList.innerHTML = '';
  menuItemSelect.innerHTML = '';
  updateMenuItemSelect.innerHTML = '';

  menu.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'menu-item';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.category}</p>
      <p>${formatCurrency(item.price)}</p>
    `;
    menuList.appendChild(card);

    const option = document.createElement('option');
    option.value = String(item.id);
    option.textContent = `${item.name} - ${formatCurrency(item.price)}`;
    menuItemSelect.appendChild(option.cloneNode(true));
    updateMenuItemSelect.appendChild(option);
  });
}

function renderOrder(order) {
  currentOrder = order;
  orderPanel.classList.remove('hidden');

  viewId.textContent = String(order.id);
  viewCustomer.textContent = order.customerName;
  viewStatus.textContent = order.status;
  viewTotal.textContent = formatCurrency(order.total);
  viewItems.textContent = order.items.map((item) => `${item.name} x${item.quantity}`).join(', ');

  updateNotesInput.value = order.notes || '';
}

async function loadMenu() {
  try {
    cachedMenu = await requestJson('/menu');
    renderMenu(cachedMenu);
  } catch (error) {
    setStatus(error.message, true);
  }
}

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    customerName: customerNameInput.value.trim(),
    items: [
      {
        menuItemId: Number(menuItemSelect.value),
        quantity: Number(quantityInput.value)
      }
    ],
    notes: notesInput.value.trim()
  };

  try {
    const order = await requestJson('/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setStatus(`Order #${order.id} placed successfully.`);
    orderForm.reset();
    quantityInput.value = '1';
    renderOrder(order);
  } catch (error) {
    setStatus(error.message, true);
  }
});

trackForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const orderId = Number(trackOrderIdInput.value);

  try {
    const order = await requestJson(`/order/${orderId}`);
    renderOrder(order);
    setStatus(`Order #${order.id} fetched successfully.`);
  } catch (error) {
    setStatus(error.message, true);
  }
});

updateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentOrder) {
    setStatus('Track an order before updating.', true);
    return;
  }

  const payload = {
    items: [
      {
        menuItemId: Number(updateMenuItemSelect.value),
        quantity: Number(updateQuantityInput.value)
      }
    ],
    notes: updateNotesInput.value.trim()
  };

  if (updateStatusInput.value) {
    payload.status = updateStatusInput.value;
  }

  try {
    const order = await requestJson(`/order/${currentOrder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    renderOrder(order);
    setStatus(`Order #${order.id} updated successfully.`);
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelOrderBtn.addEventListener('click', async () => {
  if (!currentOrder) {
    setStatus('Track an order before cancelling.', true);
    return;
  }

  const confirmCancel = window.confirm(`Cancel order #${currentOrder.id}?`);
  if (!confirmCancel) {
    return;
  }

  try {
    const response = await requestJson(`/order/${currentOrder.id}`, { method: 'DELETE' });
    renderOrder(response.order);
    setStatus(`Order #${currentOrder.id} cancelled.`);
  } catch (error) {
    setStatus(error.message, true);
  }
});

loadMenu();
