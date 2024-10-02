import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';
import Landing from '../pages/Landing/Landing';
import Dashboard from '../pages/Dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/home',
        element: <Dashboard />,
      },
    ],
  },
]);