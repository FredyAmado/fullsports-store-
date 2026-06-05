// ===== DASHBOARD =====
function initDashboard() {
  const products = STORE.products;
  const orders = STORE.orders;

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const lowStock = products.filter(p => p.stock < 10).length;

  document.getElementById('statProducts').textContent = totalProducts;
  document.getElementById('statOrders').textContent = totalOrders;
  document.getElementById('statRevenue').textContent = formatPrice(totalRevenue);
  document.getElementById('statLowStock').textContent = lowStock;

  const tbody = document.querySelector('#recentOrders tbody');
  if (tbody) {
    const recent = orders.slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer?.name || 'N/A'}</td>
        <td>${new Date(o.date).toLocaleDateString()}</td>
        <td>${formatPrice(o.total)}</td>
        <td><span class="badge badge-${o.status === 'entregado' ? 'delivered' : o.status === 'enviado' ? 'shipped' : 'pending'}">${o.status}</span></td>
        <td>
          <button class="btn-sm" onclick="showOrderDetail('${o.id}')">Ver</button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--gray-500)">No hay pedidos aún</td></tr>';
  }
}

// ===== PRODUCTS ADMIN =====
function initProductAdmin() {
  renderProductTable();

  const form = document.getElementById('productForm');
  if (!form) return;

  document.getElementById('saveProductBtn').addEventListener('click', () => {
    const id = document.getElementById('productId').value;
    const data = {
      name: form.productName.value,
      category: form.productCategory.value,
      price: parseFloat(form.productPrice.value),
      oldPrice: form.productOldPrice.value ? parseFloat(form.productOldPrice.value) : null,
      description: form.productDescription.value,
      image: form.productImage.value || '🏷️',
      stock: parseInt(form.productStock.value) || 0,
    };

    const products = STORE.products;
    if (id) {
      const idx = products.findIndex(p => p.id === parseInt(id));
      if (idx !== -1) { products[idx] = { ...products[idx], ...data }; }
    } else {
      data.id = Date.now();
      products.push(data);
    }
    STORE.products = products;
    closeModal();
    renderProductTable();
  });

  document.getElementById('addProductBtn')?.addEventListener('click', () => openProductModal());
}

function renderProductTable() {
  const tbody = document.querySelector('#productTable tbody');
  if (!tbody) return;
  const products = STORE.products;
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.image || '🏷️'}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.stock}</td>
      <td><span class="badge ${p.stock > 0 ? 'badge-active' : 'badge-inactive'}">${p.stock > 0 ? 'Activo' : 'Agotado'}</span></td>
      <td>
        <button class="btn-sm" onclick="editProduct(${p.id})">Editar</button>
        <button class="btn-sm danger" onclick="deleteProduct(${p.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function openProductModal(product) {
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('modalTitle').textContent = product ? 'Editar producto' : 'Nuevo producto';
  document.getElementById('productId').value = product ? product.id : '';
  document.getElementById('productName').value = product ? product.name : '';
  document.getElementById('productCategory').value = product ? product.category : 'ropa';
  document.getElementById('productPrice').value = product ? product.price : '';
  document.getElementById('productOldPrice').value = product ? (product.oldPrice || '') : '';
  document.getElementById('productDescription').value = product ? product.description : '';
  document.getElementById('productImage').value = product ? (product.image || '') : '';
  document.getElementById('productStock').value = product ? product.stock : 0;
}

function editProduct(id) {
  const product = STORE.products.find(p => p.id === id);
  if (product) openProductModal(product);
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  STORE.products = STORE.products.filter(p => p.id !== id);
  renderProductTable();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// ===== ORDERS ADMIN =====
function initOrdersAdmin() {
  const tbody = document.querySelector('#ordersTable tbody');
  if (!tbody) return;
  const orders = STORE.orders;
  tbody.innerHTML = orders.length ? orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer?.name || 'N/A'}<br><span style="font-size:12px;color:var(--gray-400)">${o.customer?.email || ''}</span></td>
      <td>${new Date(o.date).toLocaleDateString()}</td>
      <td>${o.items ? o.items.map(i => i.name + ' x' + i.qty).join(', ') : ''}</td>
      <td>${formatPrice(o.total || 0)}</td>
      <td>
        <select class="order-status" data-order="${o.id}" style="padding:6px;border:1px solid var(--gray-300);font-family:var(--font-body);">
          <option value="pendiente" ${o.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="enviado" ${o.status === 'enviado' ? 'selected' : ''}>Enviado</option>
          <option value="entregado" ${o.status === 'entregado' ? 'selected' : ''}>Entregado</option>
        </select>
      </td>
      <td>
        <button class="btn-sm" onclick="showOrderDetail('${o.id}')">Detalle</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray-500)">No hay pedidos registrados</td></tr>';

  document.querySelectorAll('.order-status').forEach(sel => {
    sel.addEventListener('change', () => {
      const orders = STORE.orders;
      const order = orders.find(o => o.id === sel.dataset.order);
      if (order) { order.status = sel.value; STORE.orders = orders; }
    });
  });
}

function showOrderDetail(orderId) {
  const order = STORE.orders.find(o => o.id === orderId);
  if (!order) return;
  alert(`Pedido: ${order.id}\nCliente: ${order.customer?.name}\nEmail: ${order.customer?.email}\nDirección: ${order.customer?.address}\nProductos: ${order.items.map(i => i.name + ' x' + i.qty).join(', ')}\nTotal: ${formatPrice(order.total)}\nEstado: ${order.status}\nFecha: ${new Date(order.date).toLocaleString()}`);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('statProducts')) initDashboard();
  if (document.getElementById('productTable')) initProductAdmin();
  if (document.getElementById('ordersTable')) initOrdersAdmin();
});
