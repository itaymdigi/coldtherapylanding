import { createLazyFileRoute } from '@tanstack/react-router';
import EventSchedulePage from '../pages/EventSchedulePage';

export const Route = createLazyFileRoute('/event-schedule')({
  component: EventSchedulePage,
});
