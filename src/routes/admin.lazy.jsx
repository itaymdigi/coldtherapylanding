import { createLazyFileRoute } from '@tanstack/react-router';
import AdminDashboard from '../components/admin/AdminDashboard';

export const Route = createLazyFileRoute('/admin')({
  component: AdminDashboard,
});
