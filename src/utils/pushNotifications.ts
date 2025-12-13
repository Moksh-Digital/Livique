// Push Notification Utilities

const VAPID_PUBLIC_KEY = import.meta.env.VAPID_PUBLIC_KEY;

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as Uint8Array<ArrayBuffer>;
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    if (!VAPID_PUBLIC_KEY) {
      console.error('VAPID public key not configured');
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('Push subscription created:', subscription);
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

// Send subscription to backend
export async function sendSubscriptionToBackend(
  subscription: PushSubscription,
  userId: string
): Promise<boolean> {
  try {
    // Get JWT token from localStorage if exists
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.API_URL}/api/push/subscribe`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        subscription,
        userId,
        role: 'admin', // Only for admin users
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to backend');
    }

    console.log('Subscription sent to backend successfully');
    return true;
  } catch (error) {
    console.error('Error sending subscription to backend:', error);
    return false;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(
  subscription: PushSubscription
): Promise<boolean> {
  try {
    await subscription.unsubscribe();
    
    // Get JWT token from localStorage if exists
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Optionally, remove from backend
    await fetch(`${import.meta.env.API_URL}/api/push/unsubscribe`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ subscription }),
    });

    console.log('Unsubscribed from push notifications');
    return true;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
}

// Initialize push notifications for admin
export async function initializePushNotifications(userId: string, isAdmin: boolean): Promise<void> {
  if (!isAdmin) {
    console.log('Push notifications only for admin users');
    return;
  }

  // Check if already granted
  if (Notification.permission === 'granted') {
    const registration = await registerServiceWorker();
    if (registration) {
      const subscription = await subscribeToPushNotifications(registration);
      if (subscription) {
        await sendSubscriptionToBackend(subscription, userId);
      }
    }
  }
}

// Request and setup push notifications
export async function setupPushNotifications(userId: string, isAdmin: boolean): Promise<boolean> {
  if (!isAdmin) {
    console.log('Push notifications only for admin users');
    return false;
  }

  // Request permission
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied');
    return false;
  }

  // Register service worker
  const registration = await registerServiceWorker();
  if (!registration) {
    return false;
  }

  // Subscribe to push
  const subscription = await subscribeToPushNotifications(registration);
  if (!subscription) {
    return false;
  }

  // Send to backend
  return await sendSubscriptionToBackend(subscription, userId);
}
