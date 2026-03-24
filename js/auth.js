// js/auth.js
export function initAuth() {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');

  loginBtn?.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      showDashboard();
    } catch (err) {
      alert(`Gagal login: ${err.message}`);
    }
  });

  registerBtn?.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      showDashboard();
    } catch (err) {
      alert(`Gagal register: ${err.message}`);
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    await firebase.auth().signOut();
    showAuth();
  });
}

function showDashboard() {
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
}

function showAuth() {
  document.getElementById('auth-container').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}