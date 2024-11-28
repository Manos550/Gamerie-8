import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Post } from '../../types';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import PlayerInfo from './PlayerInfo';
import OnlineFriendsList from './OnlineFriendsList';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import { useAuthStore } from '../../lib/store';
import { useInView } from 'react-intersection-observer';
import { getDemoPosts } from '../../lib/posts';
import { demoUsers } from '../../lib/demo-data';

const POSTS_PER_PAGE = 10;
const isDemoMode = import.meta.env.MODE === 'development';

export default function NewsFeed() {
  const { user } = useAuthStore();
  const { ref, inView } = useInView();
  const [filter, setFilter] = useState<'all' | 'following'>('all');

  // Get online friends (in demo mode, randomly select some users as online)
  const onlineFriends = React.useMemo(() => {
    if (!user) return [];
    const following = demoUsers.filter(u => user.following.includes(u.id));
    return following.filter(() => Math.random() > 0.5);
  }, [user]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['feed', filter],
    queryFn: async ({ pageParam }) => {
      if (isDemoMode) {
        const posts = getDemoPosts();
        return {
          posts,
          lastVisible: null
        };
      }

      let baseQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      if (pageParam) {
        baseQuery = query(baseQuery, startAfter(pageParam));
      }

      const snapshot = await getDocs(baseQuery);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

      return { posts, lastVisible };
    },
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    enabled: !!user
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please sign in to view the news feed.</p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <PlayerInfo user={user} />
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <CreatePost />
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-white">News Feed</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-gaming-neon text-black'
                    : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setFilter('following')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'following'
                    ? 'bg-gaming-neon text-black'
                    : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
                }`}
              >
                Following
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          <div ref={ref} className="h-10 flex items-center justify-center">
            {isFetchingNextPage && <LoadingSpinner />}
          </div>
        </div>

        {/* Right Sidebar - Online Friends */}
        <div className="hidden lg:block space-y-6">
          <OnlineFriendsList users={onlineFriends} />
        </div>
      </div>
    </div>
  );
}