function initCheckout() {
  const cart = STORE.cart;
  if (!cart.length) {
    document.querySelector('.checkout-layout').innerHTML = `
      <div class="cart-empty" style="grid-column:1/-1">
        <div class="icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos antes de comprar.</p>
        <a href="shop.html" class="btn btn-black">Ver productos</a>
      </div>
    `;
    return;
  }

  renderCheckoutSummary();
  setupCheckoutForm();
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutSummary');
  const cart = STORE.cart;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  container.innerHTML = `
    <h3>Tu pedido</h3>
    ${cart.map(item => `
      <div class="checkout-item">
        <span>${item.image && item.image.includes('/') ? `<span style="display:inline-block;width:32px;height:32px;background-image:url(${item.image});background-size:cover;background-position:center;border-radius:4px;vertical-align:middle;margin-right:6px;"></span>` : '📦'} ${item.name} <span style="color:var(--gray-400)">x${item.qty}</span></span>
        <span style="font-weight:600">${formatPrice(item.price * item.qty)}</span>
      </div>
    `).join('')}
    <div class="checkout-item" style="margin-top:16px">
      <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
    </div>
    <div class="checkout-item">
      <span>Envío</span><span>${shipping === 0 ? '<span style="color:#155724">GRATIS</span>' : formatPrice(shipping)}</span>
    </div>
    <div class="checkout-item" style="font-weight:700;font-size:18px;border-bottom:none;padding-bottom:0;">
      <span>Total</span><span>${formatPrice(total)}</span>
    </div>
  `;
}

function setupCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const paymentMethod = document.getElementById('paymentMethod')?.value || 'transfer';

    const order = {
      id: 'FS-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
      customer: {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value + ', ' + form.city.value + ', ' + form.state.value + ' ' + form.zip.value,
      },
      items: JSON.parse(JSON.stringify(STORE.cart)),
      subtotal: STORE.cart.reduce((s, i) => s + i.price * i.qty, 0),
      shipping: STORE.cart.reduce((s, i) => s + i.price * i.qty, 0) >= 99 ? 0 : 9.99,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'transfer' ? 'pendiente' : 'procesado',
      status: 'pendiente',
      date: new Date().toISOString(),
    };
    order.total = order.subtotal + order.shipping;

    const orders = STORE.orders;
    orders.unshift(order);
    STORE.orders = orders;

    const products = STORE.products;
    STORE.cart.forEach(cartItem => {
      const prod = products.find(p => p.id === cartItem.id);
      if (prod) prod.stock -= cartItem.qty;
    });
    STORE.products = products;

    STORE.cart = [];
    updateCartCount();

    const paymentMsg = paymentMethod === 'transfer'
      ? `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px;margin:16px 0;text-align:left;font-size:14px;">
           <strong>🏦 Instrucciones de pago:</strong><br>
           Banco: Bancolombia<br>
           Cuenta de ahorros: 123-456789-01<br>
           Titular: FullSports SAS<br>
           Nit: 901.XXX.XXX-X<br>
           Valor: <strong>${formatPrice(order.total)}</strong><br>
           <span style="color:#856404;">Tu pedido se procesará cuando recibamos el pago.</span>
         </div>`
      : '';

    form.innerHTML = `
      <div class="success-message">
        <div class="icon">🎉</div>
        <h2>¡Pedido confirmado!</h2>
        <p>Número de pedido: <strong>${order.id}</strong></p>
        ${paymentMsg}
        <p>Te enviaremos la confirmación a ${order.customer.email}</p>
        <a href="shop.html" class="btn btn-black">Seguir comprando</a>
        <a href="index.html" class="btn btn-outline" style="margin-left:12px;color:var(--black);border-color:var(--black);">Volver al inicio</a>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkoutForm') || document.getElementById('checkoutSummary')) initCheckout();
});
