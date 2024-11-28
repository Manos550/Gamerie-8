import React from 'react';
import { useAuthStore } from '../../lib/store';
import { followUser, unfollowUser } from '../../lib/follow';
import { UserPlus, UserMinus } from 'lucide-react';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  onFollowChange?: () => void;
}

export default function FollowButton({ targetUserId, isFollowing, onFollowChange }: FollowButtonProps) {
  const { user } = useAuthStore();
  const [isPending, setIsPending] = React.useState(false);

  const handleFollow = async () => {
    if (!user || user.id === targetUserId || isPending) return;

    setIsPending(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
      onFollowChange?.();
    } finally {
      setIsPending(false);
    }
  };

  if (!user || user.id === targetUserId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        isFollowing
          ? 'bg-gaming-dark border border-gaming-neon text-gaming-neon hover:bg-gaming-neon hover:text-black'
          : 'bg-gaming-neon text-black hover:bg-gaming-neon/90'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          {isPending ? 'Unfollowing...' : 'Following'}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          {isPending ? 'Following...' : 'Follow'}
        </>
      )}
    </button>
  );
}