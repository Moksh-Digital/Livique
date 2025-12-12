// Service Worker for Push Notifications

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let data = {
    title: 'Livique Admin Alert',
    body: 'You have a new notification',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'admin-notification',
    requireInteraction: true,
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    requireInteraction: data.requireInteraction,
    data: data.url ? { url: data.url } : {},
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  // Open or focus the app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url || '/admin';
      
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
