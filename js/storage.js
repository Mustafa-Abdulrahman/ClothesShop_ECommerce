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

function initializeAppData() {
  const products = getData('products');
  const categories = getData('categories');

  if (!products || products.length === 0) {
    saveData('products', sampleProducts);
  }

  if (!categories || categories.length === 0) {
    saveData('categories', sampleCategories);
  }

  const adminUser = getData('admin', null);
  if (!adminUser) {
    saveData('admin', {
      username: 'admin',
      password: '123456',
    });
  }
}
