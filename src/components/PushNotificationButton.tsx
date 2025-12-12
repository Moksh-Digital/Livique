import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { setupPushNotifications } from '@/utils/pushNotifications';

interface PushNotificationButtonProps {
  userId: string;
  isAdmin: boolean;
}

export const PushNotificationButton = ({ userId, isAdmin }: PushNotificationButtonProps) => {
  const [isEnabled, setIsEnabled] = useState(Notification.permission === 'granted');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      // Already enabled, show info
      toast({
        title: '🔔 Notifications Active',
        description: "You'll receive alerts for new orders and queries",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await setupPushNotifications(userId, isAdmin);
      
      if (success) {
        setIsEnabled(true);
        toast({
          title: '✅ Notifications Enabled!',
          description: "You'll now receive push notifications for new orders and queries",
        });
      } else {
        toast({
          title: '❌ Failed to enable notifications',
          description: 'Please check your browser permissions',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
      toast({
        title: '❌ Error',
        description: 'Failed to setup notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Button
      onClick={handleToggleNotifications}
      disabled={isLoading}
      variant={isEnabled ? 'default' : 'outline'}
      className="gap-2"
    >
      {isEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
      {isLoading ? 'Setting up...' : isEnabled ? 'Notifications Active' : 'Enable Notifications'}
    </Button>
  );
};
