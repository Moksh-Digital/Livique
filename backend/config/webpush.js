import webpush from 'web-push';

// VAPID keys for push notifications
// Generate new keys by running: node -e "console.log(require('web-push').generateVAPIDKeys())"

export const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'YOUR_PUBLIC_KEY_HERE',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE'
};

// Configure web-push
webpush.setVapidDetails(
  'mailto:' + (process.env.ADMIN_EMAIL || 'admin@livique.co.in'),
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
export { webpush };
