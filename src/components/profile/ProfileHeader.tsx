import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { Camera, Edit2, MapPin, Globe, Clock, Users } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { uploadProfileImage } from '../../lib/profile';
import FollowButton from './FollowButton';
import EditProfileModal from './EditProfileModal';
import FollowersList from './FollowersList';
import OnlineStatus from '../shared/OnlineStatus';

interface ProfileHeaderProps {
  profile: User;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const isFollowing = user ? profile.followers.includes(user.id) : false;

  const handleFollowChange = () => {
    window.location.reload();
  };

  return (
    <div className="relative space-y-4">
      {/* Background Image */}
      <div className="h-96 w-full relative">
        <img
          src={profile.backgroundImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'}
          alt="Profile Background"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-card to-transparent" />

        {/* Edit Button */}
        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors flex items-center gap-1 text-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}

        {/* Profile Info - Moved to top left */}
        <div className="absolute top-6 left-6">
          <div className="flex items-start gap-6">
            {/* User Info with Integrated Profile Picture */}
            <div className="relative z-10 bg-gaming-dark/40 backdrop-blur-sm rounded-lg p-4 max-w-md">
              <div className="flex items-center gap-4">
                {/* Profile Picture */}
                <img
                  src={profile.profileImage || 'https://via.placeholder.com/150'}
                  alt={profile.username}
                  className="w-24 h-24 rounded-full border-2 border-gaming-card"
                />
                
                <div className="space-y-1">
                  {/* Username */}
                  <h1 className="text-2xl font-display font-bold text-white">
                    {profile.username}
                  </h1>

                  {/* Online Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Status:</span>
                    <OnlineStatus userId={profile.id} showText />
                  </div>

                  {/* Title */}
                  <div className="text-gaming-neon">{profile.gamerTitle}</div>

                  {/* Level */}
                  <div className="text-sm text-gray-300">
                    Gamer Level: <span className="text-blue-500">{profile.gameLevel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {/* Followers/Following */}
                <div className="flex gap-4 text-xs">
                  <button
                    onClick={() => setShowFollowers(true)}
                    className="flex items-center gap-1 hover:text-gaming-neon transition-colors"
                  >
                    <Users className="w-3 h-3" />
                    <span className="text-white font-bold">{profile.followers.length}</span>
                    <span className="text-gray-200">Followers</span>
                  </button>
                  <button
                    onClick={() => setShowFollowing(true)}
                    className="flex items-center gap-1 hover:text-gaming-neon transition-colors"
                  >
                    <Users className="w-3 h-3" />
                    <span className="text-white font-bold">{profile.following.length}</span>
                    <span className="text-gray-200">Following</span>
                  </button>
                </div>

                {/* Location Info */}
                <div className="flex items-center gap-3 text-xs">
                  {profile.location && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <MapPin className="w-3 h-3 text-gaming-neon" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Globe className="w-3 h-3 text-gaming-neon" />
                      <span>{profile.country}</span>
                    </div>
                  )}
                  {profile.timezone && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock className="w-3 h-3 text-gaming-neon" />
                      <span>{profile.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <FollowButton
                targetUserId={profile.id}
                isFollowing={isFollowing}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
        />
      )}

      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <FollowersList
              userId={profile.id}
              type="followers"
              userIds={profile.followers}
            />
            <button
              onClick={() => setShowFollowers(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <FollowersList
              userId={profile.id}
              type="following"
              userIds={profile.following}
            />
            <button
              onClick={() => setShowFollowing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}