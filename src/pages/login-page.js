import { login } from '../utils/api.js';

export default class LoginPage {
  async render() {
    return `
      <section class="page-content container" tabindex="-1">
        <h1>Login</h1>
        <form id="loginForm" class="card" aria-label="Formulir login">
          <label for="email">Email</label>
          <input id="email" type="email" required>
          
          <label for="password">Password</label>
          <input id="password" type="password" required minlength="8">
          
          <div class="form-actions"><button type="submit">Login</button></div>
        </form>
        <p class="text-center">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const loading = document.createElement('loading-indicator');
      form.appendChild(loading);
      try {
        const res = await login(email, password);
        if (res && res.loginResult && res.loginResult.token) {
          localStorage.setItem('story_token', res.loginResult.token);
          alert('Login berhasil!');
          location.hash = '/';
        } else {
          alert('Login gagal: ' + (res.message || 'Error tidak diketahui'));
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi error saat login: ' + err.message);
      } finally {
        if (loading.parentNode) loading.parentNode.removeChild(loading);
      }
    });
  }
}