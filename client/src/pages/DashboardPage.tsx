import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getMyEvents } from '../services/events';
import type { IEvent } from '@ems/shared';

export default function DashboardPage() {
  const { user } = useAuth();
  const isOrganizer = user?.userType === 'organizer';

  return (
    <div className="container-custom py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {isOrganizer
            ? "Here's an overview of your events and performance."
            : 'Discover events and manage your bookings.'}
        </p>
      </div>

      {/* Dashboard Content */}
      {isOrganizer ? <OrganizerDashboard /> : <AttendeeDashboard />}
    </div>
  );
}

function OrganizerDashboard() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: events.length,
    active: events.filter((e) => e.status === 'published').length,
    draft: events.filter((e) => e.status === 'draft').length,
    upcoming: events.filter(
      (e) => e.status === 'published' && new Date(e.eventDate) >= new Date()
    ).length,
  };

  const recentEvents = events.slice(0, 5);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Events"
          value={isLoading ? '-' : String(stats.total)}
          icon="📅"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Published"
          value={isLoading ? '-' : String(stats.active)}
          icon="🎯"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Drafts"
          value={isLoading ? '-' : String(stats.draft)}
          icon="📝"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          title="Upcoming"
          value={isLoading ? '-' : String(stats.upcoming)}
          icon="🚀"
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/create-event" className="btn-primary">
            ➕ Create New Event
          </Link>
          <Link to="/my-events" className="btn-secondary">
            📋 Manage Events
          </Link>
          <Link to="/events" className="btn-secondary">
            🔍 Browse Events
          </Link>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Events</h2>
          <Link to="/my-events" className="text-primary-600 hover:text-primary-700 text-sm">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-2">📭</span>
            <p>No events yet. Create your first event to get started!</p>
            <Link to="/create-event" className="btn-primary mt-4 inline-block">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <RecentEventRow key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AttendeeDashboard() {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Upcoming Events"
          value="0"
          icon="📅"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Past Events"
          value="0"
          icon="✅"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Total Bookings"
          value="0"
          icon="🎫"
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/events" className="btn-primary">
            🔍 Browse Events
          </Link>
          <button className="btn-secondary" disabled>
            📋 My Bookings (Coming Soon)
          </button>
        </div>
      </div>

      {/* Upcoming Bookings Placeholder */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl block mb-2">📭</span>
          <p>No upcoming bookings. Discover events and book your tickets!</p>
          <Link to="/events" className="btn-primary mt-4 inline-block">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function RecentEventRow({ event }: { event: IEvent }) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Link
      to={`/events/${event._id}`}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">📅</div>
        <div>
          <p className="font-medium text-gray-900">{event.eventName}</p>
          <p className="text-sm text-gray-500">
            {formatDate(event.eventDate)} • {event.venue}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[event.status]}`}>
        {event.status}
      </span>
    </Link>
  );
}
