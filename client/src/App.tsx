import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BrowseEventsPage from './pages/BrowseEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import MyEventsPage from './pages/MyEventsPage';
import EditEventPage from './pages/EditEventPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import ManageTicketsPage from './pages/ManageTicketsPage';
import AttendeesPage from './pages/AttendeesPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import ProfilePage from './pages/ProfilePage';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Public event routes */}
        <Route path="events" element={<BrowseEventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />

        {/* Protected routes - any authenticated user */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Profile route */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Booking routes - any authenticated user */}
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="booking/confirm/:bookingId"
          element={
            <ProtectedRoute>
              <BookingConfirmPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="booking/success"
          element={
            <ProtectedRoute>
              <BookingConfirmPage />
            </ProtectedRoute>
          }
        />

        {/* Protected routes - organizer only */}
        <Route
          path="create-event"
          element={
            <ProtectedRoute requiredRole="organizer">
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-events"
          element={
            <ProtectedRoute requiredRole="organizer">
              <MyEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-event/:id"
          element={
            <ProtectedRoute requiredRole="organizer">
              <EditEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="events/:eventId/tickets"
          element={
            <ProtectedRoute requiredRole="organizer">
              <ManageTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="events/:eventId/attendees"
          element={
            <ProtectedRoute requiredRole="organizer">
              <AttendeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute requiredRole="organizer">
              <AnalyticsDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
