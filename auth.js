// ============================================================
// AUTH.JS - Authentication Logic
// ============================================================

function doLogin() {
  const userId = document.getElementById('loginUserId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const loginError = document.getElementById('loginError');
  const userIdError = document.getElementById('userIdError');
  const passwordError = document.getElementById('passwordError');

  // Reset errors
  loginError.style.display = 'none';
  userIdError.classList.remove('show');
  passwordError.classList.remove('show');

  let valid = true;
  if (!userId) { userIdError.classList.add('show'); valid = false; }
  if (!password) { passwordError.classList.add('show'); valid = false; }
  if (!valid) return;

  const cred = authenticate(userId, password);
  if (!cred) {
    loginError.textContent = 'Invalid User ID or Password. Please try again.';
    loginError.style.display = 'block';
    return;
  }

  // Store session
  sessionStorage.setItem('ap_user', JSON.stringify(cred));

  showLoadingPopup('Signing you in...');
  setTimeout(() => {
    hideLoadingPopup();
    if (cred.district_id === 'ADMIN') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  }, 800);
}

// ============================================================
// Session Guard (call on each protected page)
// ============================================================
function requireAuth() {
  const user = sessionStorage.getItem('ap_user');
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return JSON.parse(user);
}

function requireAdmin() {
  const user = requireAuth();
  if (user && user.district_id !== 'ADMIN') {
    window.location.href = 'dashboard.html';
    return null;
  }
  return user;
}

function logout() {
  sessionStorage.removeItem('ap_user');
  window.location.href = 'index.html';
}

// ============================================================
// Toast notifications
// ============================================================
function showToast(message, type = 'default', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', default: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration + 300);
}
