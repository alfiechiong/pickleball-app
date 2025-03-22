import bcrypt from 'bcrypt';

// Define skill levels to match User model
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';

// User seed data
export const testUsers = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Test User',
    email: 'testuser@example.com',
    password: bcrypt.hashSync('Password123!', 10),
    skillLevel: 'intermediate' as SkillLevel,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('AdminPass123!', 10),
    skillLevel: 'advanced' as SkillLevel,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Game seed data
export const testGames = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    location: 'Central Park Courts',
    dateTime: new Date(Date.now() + 86400000), // Tomorrow
    duration: 60,
    maxPlayers: 4,
    notes: 'Casual game, all skill levels welcome',
    createdBy: testUsers[0].id,
    status: 'UPCOMING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    location: 'Downtown Recreation Center',
    dateTime: new Date(Date.now() + 172800000), // Day after tomorrow
    duration: 90,
    maxPlayers: 8,
    notes: 'Competitive play, intermediate and above',
    createdBy: testUsers[1].id,
    status: 'UPCOMING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Player seed data
export const testPlayers = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    gameId: testGames[0].id,
    userId: testUsers[0].id,
    status: 'CONFIRMED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    gameId: testGames[0].id,
    userId: testUsers[1].id,
    status: 'CONFIRMED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Tournament seed data
export const testTournaments = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Spring Championship',
    description: 'Annual spring tournament',
    startDate: new Date(Date.now() + 604800000), // 1 week from now
    endDate: new Date(Date.now() + 691200000), // 8 days from now
    location: 'City Sports Complex',
    maxParticipants: 16,
    registrationDeadline: new Date(Date.now() + 518400000), // 6 days from now
    format: 'SINGLE_ELIMINATION',
    skillLevel: 'intermediate' as SkillLevel,
    createdBy: testUsers[1].id,
    status: 'REGISTRATION_OPEN',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Tournament participant seed data
export const testTournamentParticipants = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    tournamentId: testTournaments[0].id,
    userId: testUsers[0].id,
    status: 'REGISTERED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Tournament game seed data
export const testTournamentGames = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    tournamentId: testTournaments[0].id,
    player1Id: testUsers[0].id,
    player2Id: testUsers[1].id,
    round: 1,
    courtNumber: 1,
    scheduledTime: new Date(Date.now() + 604800000), // 1 week from now
    status: 'SCHEDULED',
    player1Score: null,
    player2Score: null,
    winnerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
