import { Team } from '../types';

// Default images
export const DEFAULT_TEAM_LOGO = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200';
export const DEFAULT_TEAM_BACKGROUND = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80';

// Demo teams data
const demoTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Neon Ninjas',
    logo: DEFAULT_TEAM_LOGO,
    backgroundImage: DEFAULT_TEAM_BACKGROUND,
    description: 'Professional Valorant team competing at the highest level',
    country: 'United States',
    region: 'North America',
    timezone: 'UTC-5',
    level: 'Pro',
    games: [
      {
        id: 'valorant',
        name: 'Valorant',
        platforms: ['PC']
      }
    ],
    platforms: ['PC'],
    members: [
      {
        userId: 'user-1',
        role: 'Leader',
        joinedAt: new Date('2023-01-01')
      }
    ],
    ownerId: 'user-1',
    stats: {
      wins: 150,
      losses: 30,
      draws: 5,
      tournamentWins: 10,
      matchesPlayed: 185,
      ranking: 1
    },
    followers: [],
    socialMedia: [],
    teamMessage: 'Looking for dedicated players!',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'team-2',
    name: 'Digital Dragons',
    logo: DEFAULT_TEAM_LOGO,
    backgroundImage: DEFAULT_TEAM_BACKGROUND,
    description: 'Competitive League of Legends team with a focus on team synergy',
    country: 'Canada',
    region: 'North America',
    timezone: 'UTC-4',
    level: 'Competitor',
    games: [
      {
        id: 'lol',
        name: 'League of Legends',
        platforms: ['PC']
      }
    ],
    platforms: ['PC'],
    members: [
      {
        userId: 'user-2',
        role: 'Leader',
        joinedAt: new Date('2023-02-01')
      }
    ],
    ownerId: 'user-2',
    stats: {
      wins: 100,
      losses: 50,
      draws: 0,
      tournamentWins: 5,
      matchesPlayed: 150,
      ranking: 2
    },
    followers: [],
    socialMedia: [],
    teamMessage: 'Seeking strategic players!',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date()
  },
  {
    id: 'gameriebest',
    name: 'GamerieBest',
    logo: DEFAULT_TEAM_LOGO,
    backgroundImage: DEFAULT_TEAM_BACKGROUND,
    description: 'Elite gaming team focused on competitive excellence and team synergy. We strive to be the best in every game we compete in.',
    country: 'Greece',
    region: 'Europe',
    timezone: 'UTC+2',
    level: 'Pro',
    games: [
      {
        id: 'lol',
        name: 'League of Legends',
        platforms: ['PC']
      },
      {
        id: 'valorant',
        name: 'Valorant',
        platforms: ['PC']
      }
    ],
    platforms: ['PC'],
    members: [
      {
        userId: 'user-1',
        role: 'Leader',
        joinedAt: new Date()
      }
    ],
    ownerId: 'user-1',
    stats: {
      wins: 0,
      losses: 0,
      draws: 0,
      tournamentWins: 0,
      matchesPlayed: 0,
      ranking: 0
    },
    followers: [],
    socialMedia: [],
    teamMessage: 'Join us in our journey to gaming excellence!',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getDemoTeams = () => demoTeams;

export const createTeam = async (teamData: Partial<Team>, files?: {
  logo?: File;
  background?: File;
  video?: File;
}) => {
  // Implementation
};

export const updateTeam = async (teamId: string, updates: Partial<Team>) => {
  // Implementation
};

export const deleteTeam = async (teamId: string) => {
  // Implementation
};

export const leaveTeam = async (teamId: string) => {
  // Implementation
};

export const transferOwnership = async (teamId: string, newOwnerId: string) => {
  // Implementation
};

export const sendTeamJoinRequest = async (teamId: string) => {
  // Implementation
};

export const acceptJoinRequest = async (requestId: string) => {
  // Implementation
};

export const rejectJoinRequest = async (requestId: string) => {
  // Implementation
};

export const inviteMember = async (teamId: string, inviteeId: string, message?: string) => {
  // Implementation
};

export const updateMemberRole = async (teamId: string, userId: string, role: string) => {
  // Implementation
};

export const removeMember = async (teamId: string, userId: string) => {
  // Implementation
};