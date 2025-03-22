import { Tournament, User, Game } from '@/models';
import * as tournamentService from '@/services/tournamentService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@/models', () => ({
  Tournament: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
  Game: {
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('uuid');
(uuidv4 as jest.Mock).mockReturnValue('test-tournament-id');

describe('Tournament Service', () => {
  const mockTournament = {
    id: 'test-tournament-id',
    name: 'Summer Pickleball Championship',
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-07-16'),
    location: 'Central Park Courts',
    description: 'Annual summer tournament',
    registrationDeadline: new Date('2023-07-10'),
    maxParticipants: 32,
    status: 'upcoming',
    createdById: 'user-123',
    save: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
    addParticipant: jest.fn().mockResolvedValue(true),
    removeParticipant: jest.fn().mockResolvedValue(true),
    getParticipants: jest.fn().mockResolvedValue([]),
    getGames: jest.fn().mockResolvedValue([]),
    addGame: jest.fn().mockResolvedValue(true),
    toJSON: jest.fn().mockReturnValue({
      id: 'test-tournament-id',
      name: 'Summer Pickleball Championship',
      startDate: new Date('2023-07-15'),
      endDate: new Date('2023-07-16'),
      location: 'Central Park Courts',
      description: 'Annual summer tournament',
      registrationDeadline: new Date('2023-07-10'),
      maxParticipants: 32,
      status: 'upcoming',
      createdById: 'user-123',
    }),
  };

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    toJSON: jest.fn().mockReturnValue({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    }),
  };

  const mockGame = {
    id: 'game-123',
    date: new Date('2023-07-15T14:00:00Z'),
    location: 'Central Park Courts',
    status: 'scheduled',
    type: 'doubles',
    tournamentId: 'test-tournament-id',
    toJSON: jest.fn().mockReturnValue({
      id: 'game-123',
      date: new Date('2023-07-15T14:00:00Z'),
      location: 'Central Park Courts',
      status: 'scheduled',
      type: 'doubles',
      tournamentId: 'test-tournament-id',
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTournament', () => {
    it('should create a new tournament', async () => {
      const tournamentData = {
        name: 'Summer Pickleball Championship',
        startDate: new Date('2023-07-15'),
        endDate: new Date('2023-07-16'),
        location: 'Central Park Courts',
        description: 'Annual summer tournament',
        registrationDeadline: new Date('2023-07-10'),
        maxParticipants: 32,
        createdById: 'user-123',
      };

      (Tournament.create as jest.Mock).mockResolvedValue(mockTournament);

      const result = await tournamentService.createTournament(tournamentData);

      expect(Tournament.create).toHaveBeenCalledWith({
        ...tournamentData,
        status: 'upcoming',
      });
      expect(result).toEqual(mockTournament.toJSON());
    });
  });

  describe('getAllTournaments', () => {
    it('should return all tournaments', async () => {
      (Tournament.findAll as jest.Mock).mockResolvedValue([mockTournament]);

      const result = await tournamentService.getAllTournaments({});

      expect(Tournament.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockTournament.toJSON()]);
    });

    it('should filter tournaments by status', async () => {
      (Tournament.findAll as jest.Mock).mockResolvedValue([mockTournament]);

      const result = await tournamentService.getAllTournaments({ status: 'upcoming' });

      expect(Tournament.findAll).toHaveBeenCalledWith({
        where: { status: 'upcoming' },
        include: expect.anything(),
      });
      expect(result).toEqual([mockTournament.toJSON()]);
    });
  });

  describe('getTournamentById', () => {
    it('should return the tournament if found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);

      const result = await tournamentService.getTournamentById('test-tournament-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id', {
        include: expect.anything(),
      });
      expect(result).toEqual(mockTournament.toJSON());
    });

    it('should return null if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.getTournamentById('nonexistent-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id', {
        include: expect.anything(),
      });
      expect(result).toBeNull();
    });
  });

  describe('updateTournament', () => {
    it('should update the tournament if found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);

      const updateData = {
        location: 'Downtown Courts',
        status: 'in_progress',
      };

      const result = await tournamentService.updateTournament('test-tournament-id', updateData);

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(mockTournament.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockTournament.toJSON());
    });

    it('should return null if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.updateTournament('nonexistent-id', {
        location: 'New Location',
      });

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('deleteTournament', () => {
    it('should delete the tournament if found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);

      const result = await tournamentService.deleteTournament('test-tournament-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(mockTournament.destroy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should return false if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.deleteTournament('nonexistent-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeFalsy();
    });
  });

  describe('registerParticipant', () => {
    it('should register a participant to the tournament', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await tournamentService.registerParticipant('test-tournament-id', 'user-123');

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(User.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockTournament.addParticipant).toHaveBeenCalledWith(mockUser);
      expect(result).toBeTruthy();
    });

    it('should return false if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.registerParticipant('nonexistent-id', 'user-123');

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeFalsy();
    });

    it('should return false if user not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.registerParticipant(
        'test-tournament-id',
        'nonexistent-user'
      );

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(User.findByPk).toHaveBeenCalledWith('nonexistent-user');
      expect(result).toBeFalsy();
    });
  });

  describe('removeParticipant', () => {
    it('should remove a participant from the tournament', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await tournamentService.removeParticipant('test-tournament-id', 'user-123');

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(User.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockTournament.removeParticipant).toHaveBeenCalledWith(mockUser);
      expect(result).toBeTruthy();
    });

    it('should return false if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.removeParticipant('nonexistent-id', 'user-123');

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeFalsy();
    });

    it('should return false if user not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.removeParticipant(
        'test-tournament-id',
        'nonexistent-user'
      );

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(User.findByPk).toHaveBeenCalledWith('nonexistent-user');
      expect(result).toBeFalsy();
    });
  });

  describe('getTournamentParticipants', () => {
    it('should return all participants in a tournament', async () => {
      const mockParticipants = [
        { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
        { id: 'user-456', name: 'Jane Smith', email: 'jane@example.com' },
      ];

      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      mockTournament.getParticipants.mockResolvedValue(
        mockParticipants.map(participant => ({
          ...participant,
          toJSON: () => participant,
        }))
      );

      const result = await tournamentService.getTournamentParticipants('test-tournament-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(mockTournament.getParticipants).toHaveBeenCalled();
      expect(result).toEqual(mockParticipants);
    });

    it('should return null if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.getTournamentParticipants('nonexistent-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('addGameToTournament', () => {
    it('should add a game to the tournament', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      (Game.create as jest.Mock).mockResolvedValue(mockGame);

      const gameData = {
        date: new Date('2023-07-15T14:00:00Z'),
        location: 'Central Park Courts',
        type: 'doubles',
      };

      const result = await tournamentService.addGameToTournament('test-tournament-id', gameData);

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(Game.create).toHaveBeenCalledWith({
        ...gameData,
        tournamentId: 'test-tournament-id',
        status: 'scheduled',
      });
      expect(mockTournament.addGame).toHaveBeenCalledWith(mockGame);
      expect(result).toEqual(mockGame.toJSON());
    });

    it('should return null if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const gameData = {
        date: new Date('2023-07-15T14:00:00Z'),
        location: 'Central Park Courts',
        type: 'doubles',
      };

      const result = await tournamentService.addGameToTournament('nonexistent-id', gameData);

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('getTournamentGames', () => {
    it('should return all games in a tournament', async () => {
      const mockGames = [
        {
          id: 'game-123',
          date: new Date('2023-07-15T14:00:00Z'),
          location: 'Central Park Courts',
          status: 'scheduled',
          type: 'doubles',
          tournamentId: 'test-tournament-id',
        },
        {
          id: 'game-456',
          date: new Date('2023-07-15T16:00:00Z'),
          location: 'Central Park Courts',
          status: 'scheduled',
          type: 'singles',
          tournamentId: 'test-tournament-id',
        },
      ];

      (Tournament.findByPk as jest.Mock).mockResolvedValue(mockTournament);
      mockTournament.getGames.mockResolvedValue(
        mockGames.map(game => ({
          ...game,
          toJSON: () => game,
        }))
      );

      const result = await tournamentService.getTournamentGames('test-tournament-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('test-tournament-id');
      expect(mockTournament.getGames).toHaveBeenCalled();
      expect(result).toEqual(mockGames);
    });

    it('should return null if tournament not found', async () => {
      (Tournament.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await tournamentService.getTournamentGames('nonexistent-id');

      expect(Tournament.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });
});
