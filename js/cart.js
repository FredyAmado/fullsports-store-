function renderCart() {
  const container = document.getElementById('cartContainer');
  const summary = document.getElementById('cartSummary');
  if (!container) return;

  const cart = STORE.cart;

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde nuestro catálogo.</p>
        <a href="shop.html" class="btn btn-black">Ver productos</a>
      </div>
    `;
    if (summary) summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">${item.image || '🏷️'}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-category">${item.category}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
        </div>
      </div>
    </div>
  `).join('');

  updateSummary();
}

function updateQty(id, delta) {
  const cart = STORE.cart;
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) {
    STORE.cart = cart.filter(c => c.id !== id);
  } else {
    STORE.cart = cart;
  }
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  STORE.cart = STORE.cart.filter(c => c.id !== id);
  renderCart();
  updateCartCount();
}

function updateSummary() {
  const summary = document.getElementById('cartSummary');
  if (!summary) return;
  const cart = STORE.cart;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  summary.innerHTML = `
    <h3>Resumen</h3>
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
    <div class="summary-row"><span>Envío</span><span>${shipping === 0 ? '<span style="color:#155724">GRATIS</span>' : formatPrice(shipping)}</span></div>
    ${subtotal < 99 ? '<div style="font-size:12px;color:var(--gray-500);margin-bottom:12px;">🛵 Gasta $99+ para envío gratis</div>' : ''}
    <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    <a href="checkout.html" class="btn btn-black">Proceder al pago</a>
    <a href="shop.html" style="display:block;text-align:center;margin-top:12px;font-size:14px;color:var(--gray-500);font-weight:500;">Seguir comprando</a>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartContainer')) renderCart();
});
