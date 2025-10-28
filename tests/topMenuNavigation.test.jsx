import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider } from '../src/contexts/AppContext';
import HomePage from '../src/pages/HomePage';

vi.mock('../src/api', () => ({
  addGalleryImage: vi.fn(),
  updateGalleryImage: vi.fn(),
  addScheduleImage: vi.fn(),
  updateDanPhoto: vi.fn(),
  uploadHeroVideo: vi.fn(),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  getActiveScheduleImage: vi.fn().mockResolvedValue(null),
  getActiveDanPhoto: vi.fn().mockResolvedValue(null),
  getActiveHeroVideo: vi.fn().mockResolvedValue(null),
  getSiteStats: vi.fn().mockResolvedValue(null),
  getAllInstructors: vi.fn().mockResolvedValue([]),
  getAllPracticeSessions: vi.fn().mockResolvedValue([]),
  verifyAdminToken: vi.fn().mockResolvedValue(false),
  adminLogin: vi.fn().mockResolvedValue({}),
  adminLogout: vi.fn().mockResolvedValue({}),
}));
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
});

describe('Top menu navigation anchors', () => {
  it('renders a packages section anchor so navigation can target it', () => {
    render(
      <AppProvider>
        <HomePage />
      </AppProvider>
    );

    vi.runAllTimers();

    const packagesSection = document.getElementById('packages');
    expect(packagesSection).not.toBeNull();
  });
});
