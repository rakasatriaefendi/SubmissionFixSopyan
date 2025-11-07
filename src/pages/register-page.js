import { register } from '../utils/api.js';
import '../components/loading-indicator.js'; 

export default class RegisterPage {
  async render() {
    return `
      <section class="page-content container" tabindex="-1">
        <h1>Daftar Akun Baru</h1>
        <form id="registerForm" class="card" aria-label="Formulir registrasi">
          
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div class="form-group">
            <label for="password">Password (min. 8 karakter)</label>
            <input type="password" id="password" name="password" required minlength="8" />
          </div>

          <button type="submit" id="submitBtn">Daftar</button>
        </form>

        <p id="registerMessage" class="error-message" aria-live="polite"></p>
        <p class="text-center">Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.getElementById('registerForm');
    const messageEl = document.getElementById('registerMessage');
    const submitButton = document.getElementById('submitBtn');

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitButton.disabled = true;
      submitButton.textContent = 'Mendaftarkan...';
      messageEl.textContent = '';
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const loading = document.createElement('loading-indicator');
      registerForm.appendChild(loading);
      try {
        const response = await register(name, email, password);
        if (!response.error) {
          alert('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
          window.location.hash = '/login';
        } else {
          messageEl.textContent = `Registrasi gagal: ${response.message}`;
        }
      } catch (error) {
        messageEl.textContent = `Terjadi error: ${error.message}`;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Daftar';
        if (loading.parentNode) {
          loading.parentNode.removeChild(loading);
        }
      }
    });
  }
}