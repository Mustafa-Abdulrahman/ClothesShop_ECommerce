function getData(key, fallback = []) {
  if (key === 'categories') return [...sampleCategories];
  if (key === 'products') return [...sampleProducts];
  if (key === 'admin') return { username: 'admin', password: '123456' };
  return fallback;
}

function saveData() {
  return false;
}

function removeData() {
  return false;
}

function normalizeCategoryName(name) {
  const cleanedName = String(name || '').trim();
  if (!cleanedName) return cleanedName;
  return cleanedName === 'Juckets' ? 'Jackets' : cleanedName;
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

  return imageMap[normalizeCategoryName(name)] || imageMap.Jackets;
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

  return imageMap[String(name || '')] || imageMap['Denim Jacket'];
}

function initializeAppData() {
  return staticCatalog;
}
