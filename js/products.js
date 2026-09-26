document.addEventListener('DOMContentLoaded', () => {
  initializeAppData();
  setupMobileMenu();
  initializeProductPage();
});

function initializeProductPage() {
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const availabilityFilter = document.getElementById('availability-filter');
  const applyButton = document.getElementById('apply-filters');
  const clearButton = document.getElementById('clear-filters');
  const productCount = document.getElementById('product-count');

  if (!productsGrid) return;

  populateCategoryOptions();
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get('category');

  if (categoryId && categoryId !== 'all') {
    categoryFilter.value = categoryId;
  }

  renderProducts();

  applyButton.addEventListener('click', renderProducts);
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'all';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    availabilityFilter.value = 'all';
    renderProducts();
  });

  searchInput.addEventListener('input', renderProducts);
  categoryFilter.addEventListener('change', renderProducts);
  minPriceInput.addEventListener('input', renderProducts);
  maxPriceInput.addEventListener('input', renderProducts);
  availabilityFilter.addEventListener('change', renderProducts);

  function populateCategoryOptions() {
    const categories = getCategories();
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });
  }

  function getActiveFilters() {
    return {
      search: searchInput.value.trim().toLowerCase(),
      category: categoryFilter.value,
      minPrice: minPriceInput.value ? Number(minPriceInput.value) : 0,
      maxPrice: maxPriceInput.value ? Number(maxPriceInput.value) : Infinity,
      availability: availabilityFilter.value,
    };
  }

  function renderProducts() {
    const filters = getActiveFilters();
    let filteredProducts = getVisibleProducts();

    if (filters.search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(filters.search)
      );
    }

    if (filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(
        (product) => String(product.categoryId) === String(filters.category)
      );
    }

    filteredProducts = filteredProducts.filter(
      (product) => Number(product.price) >= filters.minPrice && Number(product.price) <= filters.maxPrice
    );

    if (filters.availability === 'in-stock') {
      filteredProducts = filteredProducts.filter((product) => Number(product.quantity) > 0);
    }

    if (filters.availability === 'out-of-stock') {
      filteredProducts = filteredProducts.filter((product) => Number(product.quantity) === 0);
    }

    productsGrid.innerHTML = '';

    if (!filteredProducts.length) {
      productsGrid.innerHTML = '<p class="empty-state">No products match your filters.</p>';
      productCount.textContent = '0 products';
      return;
    }

    filteredProducts.forEach((product) => {
      productsGrid.appendChild(renderProductCard(product));
    });

    productCount.textContent = `${filteredProducts.length} product${filteredProducts.length > 1 ? 's' : ''}`;
  }
}
