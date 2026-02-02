import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOrganizer = user?.userType === 'organizer';

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-primary-600'
        : 'text-surface-600 hover:text-surface-900'
    }`;

  const activeIndicator = (path: string) =>
    isActive(path) && (
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
    );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <span className="text-xl">🎫</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold text-surface-900">EMS</span>
              <span className="text-lg font-display font-bold text-primary-600"> Greenwich</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/events" className={navLinkClass('/events')}>
              Browse Events
              {activeIndicator('/events')}
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                  {activeIndicator('/dashboard')}
                </Link>
                <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>
                  My Bookings
                  {activeIndicator('/my-bookings')}
                </Link>
              </>
            )}
            {isAuthenticated && isOrganizer && (
              <>
                <Link to="/my-events" className={navLinkClass('/my-events')}>
                  My Events
                  {activeIndicator('/my-events')}
                </Link>
                <Link to="/analytics" className={navLinkClass('/analytics')}>
                  Analytics
                  {activeIndicator('/analytics')}
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-900">{user?.firstName}</p>
                    <p className="text-xs text-surface-500 capitalize">{user?.userType}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>

                {isOrganizer && (
                  <Link to="/create-event" className="btn-primary hidden lg:flex">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </Link>
                )}

                <button onClick={logout} className="btn-ghost text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <svg className="w-6 h-6 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-100 animate-fade-in-down">
            <div className="flex flex-col gap-2">
              <Link
                to="/events"
                className="px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Events
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  {isOrganizer && (
                    <>
                      <Link
                        to="/my-events"
                        className="px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Events
                      </Link>
                      <Link
                        to="/analytics"
                        className="px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Analytics
                      </Link>
                      <Link
                        to="/create-event"
                        className="px-4 py-2 rounded-lg hover:bg-surface-100 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Event
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
