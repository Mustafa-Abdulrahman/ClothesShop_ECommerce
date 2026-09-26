document.addEventListener('DOMContentLoaded', () => {
  initializeAppData();
  setupMobileMenu();
  renderHomePageContent();
  showToast();
});

function setupMobileMenu() {
  const toggleButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function getCategories() {
  return getData('categories', []);
}

function getProducts() {
  return getData('products', []);
}

function getCategoryName(categoryId) {
  const categories = getCategories();
  const category = categories.find((item) => Number(item.id) === Number(categoryId));
  return category ? category.name : 'Uncategorized';
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0));
}

function getProductStatus(product) {
  if (Number(product.quantity) === 0 || product.status === 'out of stock') {
    return 'Out of Stock';
  }

  if (product.status === 'inactive') {
    return 'Inactive';
  }

  return 'In Stock';
}

function getVisibleProducts() {
  const products = getProducts();
  return products.filter((product) => product.status !== 'inactive');
}

function renderHomePageContent() {
  const featuredContainer = document.getElementById('featured-products');
  const latestContainer = document.getElementById('latest-products');
  const categoryContainer = document.getElementById('home-categories');

  if (featuredContainer) {
    const featuredProducts = getVisibleProducts().slice(0, 4);
    featuredContainer.innerHTML = '';
    featuredProducts.forEach((product) => {
      featuredContainer.appendChild(renderProductCard(product));
    });
  }

  if (latestContainer) {
    const latestProducts = [...getVisibleProducts()].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 4);
    latestContainer.innerHTML = '';
    latestProducts.forEach((product) => {
      latestContainer.appendChild(renderProductCard(product));
    });
  }

  if (categoryContainer) {
    const categories = getCategories();
    categoryContainer.innerHTML = '';
    categories.slice(0, 6).forEach((category) => {
      categoryContainer.appendChild(renderCategoryCard(category));
    });
  }
}

function renderProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const statusText = getProductStatus(product);
  const statusClass = statusText === 'Out of Stock' ? 'status-out' : 'status-in';

  card.innerHTML = `
    <div class="product-image-wrap">
      <img src="${product.image}" alt="${product.name}" />
      <span class="product-status ${statusClass}">${statusText}</span>
    </div>
    <div class="product-info">
      <p class="product-category">${getCategoryName(product.categoryId)}</p>
      <h3>${product.name}</h3>
      <div class="product-meta">
        <strong>${formatPrice(product.price)}</strong>
      </div>
      <a class="btn btn-secondary card-btn" href="product-details.html?id=${product.id}">View Details</a>
    </div>
  `;

  return card;
}

function renderCategoryCard(category) {
  const link = document.createElement('a');
  link.className = 'category-card';
  link.href = `products.html?category=${encodeURIComponent(category.id)}`;

  link.innerHTML = `
    <img src="${category.image}" alt="${category.name}" />
    <div class="category-overlay">
      <span>${category.name}</span>
    </div>
  `;

  return link;
}

function showToast(message = '', type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  if (!message) {
    toast.classList.remove('show', 'error');
    return;
  }

  toast.textContent = message;
  toast.className = `toast show ${type === 'error' ? 'error' : 'success'}`;

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function parseArrayInput(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAdminUser() {
  return getData('admin', { username: 'admin', password: '123456' });
}

function requireAdmin() {
  return true;
}

function logoutAdmin() {
  window.location.href = 'login.html';
}
