import { webpush } from '../config/webpush.js';
import PushSubscription from '../models/pushSubscriptionModel.js';

// Subscribe to push notifications
export const subscribe = async (req, res) => {
  try {
    const { subscription, userId, role } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ message: 'Invalid subscription object' });
    }

    // Check if subscription already exists
    const existingSubscription = await PushSubscription.findOne({
      'subscription.endpoint': subscription.endpoint,
    });

    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.userId = userId;
      existingSubscription.role = role || 'user';
      existingSubscription.lastUsed = new Date();
      await existingSubscription.save();
      
      return res.status(200).json({ 
        message: 'Subscription updated successfully',
        subscriptionId: existingSubscription._id 
      });
    }

    // Create new subscription
    const newSubscription = new PushSubscription({
      userId: userId || 'anonymous',
      role: role || 'user',
      subscription: {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
    });

    await newSubscription.save();

    res.status(201).json({ 
      message: 'Subscribed to push notifications successfully',
      subscriptionId: newSubscription._id 
    });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ message: 'Failed to subscribe', error: error.message });
  }
};

// Unsubscribe from push notifications
export const unsubscribe = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Invalid subscription object' });
    }

    await PushSubscription.deleteOne({
      'subscription.endpoint': subscription.endpoint,
    });

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Failed to unsubscribe', error: error.message });
  }
};

// Send push notification to all admin subscriptions
export const sendToAdmins = async (payload) => {
  try {
    // Get all admin subscriptions
    const adminSubscriptions = await PushSubscription.find({ role: 'admin' });

    if (adminSubscriptions.length === 0) {
      console.log('No admin subscriptions found');
      return { success: true, sent: 0 };
    }

    const pushPayload = JSON.stringify(payload);

    // Send to all admin subscriptions
    const results = await Promise.allSettled(
      adminSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, pushPayload);
          
          // Update last used
          sub.lastUsed = new Date();
          await sub.save();
          
          return { success: true };
        } catch (error) {
          // If subscription is invalid (410 Gone), remove it
          if (error.statusCode === 410) {
            console.log('Removing invalid subscription:', sub._id);
            await PushSubscription.deleteOne({ _id: sub._id });
          }
          throw error;
        }
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    console.log(`Push notifications sent: ${successCount} succeeded, ${failureCount} failed`);

    return { 
      success: true, 
      sent: successCount, 
      failed: failureCount 
    };
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to specific user
export const sendToUser = async (userId, payload) => {
  try {
    const userSubscriptions = await PushSubscription.find({ userId });

    if (userSubscriptions.length === 0) {
      console.log(`No subscriptions found for user: ${userId}`);
      return { success: true, sent: 0 };
    }

    const pushPayload = JSON.stringify(payload);

    const results = await Promise.allSettled(
      userSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, pushPayload);
          sub.lastUsed = new Date();
          await sub.save();
          return { success: true };
        } catch (error) {
          if (error.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: sub._id });
          }
          throw error;
        }
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;

    return { success: true, sent: successCount };
  } catch (error) {
    console.error('Error sending push notification to user:', error);
    return { success: false, error: error.message };
  }
};

// Test notification (for testing purposes)
export const testNotification = async (req, res) => {
  try {
    const result = await sendToAdmins({
      title: '🔔 Test Notification',
      body: 'This is a test push notification from Livique Admin',
      icon: '/logo.png',
      url: '/admin',
    });

    res.status(200).json({ 
      message: 'Test notification sent', 
      result 
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ message: 'Failed to send test notification', error: error.message });
  }
};
