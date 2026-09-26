document.addEventListener('DOMContentLoaded', () => {
  initializeAppData();

  setupAdminDashboard();
  renderDashboardStats();
  renderProductsTable();
  renderCategoryList();
  disableAdminMutations();
  setupLogoutButton();
});

function disableAdminMutations() {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach((input) => {
      input.disabled = true;
    });
  });

  const logoutButton = document.getElementById('logout-btn');
  if (logoutButton) {
    logoutButton.disabled = false;
    logoutButton.title = 'Read-only display mode';
  }
}

function setupAdminDashboard() {
  const productCategorySelect = document.getElementById('product-category');
  if (productCategorySelect) {
    populateCategorySelect(productCategorySelect);
  }
}

function populateCategorySelect(selectElement) {
  const categories = getCategories();
  selectElement.innerHTML = '<option value="">Select Category</option>';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
  });
}

function renderDashboardStats() {
  const products = getProducts();
  const categories = getCategories();

  document.getElementById('stat-total-products').textContent = products.length;
  document.getElementById('stat-total-categories').textContent = categories.length;
  document.getElementById('stat-active-products').textContent = products.filter((product) => product.status === 'active').length;
  document.getElementById('stat-out-of-stock').textContent = products.filter((product) => Number(product.quantity) === 0 || product.status === 'out of stock').length;
}

function renderProductsTable() {
  const container = document.getElementById('admin-product-list');
  if (!container) return;

  const products = getProducts();

  if (!products.length) {
    container.innerHTML = '<p class="empty-state">No products available.</p>';
    return;
  }

  const rows = products
    .map((product) => {
      const status = Number(product.quantity) === 0 || product.status === 'out of stock' ? 'Out of Stock' : product.status;
      return `
        <tr>
          <td class="product-thumb-cell"><img src="${product.image}" alt="${product.name}" class="product-thumb" /></td>
          <td><strong>${product.name}</strong></td>
          <td>${getCategoryName(product.categoryId)}</td>
          <td>${formatPrice(product.price)}</td>
          <td>${status}</td>
          <td class="action-cell">
            <span class="muted-text">Read-only</span>
          </td>
        </tr>
      `;
    })
    .join('');

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderCategoryList() {
  const container = document.getElementById('admin-category-list');
  if (!container) return;

  const categories = getCategories();

  if (!categories.length) {
    container.innerHTML = '<p class="empty-state">No categories available.</p>';
    return;
  }

  container.innerHTML = categories
    .map(
      (category) => `
        <div class="category-item">
          <div class="category-thumb">
            <img src="${category.image}" alt="${category.name}" />
          </div>
          <div class="category-meta">
            <strong>${category.name}</strong>
          </div>
          <div class="category-actions">
            <span class="muted-text">Read-only</span>
          </div>
        </div>
      `
    )
    .join('');
}

function setupProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = Number(document.getElementById('product-price').value);
    const sku = document.getElementById('product-sku').value.trim();
    const categoryId = Number(document.getElementById('product-category').value);
    const quantity = Number(document.getElementById('product-quantity').value);
    const image = document.getElementById('product-image').value.trim();
    const sizes = parseArrayInput(document.getElementById('product-sizes').value);
    const colors = parseArrayInput(document.getElementById('product-colors').value);
    const images = parseArrayInput(document.getElementById('product-images').value);
    const status = document.getElementById('product-status').value;

    if (!name || !description || !image || !sku || !categoryId || Number.isNaN(price) || Number.isNaN(quantity) || price < 0 || quantity < 0) {
      showToast('Please fill in all required fields with valid values.', 'error');
      return;
    }

    const products = getProducts();
    const existingProduct = products.find((product) => product.sku.toLowerCase() === sku.toLowerCase() && Number(product.id) !== Number(productId));

    if (existingProduct) {
      showToast('SKU must be unique.', 'error');
      return;
    }

    if (productId) {
      const updatedProducts = products.map((product) => {
        if (Number(product.id) !== Number(productId)) return product;

        return {
          ...product,
          name,
          description,
          price,
          sku,
          categoryId,
          quantity,
          image,
          images: images.length ? images : [image],
          sizes: sizes.length ? sizes : ['S', 'M', 'L'],
          colors: colors.length ? colors : ['Black'],
          status: quantity === 0 ? 'out of stock' : status,
        };
      });

      saveData('products', updatedProducts);
      showToast('Product updated successfully.');
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        description,
        price,
        sku,
        categoryId,
        quantity,
        image,
        images: images.length ? images : [image],
        sizes: sizes.length ? sizes : ['S', 'M', 'L'],
        colors: colors.length ? colors : ['Black'],
        status: quantity === 0 ? 'out of stock' : status,
      };

      saveData('products', [...products, newProduct]);
      showToast('Product added successfully.');
    }

    resetProductForm();
    renderDashboardStats();
    renderProductsTable();
  });

  document.getElementById('cancel-product-edit').addEventListener('click', resetProductForm);
}

