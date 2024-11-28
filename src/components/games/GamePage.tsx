import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GamePage as GamePageType } from '../../types';
import { Users, Gamepad, Globe, ExternalLink, Radio, Eye, Brain } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import GameFollowersList from './GameFollowersList';
import GameTeamsList from './GameTeamsList';
import { getTournamentsByGame } from '../../lib/tournaments';
import TournamentCard from '../tournaments/TournamentCard';
import { getDemoGame } from '../../lib/search';

export default function GamePage() {
  const { gameId } = useParams();
  const { user } = useAuthStore();
  const isDemoMode = import.meta.env.MODE === 'development';

  const { data: game, isLoading, error } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      if (isDemoMode) {
        const game = await getDemoGame(gameId!);
        if (!game) throw new Error('Game not found');
        return game;
      }

      const docRef = doc(db, 'games', gameId!);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Game not found');
      }
      
      return { id: docSnap.id, ...docSnap.data() } as GamePageType;
    },
    enabled: Boolean(gameId)
  });

  // Fetch tournaments for this game
  const { data: tournaments } = useQuery({
    queryKey: ['game-tournaments', gameId],
    queryFn: () => getTournamentsByGame(gameId!),
    enabled: Boolean(gameId)
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!game) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Game Header with Wall Photo */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <img
          src={game.wallPhoto}
          alt={game.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {game.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span>{game.company}</span>
                <span>•</span>
                <span>{game.gameType}</span>
              </div>
            </div>
            
            <a
              href={game.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Official Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Game Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gaming-card rounded-lg p-6 text-center">
          <div className="text-gaming-neon mb-1">
            <Users className="w-5 h-5 mx-auto" />
          </div>
          <div className="font-bold text-white text-2xl">
            {game.followers_stats.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Players</div>
        </div>

        <div className="bg-gaming-card rounded-lg p-6 text-center">
          <div className="text-gaming-neon mb-1">
            <Gamepad className="w-5 h-5 mx-auto" />
          </div>
          <div className="font-bold text-white text-2xl">
            {game.followers_stats.active_gamers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Active Players</div>
        </div>

        <div className="bg-gaming-card rounded-lg p-6 text-center">
          <div className="text-gaming-neon mb-1">
            <Radio className="w-5 h-5 mx-auto" />
          </div>
          <div className="font-bold text-white text-2xl">
            {game.followers_stats.streamers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Streamers</div>
        </div>

        <div className="bg-gaming-card rounded-lg p-6 text-center">
          <div className="text-gaming-neon mb-1">
            <Eye className="w-5 h-5 mx-auto" />
          </div>
          <div className="font-bold text-white text-2xl">
            {game.followers_stats.spectators.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Spectators</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Game Info */}
        <div className="space-y-6">
          {/* About */}
          <div className="bg-gaming-card rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{game.description}</p>
          </div>

          {/* Game Modes */}
          <div className="bg-gaming-card rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">Game Modes</h2>
            <div className="space-y-2">
              {game.gameModes.map((mode, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gaming-dark/50 text-white"
                >
                  {mode}
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-gaming-card rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-gaming-neon" />
              <h2 className="font-display text-xl font-bold text-white">Required Skills</h2>
            </div>
            
            <div className="space-y-4">
              {game.requiredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">{skill}</span>
                    <div className="w-16 h-2 bg-gaming-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gaming-neon"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-gaming-card rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {game.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1 rounded-full bg-gaming-dark/50 text-gaming-neon text-sm"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="bg-gaming-card rounded-lg p-6">
            <h2 className="font-display text-xl font-bold text-white mb-4">Links</h2>
            
            {game.socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-gaming-dark/50 hover:bg-gaming-dark mb-3 last:mb-0 group transition-colors"
              >
                <span className="text-gray-400 group-hover:text-white">
                  {social.platform}
                </span>
                <ExternalLink className="w-4 h-4 text-gaming-neon" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Column - Teams, Tournaments & Players */}
        <div className="lg:col-span-2 space-y-8">
          {/* Teams */}
          <GameTeamsList gameId={game.id} teams={game.teams} />

          {/* Tournaments */}
          {tournaments && tournaments.length > 0 && (
            <div className="bg-gaming-card rounded-lg p-6">
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Upcoming Tournaments
              </h2>
              <div className="space-y-6">
                {tournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          <GameFollowersList gameId={game.id} />
        </div>
      </div>
    </div>
  );
}