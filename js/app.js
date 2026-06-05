// ===== DATA LAYER =====
const STORE = {
  get products() {
    return JSON.parse(localStorage.getItem('fs_products')) || seedProducts();
  },
  set products(v) { localStorage.setItem('fs_products', JSON.stringify(v)); },
  get cart() {
    return JSON.parse(localStorage.getItem('fs_cart')) || [];
  },
  set cart(v) { localStorage.setItem('fs_cart', JSON.stringify(v)); },
  get orders() {
    return JSON.parse(localStorage.getItem('fs_orders')) || [];
  },
  set orders(v) { localStorage.setItem('fs_orders', JSON.stringify(v)); },
};

function seedProducts() {
  const data = [
    { id: 1, name: 'Zapatillas Running Pro', category: 'zapatos', price: 89.99, oldPrice: 129.99, description: 'Máxima amortiguación para tus carreras diarias.', image: '👟', stock: 25 },
    { id: 2, name: 'Balón Fútbol Match', category: 'futbol', price: 34.99, description: 'Balón oficial tamaño 5, cosido a máquina.', image: '⚽', stock: 40 },
    { id: 3, name: 'Camiseta Deportiva Dry-Fit', category: 'ropa', price: 24.99, oldPrice: 39.99, description: 'Tejido transpirable que absorbe el sudor.', image: '👕', stock: 60 },
    { id: 4, name: 'Pesas Rusas 16kg', category: 'pesas', price: 49.99, description: 'Hierro fundido, agarre ergonómico.', image: '🏋️', stock: 15 },
    { id: 5, name: 'Short Running Elite', category: 'ropa', price: 29.99, description: 'Short ligero con bolsillo para celular.', image: '🩳', stock: 35 },
    { id: 6, name: 'Guantes de Portero', category: 'futbol', price: 39.99, description: 'Protección total con agarre profesional.', image: '🧤', stock: 20 },
    { id: 7, name: 'Cuerda para Saltar', category: 'accesorios', price: 14.99, description: 'Ajustable, con rodamientos de bolas.', image: '🪢', stock: 50 },
    { id: 8, name: 'Zapatillas Basket Pro', category: 'zapatos', price: 119.99, description: 'Soporte de tobillo, suela antideslizante.', image: '👟', stock: 18 },
    { id: 9, name: 'Bicicleta Estática Plegable', category: 'pesas', price: 249.99, oldPrice: 329.99, description: 'Resistencia magnética silenciosa.', image: '🚴', stock: 8 },
    { id: 10, name: 'Juego de Mancuernas 20kg', category: 'pesas', price: 79.99, description: 'Par de mancuernas de neopreno.', image: '🏋️', stock: 12 },
    { id: 11, name: 'Gorra Deportiva', category: 'accesorios', price: 19.99, description: 'Algodón, ajustable, transpirable.', image: '🧢', stock: 45 },
    { id: 12, name: 'Medias de Compresión', category: 'ropa', price: 16.99, description: 'Compresión graduada para recuperación.', image: '🧦', stock: 30 },
  ];
  localStorage.setItem('fs_products', JSON.stringify(data));
  return data;
}

// ===== HELPERS =====
function formatPrice(n) { return '$' + n.toFixed(2); }

// ===== NAVBAR =====
function updateCartCount() {
  const count = STORE.cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ===== HAMBURGER =====
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
  updateCartCount();
});
