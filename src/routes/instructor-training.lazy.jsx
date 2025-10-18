import { createLazyFileRoute } from '@tanstack/react-router';
import InstructorTrainingPage from '../pages/InstructorTrainingPage';

export const Route = createLazyFileRoute('/instructor-training')({
  component: InstructorTrainingPage,
});
