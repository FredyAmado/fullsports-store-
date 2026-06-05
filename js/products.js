function renderProducts(products, containerId = 'productsContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!products.length) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align:center;padding:60px 0;color:var(--gray-500)">No se encontraron productos.</p>';
    return;
  }
  container.innerHTML = products.map(p => {
    const inCart = STORE.cart.find(c => c.id === p.id);
    return `
      <div class="product-card">
        <div class="product-image">${p.image || '🏷️'}</div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-description">${p.description}</div>
          <div class="product-footer">
            <div class="product-price">
              ${formatPrice(p.price)}
              ${p.oldPrice ? `<span class="old">${formatPrice(p.oldPrice)}</span>` : ''}
            </div>
            <button class="btn-add" onclick="addToCart(${p.id})" ${p.stock < 1 ? 'disabled style="opacity:0.3;cursor:not-allowed"' : ''}>
              ${p.stock < 1 ? '✕' : '+'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(id) {
  const product = STORE.products.find(p => p.id === id);
  if (!product || product.stock < 1) return;
  const cart = STORE.cart;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, qty: 1 });
  }
  STORE.cart = cart;
  updateCartCount();
  const btn = event.target;
  btn.textContent = '✓';
  btn.style.background = '#000';
  btn.style.color = '#fff';
  setTimeout(() => { btn.textContent = '+'; btn.style.background = ''; btn.style.color = ''; }, 600);
}

// ===== SHOP PAGE =====
function initShop() {
  let currentCategory = 'todas';
  let searchTerm = '';

  function filterProducts() {
    let products = STORE.products;
    if (currentCategory !== 'todas') products = products.filter(p => p.category === currentCategory);
    if (searchTerm) products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    renderProducts(products);
    document.querySelector('.results').textContent = `${products.length} producto(s)`;
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      filterProducts();
    });
  });

  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value;
      filterProducts();
    });
  }

  filterProducts();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.shop-header')) initShop();
  if (document.getElementById('productsContainer') && !document.querySelector('.shop-header')) {
    renderProducts(STORE.products);
  }
});
