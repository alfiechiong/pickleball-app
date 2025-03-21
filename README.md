# Pickleball App

A modern React Native application for pickleball players to manage games, tournaments, and connect with other players.

## Features

- Create and manage pickleball games
- Join and organize tournaments
- Track your game history and stats
- Connect with other pickleball players
- Discover local pickleball courts

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Axios for API requests
- React Hook Form for form handling
- Yup for form validation

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

```
git clone https://github.com/alfiechiong/pickleball.git
cd pickleball
```

2. Install dependencies:

```
npm install
```

### Running the App

#### Development

```
npm run start:dev
```

#### Test Environment

```
npm run start:test
```

#### Production

```
npm run start:prod
```

### Common Commands

- `npm run start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in the web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── services/         # API services
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── types/            # TypeScript interfaces and types
├── styles/           # Global styles and theme
├── constants/        # Constants and configuration
└── assets/           # Static assets
```

## Environment Setup

The app uses different environment configurations:

- `.env.development` - Development environment variables
- `.env.test` - Test environment variables
- `.env.production` - Production environment variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
