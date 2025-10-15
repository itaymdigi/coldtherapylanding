import { createLazyFileRoute } from '@tanstack/react-router';
import BreathingVideosPage from '../pages/BreathingVideosPage';

export const Route = createLazyFileRoute('/breathing-videos')({
  component: BreathingVideosPage,
});
