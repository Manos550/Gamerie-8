import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types';
import { useAuthStore } from '../../lib/store';
import { likePost, unlikePost } from '../../lib/posts';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(() => user ? post.likes.includes(user.id) : false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await unlikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="bg-gaming-card rounded-lg p-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/profile/${post.authorId}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={post.authorImage || 'https://via.placeholder.com/40'}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-white">{post.authorName}</h3>
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </div>
        </Link>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-200 mb-4">{post.content}</p>

      {post.media && post.media.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {post.media.map((url, index) => (
            <img
              key={index}
              src={url}
              alt=""
              className="rounded-lg w-full h-64 object-cover"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gaming-neon/20 pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 ${
            isLiked ? 'text-gaming-accent' : 'text-gray-400 hover:text-gaming-accent'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-400 hover:text-gaming-neon"
        >
          <MessageSquare className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-gaming-neon">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post.id} comments={post.comments} />
      )}
    </div>
  );
}