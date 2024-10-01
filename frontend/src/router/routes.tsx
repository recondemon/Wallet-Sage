import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';
import Landing from '../pages/Landing/Landing';
import Home from '../pages/Home/Home';

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
        element: <Home />,
      },
    ],
  },
]);