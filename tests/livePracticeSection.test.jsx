import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LivePractice from '../src/components/sections/LivePractice.jsx';

vi.mock('../src/api/auth.js', () => ({
  verifyToken: vi.fn(),
}));

describe('LivePractice section', () => {
  const authApi = require('../src/api/auth.js');

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('verifies stored token and shows welcome message when valid', async () => {
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'user-1',
        name: 'Test User',
        gender: 'male',
        email: 'test@example.com',
        totalSessions: 3,
        totalDuration: 180,
      })
    );

    authApi.verifyToken.mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      gender: 'male',
      email: 'test@example.com',
      totalSessions: 3,
      totalDuration: 180,
    });

    render(<LivePractice language="en" />);

    await waitFor(() => {
      expect(authApi.verifyToken).toHaveBeenCalledWith({ token: 'test-token' });
    });

    expect(await screen.findByText(/Welcome, Test User/i)).toBeInTheDocument();
  });
});
