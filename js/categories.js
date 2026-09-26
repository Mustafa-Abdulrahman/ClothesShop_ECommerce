document.addEventListener('DOMContentLoaded', () => {
  initializeAppData();
  setupMobileMenu();
  renderCategoriesPage();
});

function renderCategoriesPage() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  const categories = getCategories();

  if (!categories.length) {
    grid.innerHTML = '<p class="empty-state">No categories available.</p>';
    return;
  }

  grid.innerHTML = '';

  categories.forEach((category) => {
    const link = document.createElement('a');
    link.href = `products.html?category=${encodeURIComponent(category.id)}`;
    link.className = 'category-card';
    link.setAttribute('aria-label', `Browse ${category.name}`);

    link.innerHTML = `
      <img src="${category.image}" alt="${category.name}" />
      <div class="category-overlay">
        <span>${category.name}</span>
      </div>
    `;

    grid.appendChild(link);
  });
}
