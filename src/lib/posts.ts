import { collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { useAuthStore } from './store';
import { toast } from 'react-toastify';
import { Post } from '../types';

// Demo mode helper
const isDemoMode = import.meta.env.MODE === 'development';

// In-memory store for demo mode
let demoPosts: Post[] = [];

const demoStorage = {
  uploadFile: async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  }
};

export const createPost = async (content: string, mediaFiles: File[] = []): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to create a post');

  try {
    let mediaUrls: string[] = [];

    if (isDemoMode) {
      mediaUrls = await Promise.all(
        mediaFiles.map(file => demoStorage.uploadFile(file))
      );

      const newPost: Post = {
        id: crypto.randomUUID(),
        authorId: user.id,
        authorName: user.username,
        authorImage: user.profileImage,
        content,
        media: mediaUrls,
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      demoPosts.unshift(newPost);
    } else {
      mediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const fileRef = ref(storage, `posts/${crypto.randomUUID()}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      await addDoc(collection(db, 'posts'), {
        authorId: user.id,
        authorName: user.username,
        authorImage: user.profileImage,
        content,
        media: mediaUrls,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    toast.success('Post created successfully');
  } catch (error) {
    toast.error('Failed to create post');
    throw error;
  }
};

export const likePost = async (postId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to like a post');

  try {
    if (isDemoMode) {
      const post = demoPosts.find(p => p.id === postId);
      if (post && !post.likes.includes(user.id)) {
        post.likes.push(user.id);
      }
    } else {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(user.id)
      });
    }
  } catch (error) {
    toast.error('Failed to like post');
    throw error;
  }
};

export const unlikePost = async (postId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to unlike a post');

  try {
    if (isDemoMode) {
      const post = demoPosts.find(p => p.id === postId);
      if (post) {
        post.likes = post.likes.filter(id => id !== user.id);
      }
    } else {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayRemove(user.id)
      });
    }
  } catch (error) {
    toast.error('Failed to unlike post');
    throw error;
  }
};

export const addComment = async (postId: string, content: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in to comment');

  try {
    const comment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.username,
      authorImage: user.profileImage,
      content,
      likes: [],
      createdAt: new Date()
    };

    if (isDemoMode) {
      const post = demoPosts.find(p => p.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    } else {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });
    }
  } catch (error) {
    toast.error('Failed to add comment');
    throw error;
  }
};

// Helper function to get demo posts
export const getDemoPosts = () => demoPosts;