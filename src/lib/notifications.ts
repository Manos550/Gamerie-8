import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-toastify';

// Demo mode helper
const isDemoMode = import.meta.env.MODE === 'development';

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    if (isDemoMode) {
      return;
    }

    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      isRead: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('Failed to update notification');
  }
};