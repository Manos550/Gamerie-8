import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';
import { useAuthStore } from './store';
import { toast } from 'react-toastify';

// Demo mode helper
const isDemoMode = import.meta.env.MODE === 'development';

export const followGame = async (gameId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to follow games');

  try {
    if (isDemoMode) {
      toast.success('Successfully followed game');
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      followers: arrayUnion(user.id)
    });

    toast.success('Successfully followed game');
  } catch (error) {
    toast.error('Failed to follow game');
    throw error;
  }
};

export const unfollowGame = async (gameId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to unfollow games');

  try {
    if (isDemoMode) {
      toast.success('Successfully unfollowed game');
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      followers: arrayRemove(user.id)
    });

    toast.success('Successfully unfollowed game');
  } catch (error) {
    toast.error('Failed to unfollow game');
    throw error;
  }
};