import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/lib/supabase', () => {
  const auth = {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
  };

  const query = {
    getById: vi.fn(),
  };

  const mutation = {
    insert: vi.fn(),
    update: vi.fn(),
  };

  const supabase = { auth };
  const subscribe = {};
  const storage = {};

  return {
    supabase,
    query,
    mutation,
    auth,
    subscribe,
    storage,
    default: supabase,
    __mocks: { auth, query, mutation, supabase },
  };
});

import { __mocks } from '../src/lib/supabase';

const { auth: authMock, query: queryMock, mutation: mutationMock } = __mocks;

import { getCurrentUser, login, logout, register } from '../src/api/auth';

describe('auth API with Supabase Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('signs up user via Supabase Auth and creates profile record', async () => {
      authMock.signUp.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
          session: {
            access_token: 'token-abc',
          },
        },
        error: null,
      });

      queryMock.getById
        .mockImplementationOnce(() => {
          throw new Error('Not found');
        })
        .mockResolvedValueOnce({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          phone: '+123456789',
          gender: 'male',
          total_sessions: 0,
          total_duration: 0,
        });

      mutationMock.insert.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        phone: '+123456789',
        gender: 'male',
        total_sessions: 0,
        total_duration: 0,
      });

      const result = await register({
        email: 'test@example.com',
        password: 'secret123',
        name: 'Test User',
        phone: '+123456789',
        gender: 'male',
      });

      expect(authMock.signUp).toHaveBeenCalledWith('test@example.com', 'secret123', {
        name: 'Test User',
        phone: '+123456789',
        gender: 'male',
      });

      expect(mutationMock.insert).toHaveBeenCalledWith(
        'users',
        expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          phone: '+123456789',
          gender: 'male',
        }),
      );

      expect(result).toEqual({
        token: 'token-abc',
        user: expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          phone: '+123456789',
          gender: 'male',
        }),
      });
    });
  });

  describe('login', () => {
    it('signs in existing user and updates profile metadata', async () => {
      authMock.signIn.mockResolvedValue({
        data: {
          user: {
            id: 'user-456',
            email: 'existing@example.com',
          },
          session: {
            access_token: 'token-login',
          },
        },
        error: null,
      });

      queryMock.getById.mockResolvedValue({
        id: 'user-456',
        email: 'existing@example.com',
        name: 'Existing User',
        phone: null,
        gender: null,
        total_sessions: 10,
        total_duration: 600,
      });

      mutationMock.update.mockResolvedValue({
        id: 'user-456',
      });

      const result = await login({
        email: 'existing@example.com',
        password: 'letmein',
        name: 'Existing User',
        phone: null,
        gender: null,
      });

      expect(authMock.signIn).toHaveBeenCalledWith('existing@example.com', 'letmein');

      expect(mutationMock.update).toHaveBeenCalledWith(
        'users',
        'user-456',
        expect.objectContaining({
          email: 'existing@example.com',
          name: 'Existing User',
        }),
      );

      expect(result).toEqual({
        token: 'token-login',
        user: expect.objectContaining({
          id: 'user-456',
          email: 'existing@example.com',
          name: 'Existing User',
          totalSessions: 10,
          totalDuration: 600,
        }),
      });
    });
  });

  describe('getCurrentUser', () => {
    it('returns merged auth user and profile stats when session exists', async () => {
      authMock.getUser.mockResolvedValue({
        id: 'user-789',
        email: 'current@example.com',
        user_metadata: {
          name: 'Current User',
        },
      });

      queryMock.getById.mockResolvedValue({
        id: 'user-789',
        email: 'current@example.com',
        name: 'Current User',
        phone: '+987654321',
        gender: 'female',
        total_sessions: 2,
        total_duration: 120,
      });

      const result = await getCurrentUser();

      expect(authMock.getUser).toHaveBeenCalled();
      expect(queryMock.getById).toHaveBeenCalledWith('users', 'user-789');
      expect(result).toEqual({
        id: 'user-789',
        email: 'current@example.com',
        name: 'Current User',
        phone: '+987654321',
        gender: 'female',
        totalSessions: 2,
        totalDuration: 120,
      });
    });

    it('returns null when no Supabase session exists', async () => {
      authMock.getUser.mockResolvedValue(null);

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(queryMock.getById).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('signs out via Supabase Auth', async () => {
      authMock.signOut.mockResolvedValue({ error: null });

      await logout();

      expect(authMock.signOut).toHaveBeenCalled();
    });
  });
});
