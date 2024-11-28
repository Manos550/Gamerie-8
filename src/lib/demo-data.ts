import { User } from '../types';

// Initial demo users
export let demoUsers: User[] = [
  {
    id: 'user-1',
    username: 'Manos550',
    email: 'demo@example.com',
    role: 'user',
    gamerTitle: 'Player',
    gameLevel: 'Amateur',
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80',
    bio: 'Passionate about technology and gaming',
    location: 'Athens',
    country: 'Greece',
    timezone: 'UTC+2',
    personalInfo: {
      fullName: 'Manolis Latinos',
      location: 'Athens, Greece',
      profession: 'Software Developer'
    },
    needs: [],
    gamesPlayed: [],
    platforms: ['PC'],
    socialMedia: [
      {
        platform: 'Facebook',
        username: 'manolislatinos',
        url: 'https://www.facebook.com/manolislatinos'
      },
      {
        platform: 'Instagram',
        username: 'manoslatinos',
        url: 'https://www.instagram.com/manoslatinos/'
      }
    ],
    gamingAccounts: [],
    skills: [
      {
        name: 'Strategic Thinking',
        endorsements: []
      },
      {
        name: 'Team Coordination',
        endorsements: []
      },
      {
        name: 'Game Sense',
        endorsements: []
      },
      {
        name: 'Problem Solving',
        endorsements: []
      },
      {
        name: 'Quick Decision Making',
        endorsements: []
      }
    ],
    stats: {
      wins: 0,
      losses: 0,
      draws: 0,
      tournamentWins: 0,
      matchesPlayed: 0
    },
    followers: [],
    following: [],
    teams: [],
    achievements: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Helper function to get a demo user by ID
export const getDemoUser = (userId: string): User | undefined => {
  return demoUsers.find(user => user.id === userId);
};

// Helper function to update a demo user
export const updateDemoUser = (userId: string, updates: Partial<User>): void => {
  const userIndex = demoUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    demoUsers[userIndex] = {
      ...demoUsers[userIndex],
      ...updates,
      updatedAt: new Date()
    };
  }
};