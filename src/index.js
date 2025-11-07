import './styles/styles.css';
import App from './app.js';

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js') 
        .then(registration => {
          console.log('Service Worker registered: ', registration);
        })
        .catch(registrationError => {
          console.log('Service Worker registration failed: ', registrationError);
        });
    });
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const content = document.querySelector('#main');
  const app = new App({ content });
  await app.init();
  
  registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.render();
  });
});