import CONFIG from '../config.js';
import { request } from './api.js';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PushNotification = {
  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    this.subscribeUser(registration);
  },
  
  async subscribeUser(registration) {
    const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    try {
      // Cek apakah user sudah punya subscription
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        console.log('User baru disubscribe:', subscription);
      } else {
        console.log('User sudah disubscribe sebelumnya:', subscription);
      }

      // Kirim subscription ke backend
      await this.sendSubscriptionToServer(subscription);

    } catch (err) {
      console.error('Gagal subscribe user:', err);
    }
  },

  async sendSubscriptionToServer(subscription) {
    try {
      const subscriptionData = subscription.toJSON();
      await request(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
          endpoint: subscriptionData.endpoint,
          keys: subscriptionData.keys,
        }),
      });
      console.log('Berhasil kirim subscription ke server');
    } catch (error) {
      console.error('Gagal mengirim subscription ke server:', error);
    }
  },

  async unsubscribeUser() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log('Tidak ada subscription aktif.');
        return;
      }

      // Hapus subscription dari server
      await request(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });

      // Hapus juga dari browser
      await subscription.unsubscribe();
      console.log('Berhasil unsubscribe user.');
    } catch (error) {
      console.error('Gagal unsubscribe user:', error);
    }
  },

  async requestPermission() {
    const currentPermission = Notification.permission;

    if (currentPermission === 'granted') {
      console.log('Notification permission already granted.');
      this.init();
      return 'granted';
    }

    if (currentPermission === 'denied') {
      console.error('Notification permission was previously denied.');
      return 'denied'; 
    }

    if (currentPermission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        this.init();
        return 'granted';
      } else {
        console.error('Notification permission denied.');
        return 'denied';
      }
    }
    
    return 'default';
  }
};

export default PushNotification;
