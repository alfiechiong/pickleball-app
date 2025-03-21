// User types
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  skill_level?: SkillLevel;
}

// Skill level enum for players
export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  PRO = "pro",
}

// Game types
export interface Game {
  id: string;
  date: Date;
  location: string;
  players: Player[];
  score?: Score;
  status: GameStatus;
}

export interface Player {
  userId: string;
  name: string;
  team: "A" | "B";
}

export interface Score {
  teamA: number;
  teamB: number;
}

export enum GameStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Tournament types
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxParticipants: number;
  participants: User[];
  games: Game[];
  status: TournamentStatus;
}

export enum TournamentStatus {
  UPCOMING = "upcoming",
  REGISTRATION_OPEN = "registrationOpen",
  REGISTRATION_CLOSED = "registrationClosed",
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
