import { Game, User } from '@/models';
import * as gameService from '@/services/gameService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@/models', () => ({
  Game: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

jest.mock('uuid');
(uuidv4 as jest.Mock).mockReturnValue('test-game-id');

describe('Game Service', () => {
  const mockGame = {
    id: 'test-game-id',
    date: new Date('2023-05-15T14:00:00Z'),
    location: 'Central Park Courts',
    status: 'scheduled',
    type: 'doubles',
    result: null,
    createdById: 'user-123',
    players: [],
    save: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
    addPlayer: jest.fn().mockResolvedValue(true),
    removePlayer: jest.fn().mockResolvedValue(true),
    getPlayers: jest.fn().mockResolvedValue([]),
    toJSON: jest.fn().mockReturnValue({
      id: 'test-game-id',
      date: new Date('2023-05-15T14:00:00Z'),
      location: 'Central Park Courts',
      status: 'scheduled',
      type: 'doubles',
      result: null,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    it('should create a new game', async () => {
      const gameData = {
        date: new Date('2023-05-15T14:00:00Z'),
        location: 'Central Park Courts',
        type: 'doubles',
        createdById: 'user-123',
      };

      (Game.create as jest.Mock).mockResolvedValue(mockGame);

      const result = await gameService.createGame(gameData);

      expect(Game.create).toHaveBeenCalledWith({
        ...gameData,
        status: 'scheduled',
      });
      expect(result).toEqual(mockGame.toJSON());
    });
  });

  describe('getAllGames', () => {
    it('should return all games', async () => {
      (Game.findAll as jest.Mock).mockResolvedValue([mockGame]);

      const result = await gameService.getAllGames({});

      expect(Game.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockGame.toJSON()]);
    });

    it('should filter games by status', async () => {
      (Game.findAll as jest.Mock).mockResolvedValue([mockGame]);

      const result = await gameService.getAllGames({ status: 'scheduled' });

      expect(Game.findAll).toHaveBeenCalledWith({
        where: { status: 'scheduled' },
        include: expect.anything(),
      });
      expect(result).toEqual([mockGame.toJSON()]);
    });
  });

  describe('getGameById', () => {
    it('should return the game if found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);

      const result = await gameService.getGameById('test-game-id');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id', {
        include: expect.anything(),
      });
      expect(result).toEqual(mockGame.toJSON());
    });

    it('should return null if game not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.getGameById('nonexistent-id');

      expect(Game.findByPk).toHaveBeenCalledWith('nonexistent-id', {
        include: expect.anything(),
      });
      expect(result).toBeNull();
    });
  });

  describe('updateGame', () => {
    it('should update the game if found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);

      const updateData = {
        location: 'Downtown Courts',
        status: 'completed',
      };

      const result = await gameService.updateGame('test-game-id', updateData);

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(mockGame.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockGame.toJSON());
    });

    it('should return null if game not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.updateGame('nonexistent-id', { location: 'New Location' });

      expect(Game.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('deleteGame', () => {
    it('should delete the game if found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);

      const result = await gameService.deleteGame('test-game-id');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(mockGame.destroy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should return false if game not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.deleteGame('nonexistent-id');

      expect(Game.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeFalsy();
    });
  });

  describe('addPlayerToGame', () => {
    it('should add a player to the game', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await gameService.addPlayerToGame('test-game-id', 'user-123');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(User.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockGame.addPlayer).toHaveBeenCalledWith(mockUser);
      expect(result).toBeTruthy();
    });

    it('should return false if game not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.addPlayerToGame('nonexistent-id', 'user-123');

      expect(Game.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeFalsy();
    });

    it('should return false if user not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.addPlayerToGame('test-game-id', 'nonexistent-user');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(User.findByPk).toHaveBeenCalledWith('nonexistent-user');
      expect(result).toBeFalsy();
    });
  });

  describe('removePlayerFromGame', () => {
    it('should remove a player from the game', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await gameService.removePlayerFromGame('test-game-id', 'user-123');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(User.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockGame.removePlayer).toHaveBeenCalledWith(mockUser);
      expect(result).toBeTruthy();
    });

    it('should return false if game not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.removePlayerFromGame('nonexistent-id', 'user-123');

      expect(Game.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeFalsy();
    });

    it('should return false if user not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.removePlayerFromGame('test-game-id', 'nonexistent-user');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(User.findByPk).toHaveBeenCalledWith('nonexistent-user');
      expect(result).toBeFalsy();
    });
  });

  describe('getGamePlayers', () => {
    it('should return all players in a game', async () => {
      const mockPlayers = [
        { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
        { id: 'user-456', name: 'Jane Smith', email: 'jane@example.com' },
      ];

      (Game.findByPk as jest.Mock).mockResolvedValue(mockGame);
      mockGame.getPlayers.mockResolvedValue(
        mockPlayers.map(player => ({
          ...player,
          toJSON: () => player,
        }))
      );

      const result = await gameService.getGamePlayers('test-game-id');

      expect(Game.findByPk).toHaveBeenCalledWith('test-game-id');
      expect(mockGame.getPlayers).toHaveBeenCalled();
      expect(result).toEqual(mockPlayers);
    });

    it('should return null if game not found', async () => {
      (Game.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await gameService.getGamePlayers('nonexistent-id');

      expect(Game.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });
});
