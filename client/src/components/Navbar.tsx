import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isOrganizer = user?.userType === 'organizer';
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? isHomePage && !scrolled ? 'text-white' : 'text-primary-600'
        : isHomePage && !scrolled
          ? 'text-white/80 hover:text-white'
          : 'text-surface-600 hover:text-surface-900'
    }`;

  const activeIndicator = (path: string) =>
    isActive(path) && (
      <span className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
        isHomePage && !scrolled ? 'bg-white' : 'bg-primary-600'
      }`} />
    );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHomePage
        ? 'bg-white/95 backdrop-blur-lg border-b border-surface-100 shadow-soft'
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={`text-xl font-display font-bold tracking-tight transition-colors duration-300 ${
              isHomePage && !scrolled ? 'text-white' : 'text-surface-900'
            }`}>
              EVENTO
            </span>
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
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <NotificationBell />

                {/* User Info */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-medium transition-colors ${
                      isHomePage && !scrolled ? 'text-white' : 'text-surface-900'
                    }`}>{user?.firstName}</p>
                    <p className={`text-xs capitalize transition-colors ${
                      isHomePage && !scrolled ? 'text-white/60' : 'text-surface-500'
                    }`}>{user?.userType}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-glow transition-shadow"
                  >
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </Link>
                </div>

                {isOrganizer && (
                  <Link to="/create-event" className="btn-primary hidden lg:flex">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </Link>
                )}

                <button onClick={logout} className={`btn text-sm ${
                  isHomePage && !scrolled
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'btn-ghost'
                }`}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`btn text-sm ${
                  isHomePage && !scrolled
                    ? 'bg-transparent text-white hover:bg-white/10'
                    : 'btn-ghost'
                }`}>
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
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isHomePage && !scrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className={`md:hidden py-4 border-t animate-fade-in-down ${
            isHomePage && !scrolled
              ? 'border-white/10 bg-primary-950/90 backdrop-blur-lg rounded-b-2xl'
              : 'border-surface-100 bg-white'
          }`}>
            <div className="flex flex-col gap-2">
              <Link
                to="/events"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-surface-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Events
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-surface-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-surface-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  {isOrganizer && (
                    <>
                      <Link
                        to="/my-events"
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-surface-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Events
                      </Link>
                      <Link
                        to="/analytics"
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-surface-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Analytics
                      </Link>
                      <Link
                        to="/create-event"
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'hover:bg-surface-100'
                        }`}
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
