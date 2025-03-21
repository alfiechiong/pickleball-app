// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
  },
  GAMES: {
    LIST: "/games",
    DETAILS: (id: string) => `/games/${id}`,
    CREATE: "/games",
    UPDATE: (id: string) => `/games/${id}`,
    DELETE: (id: string) => `/games/${id}`,
  },
  TOURNAMENTS: {
    LIST: "/tournaments",
    DETAILS: (id: string) => `/tournaments/${id}`,
    CREATE: "/tournaments",
    UPDATE: (id: string) => `/tournaments/${id}`,
    DELETE: (id: string) => `/tournaments/${id}`,
    REGISTER: (id: string) => `/tournaments/${id}/register`,
  },
};

// Navigation Routes
export const ROUTES = {
  AUTH: {
    LOGIN: "Login",
    REGISTER: "Register",
    FORGOT_PASSWORD: "ForgotPassword",
  },
  MAIN: {
    HOME: "Home",
    GAMES: "Games",
    GAME_DETAILS: "GameDetails",
    CREATE_GAME: "CreateGame",
    TOURNAMENTS: "Tournaments",
    TOURNAMENT_DETAILS: "TournamentDetails",
    CREATE_TOURNAMENT: "CreateTournament",
    PROFILE: "Profile",
    SETTINGS: "Settings",
  },
};

// Default values
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
};

// Error messages
export const ERROR_MESSAGES = {
  GENERAL: "Something went wrong. Please try again later.",
  NETWORK: "Network error. Please check your internet connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  GAME_CREATED: "Game created successfully!",
  GAME_UPDATED: "Game updated successfully!",
  GAME_DELETED: "Game deleted successfully!",
  TOURNAMENT_CREATED: "Tournament created successfully!",
  TOURNAMENT_UPDATED: "Tournament updated successfully!",
  TOURNAMENT_DELETED: "Tournament deleted successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  REGISTERED: "Registered successfully!",
};
