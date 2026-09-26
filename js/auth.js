document.addEventListener('DOMContentLoaded', () => {
  initializeAppData();
  setupLoginForm();
});

function setupLoginForm() {
  const form = document.getElementById('login-form');
  const messageBox = document.getElementById('login-message');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const admin = getAdminUser();

    if (!username || !password) {
      showMessage(messageBox, 'Please fill in all required fields.', true);
      return;
    }

    if (username === admin.username && password === admin.password) {
      window.location.href = 'admin.html';
      return;
    }

    showMessage(messageBox, 'Invalid username or password.', true);
  });
}

function showMessage(element, message, isError = false) {
  if (!element) return;

  element.textContent = message;
  element.classList.toggle('error', isError);
  element.classList.toggle('success', !isError);
}
