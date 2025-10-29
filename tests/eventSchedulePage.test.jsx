import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider } from '../src/contexts/AppContext';
import EventSchedulePage from '../src/pages/EventSchedulePage';

const getActiveScheduleImageMock = vi.hoisted(() => vi.fn());

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('../src/api', () => ({
  addGalleryImage: vi.fn(),
  updateGalleryImage: vi.fn(),
  addScheduleImage: vi.fn(),
  updateDanPhoto: vi.fn(),
  uploadHeroVideo: vi.fn(),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  getActiveScheduleImage: getActiveScheduleImageMock,
  getActiveDanPhoto: vi.fn().mockResolvedValue(null),
  getActiveHeroVideo: vi.fn().mockResolvedValue(null),
  getSiteStats: vi.fn().mockResolvedValue(null),
  getAllInstructors: vi.fn().mockResolvedValue([]),
  getAllPracticeSessions: vi.fn().mockResolvedValue([]),
  verifyAdminToken: vi.fn().mockResolvedValue(false),
  adminLogin: vi.fn().mockResolvedValue({}),
  adminLogout: vi.fn().mockResolvedValue({}),
}));

describe('EventSchedulePage', () => {
  beforeEach(() => {
    getActiveScheduleImageMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    console.error.mockRestore?.();
  });

  it('renders the active schedule image when available', async () => {
    getActiveScheduleImageMock.mockResolvedValue({
      id: '123',
      url: 'https://example.com/schedule.jpg',
      title: 'Weekly Schedule',
    });

    render(
      <AppProvider>
        <EventSchedulePage />
      </AppProvider>
    );

    expect(screen.getByText('טוען לוח אירועים...')).toBeInTheDocument();

    const scheduleImage = await screen.findByRole('img', { name: 'לוח אירועים' });
    expect(scheduleImage).toHaveAttribute('src', 'https://example.com/schedule.jpg');
    expect(screen.queryByText('אין אירועים מתוכננים כרגע. חזרו בקרוב!')).not.toBeInTheDocument();
  });

  it('renders an empty state message when no schedule image exists', async () => {
    getActiveScheduleImageMock.mockResolvedValue(null);

    render(
      <AppProvider>
        <EventSchedulePage />
      </AppProvider>
    );

    expect(screen.getByText('טוען לוח אירועים...')).toBeInTheDocument();

    expect(await screen.findByText('אין אירועים מתוכננים כרגע. חזרו בקרוב!')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'לוח אירועים' })).not.toBeInTheDocument();
  });

  it('renders an error message when loading fails', async () => {
    getActiveScheduleImageMock.mockRejectedValue(new Error('Network error'));

    render(
      <AppProvider>
        <EventSchedulePage />
      </AppProvider>
    );

    expect(screen.getByText('טוען לוח אירועים...')).toBeInTheDocument();

    expect(await screen.findByText('אירעה שגיאה בעת טעינת לוח האירועים. נסו שוב מאוחר יותר.')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'לוח אירועים' })).not.toBeInTheDocument();
  });
});
