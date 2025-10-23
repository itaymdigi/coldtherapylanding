import { createRootRoute } from '@tanstack/react-router';
import Layout from '../components/Layout';
import { AppProvider } from '../contexts/AppContext';

export const Route = createRootRoute({
  component: () => (
    <AppProvider>
      <Layout />
    </AppProvider>
  ),
});
