import { createRootRoute } from '@tanstack/react-router';
import { AppProvider } from '../contexts/AppContext';
import Layout from '../components/Layout';

export const Route = createRootRoute({
  component: () => (
    <AppProvider>
      <Layout />
    </AppProvider>
  ),
});
