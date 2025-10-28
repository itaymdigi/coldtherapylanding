import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LivePractice from '../src/components/sections/LivePractice.jsx';

vi.mock('../src/api/auth.js', () => ({
  getCurrentUser: vi.fn(),
}));

describe('LivePractice section', () => {
  let authApi;

  beforeAll(async () => {
    authApi = await import('../src/api/auth.js');
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('verifies stored token and shows welcome message when valid', async () => {
    authApi.getCurrentUser.mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      gender: 'male',
      email: 'test@example.com',
      totalSessions: 3,
      totalDuration: 180,
    });

    render(<LivePractice language="en" />);

    await waitFor(() => {
      expect(authApi.getCurrentUser).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Welcome, Test User/i)).toBeInTheDocument();
  });
});
