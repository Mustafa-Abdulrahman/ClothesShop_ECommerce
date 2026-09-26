document.addEventListener('DOMContentLoaded', () => {
  initializeAppData();
  setupMobileMenu();
  renderProductDetails();
});

function renderProductDetails() {
  const container = document.getElementById('product-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));

  if (!productId) {
    container.innerHTML = '<div class="empty-state">Invalid product ID.</div>';
    return;
  }

  const product = getProducts().find((item) => Number(item.id) === productId);

  if (!product) {
    container.innerHTML = '<div class="empty-state">The requested product could not be found.</div>';
    return;
  }

  const categoryName = getCategoryName(product.categoryId);
  const productImages = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
  const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes.join(' ') : 'N/A';
  const colors = Array.isArray(product.colors) && product.colors.length ? product.colors.join(', ') : 'N/A';

  const statusText = getProductStatus(product);
  const availabilityClass = statusText === 'Out of Stock' ? 'status-out' : 'status-in';

  container.innerHTML = `
    <div class="detail-layout">
      <div class="detail-gallery">
        <img src="${product.image}" alt="${product.name}" class="detail-main-image" />
        <div class="thumb-row">
          ${productImages
            .map(
              (image) => `
                <img src="${image}" alt="${product.name} thumbnail" class="detail-thumb" />
              `
            )
            .join('')}
        </div>
      </div>
      <div class="detail-content">
        <p class="eyebrow">${categoryName}</p>
        <h1>${product.name}</h1>
        <div class="detail-price-row">
          <span class="detail-price">${formatPrice(product.price)}</span>
          <span class="product-status ${availabilityClass}">${statusText}</span>
        </div>
        <p class="detail-description">${product.description}</p>

        <div class="detail-meta-grid">
          <div>
            <span class="meta-label">SKU</span>
            <strong>${product.sku}</strong>
          </div>
          <div>
            <span class="meta-label">Availability</span>
            <strong>${statusText}</strong>
          </div>
          <div>
            <span class="meta-label">Quantity</span>
            <strong>${product.quantity}</strong>
          </div>
          <div>
            <span class="meta-label">Category</span>
            <strong>${categoryName}</strong>
          </div>
        </div>

        <div class="detail-specs">
          <div>
            <span class="meta-label">Available Sizes</span>
            <p>${sizes}</p>
          </div>
          <div>
            <span class="meta-label">Colors</span>
            <p>${colors}</p>
          </div>
        </div>

        <div class="detail-actions">
          <a href="products.html" class="btn btn-secondary">Continue Shopping</a>
        </div>
      </div>
    </div>
  `;
}
