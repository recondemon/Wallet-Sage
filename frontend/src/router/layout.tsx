import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <h1>App Layout</h1>
      <Outlet />
    </div>
  );
}