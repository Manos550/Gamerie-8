import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Team } from '../../types';
import { useAuthStore } from '../../lib/store';
import { getDemoTeams } from '../../lib/teams';
import { getDemoUser } from '../../lib/demo-data';
import { Settings, UserPlus, Users, LogOut, Trash2, Globe, MapPin, Clock, Trophy, Calendar } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import EditTeamModal from './EditTeamModal';
import ManageMembersModal from './ManageMembersModal';
import JoinRequestsModal from './JoinRequestsModal';
import InviteMembersModal from './InviteMembersModal';
import TransferOwnershipModal from './TransferOwnershipModal';

export default function TeamProfile() {
  const { teamId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isDemoMode = import.meta.env.MODE === 'development';

  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Fetch team data
  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      if (isDemoMode) {
        const demoTeams = getDemoTeams();
        const team = demoTeams.find(t => t.id === teamId);
        if (!team) throw new Error('Team not found');
        return team;
      }

      const docRef = doc(db, 'teams', teamId!);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Team not found');
      }
      
      return { id: docSnap.id, ...docSnap.data() } as Team;
    },
    enabled: Boolean(teamId)
  });

  // Fetch member details
  const { data: memberDetails } = useQuery({
    queryKey: ['team-members', team?.members],
    queryFn: async () => {
      if (!team) return [];

      if (isDemoMode) {
        return Promise.all(
          team.members.map(async (member) => {
            const user = getDemoUser(member.userId);
            return {
              ...member,
              user: user || {
                username: 'Unknown User',
                profileImage: 'https://via.placeholder.com/40'
              }
            };
          })
        );
      }
      return [];
    },
    enabled: Boolean(team)
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!team) return null;

  const isTeamMember = user ? team.members.some(member => member.userId === user.id) : false;
  const isTeamOwner = user ? team.ownerId === user.id : false;

  const handleLeaveTeam = async () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        // Implement leave team logic
        navigate('/teams');
      } catch (error) {
        console.error('Error leaving team:', error);
      }
    }
  };

  const handleDeleteTeam = async () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        // Implement delete team logic
        navigate('/teams');
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleJoinRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Implement join request logic
      console.log('Sending join request...');
    } catch (error) {
      console.error('Error sending join request:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Team Header with Background */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="h-64 w-full relative">
          {team.backgroundVideo ? (
            <video
              src={team.backgroundVideo}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={team.backgroundImage}
              alt={`${team.name} background`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark to-transparent" />
        </div>

        {/* Team Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="w-32 h-32 rounded-lg border-4 border-gaming-card relative z-10"
              />
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-display font-bold text-white">
                    {team.name}
                  </h1>
                  {team.level && (
                    <span className="px-3 py-1 rounded-full bg-gaming-neon/20 text-gaming-neon text-sm">
                      {team.level}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-300">
                  {team.country && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{team.country}</span>
                    </div>
                  )}
                  {team.region && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{team.region}</span>
                    </div>
                  )}
                  {team.timezone && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{team.timezone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 relative z-10">
              {isTeamOwner ? (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    Invite
                  </button>
                  <button
                    onClick={() => setShowRequestsModal(true)}
                    className="px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" />
                    Requests
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-3 py-1 bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors"
                  >
                    Transfer
                  </button>
                  <button
                    onClick={handleDeleteTeam}
                    className="px-3 py-1 bg-gaming-accent/10 text-gaming-accent rounded-md hover:bg-gaming-accent/20 transition-colors"
                  >
                    Delete
                  </button>
                </>
              ) : isTeamMember ? (
                <button
                  onClick={handleLeaveTeam}
                  className="px-3 py-1 bg-gaming-accent/10 text-gaming-accent rounded-md hover:bg-gaming-accent/20 transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Team
                </button>
              ) : (
                <button
                  onClick={handleJoinRequest}
                  className="px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Join Team
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Description */}
      <div className="bg-gaming-card rounded-lg p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-white mb-4">About</h2>
        <p className="text-gray-300">{team.description}</p>
      </div>

      {/* Team Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Members */}
        <div className="bg-gaming-card rounded-lg p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gaming-neon" />
              <h2 className="font-display text-xl font-bold text-white">Members</h2>
            </div>
            {isTeamOwner && (
              <button
                onClick={() => setShowMembersModal(true)}
                className="text-gaming-neon hover:text-gaming-neon/80"
              >
                Manage
              </button>
            )}
          </div>
          <div className="space-y-4">
            {memberDetails?.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 rounded-lg bg-gaming-dark/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.user.profileImage}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-white">{member.user.username}</div>
                    <div className="text-sm text-gaming-neon">{member.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gaming-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-gaming-neon" />
            <h2 className="font-display text-xl font-bold text-white">Statistics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-white">
                {Math.round((team.stats.wins / team.stats.matchesPlayed) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tournament Wins</span>
              <span className="text-white">{team.stats.tournamentWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Matches Played</span>
              <span className="text-white">{team.stats.matchesPlayed}</span>
            </div>
          </div>
        </div>

        {/* Games & Platforms */}
        <div className="bg-gaming-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gaming-neon" />
            <h2 className="font-display text-xl font-bold text-white">Games & Platforms</h2>
          </div>
          <div className="space-y-4">
            {team.games.map((game) => (
              <div key={game.id} className="p-3 rounded-lg bg-gaming-dark/50">
                <div className="text-white font-medium">{game.name}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 rounded-full bg-gaming-neon/10 text-gaming-neon text-xs"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditTeamModal
          team={team}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showMembersModal && (
        <ManageMembersModal
          team={team}
          onClose={() => setShowMembersModal(false)}
        />
      )}

      {showRequestsModal && (
        <JoinRequestsModal
          team={team}
          onClose={() => setShowRequestsModal(false)}
        />
      )}

      {showInviteModal && (
        <InviteMembersModal
          team={team}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {showTransferModal && (
        <TransferOwnershipModal
          team={team}
          onClose={() => setShowTransferModal(false)}
        />
      )}
    </div>
  );
}