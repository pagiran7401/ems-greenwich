import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className={isHomePage ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  );
}
