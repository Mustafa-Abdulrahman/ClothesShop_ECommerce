function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getData(key, fallback = []) {
  const value = localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Failed to parse localStorage key: ${key}`, error);
    return fallback;
  }
}

function removeData(key) {
  localStorage.removeItem(key);
}

function normalizeCategoryName(name) {
  const cleanedName = String(name || '').trim();
  if (!cleanedName) return cleanedName;

  const aliasMap = {
    Juckets: 'Jackets',
    'Denim Jacket': 'Jackets',
  };

  return aliasMap[cleanedName] || cleanedName;
}

function getCategoryImage(name) {
  const imageMap = {
    'T-Shirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    Shirts: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    Jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    Jackets: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    Dresses: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    Accessories: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  };

  return imageMap[normalizeCategoryName(name)] || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80';
}

function getProductImageByName(name) {
  const imageMap = {
    'Oversized Black T-Shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    'Classic White Shirt': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    'Straight Fit Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    'Denim Jacket': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    'Sunset Summer Dress': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    'Leather Tote Bag': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  };

  return imageMap[String(name || '')] || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80';
}

function normalizeCategory(category) {
  const safeCategory = { ...category };
  const normalizedName = normalizeCategoryName(safeCategory.name);

  safeCategory.name = normalizedName;

  if (!safeCategory.image || safeCategory.image.includes('/images/') || safeCategory.image.includes('placehold')) {
    safeCategory.image = getCategoryImage(normalizedName);
  }

  return safeCategory;
}

function normalizeProduct(product) {
  const safeProduct = { ...product };
  const productName = String(safeProduct.name || '').trim();
  const fallbackImage = getProductImageByName(productName) || getProductImageByName(safeProduct.name);

  if (!safeProduct.image || safeProduct.image.includes('/images/') || safeProduct.image.includes('placehold')) {
    safeProduct.image = fallbackImage;
  }

  if (typeof safeProduct.image === 'string' && !safeProduct.image.startsWith('http')) {
    safeProduct.image = fallbackImage;
  }

  const images = Array.isArray(safeProduct.images) ? safeProduct.images : [];
  const normalizedImages = images
    .map((image) => {
      if (typeof image !== 'string' || !image.startsWith('http')) {
        return safeProduct.image;
      }

      return image;
    })
    .filter(Boolean);

  safeProduct.images = normalizedImages.length ? normalizedImages : [safeProduct.image];

  return safeProduct;
}

function initializeAppData() {
  const rawProducts = getData('products', sampleProducts);
  const rawCategories = getData('categories', sampleCategories);

  const normalizedCategories = Array.isArray(rawCategories) && rawCategories.length
    ? rawCategories.map(normalizeCategory)
    : sampleCategories.map(normalizeCategory);

  const normalizedProducts = Array.isArray(rawProducts) && rawProducts.length
    ? rawProducts.map(normalizeProduct)
    : sampleProducts.map(normalizeProduct);

  const categoriesNeedSave = JSON.stringify(rawCategories) !== JSON.stringify(normalizedCategories);
  const productsNeedSave = JSON.stringify(rawProducts) !== JSON.stringify(normalizedProducts);

  if (categoriesNeedSave) {
    saveData('categories', normalizedCategories);
  }

  if (productsNeedSave) {
    saveData('products', normalizedProducts);
  }

  const adminUser = getData('admin', null);
  if (!adminUser) {
    saveData('admin', {
      username: 'admin',
      password: '123456',
    });
  }

  if (!localStorage.getItem('app_initialized')) {
    localStorage.setItem('app_initialized', 'true');
  }
}