function populateProductForm(productId) {
  const product = getProducts().find((item) => Number(item.id) === Number(productId));
  if (!product) return;

  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-sku').value = product.sku;
  document.getElementById('product-category').value = product.categoryId;
  document.getElementById('product-quantity').value = product.quantity;
  document.getElementById('product-status').value = product.quantity === 0 ? 'out of stock' : product.status;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-sizes').value = (product.sizes || []).join(', ');
  document.getElementById('product-colors').value = (product.colors || []).join(', ');
  document.getElementById('product-images').value = (product.images || []).join(', ');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetProductForm() {
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  const categorySelect = document.getElementById('product-category');
  if (categorySelect) {
    categorySelect.value = '';
  }
}

function deleteProduct(productId) {
  const confirmed = window.confirm('Are you sure you want to delete this product?');
  if (!confirmed) return;

  const products = getProducts().filter((product) => Number(product.id) !== Number(productId));
  saveData('products', products);
  showToast('Product deleted successfully.');
  renderDashboardStats();
  renderProductsTable();
}

function setupCategoryForm() {
  const form = document.getElementById('category-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value.trim();
    const image = document.getElementById('category-image').value.trim();

    if (!name || !image) {
      showToast('Please fill in all category fields.', 'error');
      return;
    }

    const categories = getCategories();
    const duplicateCategory = categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase() && Number(category.id) !== Number(categoryId)
    );

    if (duplicateCategory) {
      showToast('Category names must be unique.', 'error');
      return;
    }

    if (categoryId) {
      const updatedCategories = categories.map((category) => {
        if (Number(category.id) !== Number(categoryId)) return category;
        return { ...category, name, image };
      });
      saveData('categories', updatedCategories);
      showToast('Category updated successfully.');
    } else {
      const newCategory = {
        id: Date.now(),
        name,
        image,
      };
      saveData('categories', [...categories, newCategory]);
      showToast('Category added successfully.');
    }

    resetCategoryForm();
    populateCategorySelect(document.getElementById('product-category'));
    renderCategoryList();
    renderDashboardStats();
  });

  document.getElementById('cancel-category-edit').addEventListener('click', resetCategoryForm);
}

function populateCategoryForm(categoryId) {
  const category = getCategories().find((item) => Number(item.id) === Number(categoryId));
  if (!category) return;

  document.getElementById('category-id').value = category.id;
  document.getElementById('category-name').value = category.name;
  document.getElementById('category-image').value = category.image;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetCategoryForm() {
  document.getElementById('category-form').reset();
  document.getElementById('category-id').value = '';
}

function deleteCategory(categoryId) {
  const categories = getCategories();
  const category = categories.find((item) => Number(item.id) === Number(categoryId));

  if (!category) return;

  const products = getProducts();
  const categoryHasProducts = products.some((product) => Number(product.categoryId) === Number(categoryId));

  if (categoryHasProducts) {
    showToast('This category contains products and cannot be deleted.', 'error');
    return;
  }

  const confirmed = window.confirm('Are you sure you want to delete this category?');
  if (!confirmed) return;

  saveData('categories', categories.filter((item) => Number(item.id) !== Number(categoryId)));
  showToast('Category deleted successfully.');
  populateCategorySelect(document.getElementById('product-category'));
  renderCategoryList();
  renderDashboardStats();
}

function setupLogoutButton() {
  const button = document.getElementById('logout-btn');
  if (!button) return;

  button.addEventListener('click', logoutAdmin);
}
