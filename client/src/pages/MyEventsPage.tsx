import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IEvent } from '@ems/shared';
import { getMyEvents, deleteEvent } from '../services/events';

export default function MyEventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'cancelled'>('all');

  const fetchEvents = async () => {
    try {
      const data = await getMyEvents();
      setEvents(data);
    } catch (error: any) {
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      setEvents(events.filter((e) => e._id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const stats = {
    total: events.length,
    draft: events.filter((e) => e.status === 'draft').length,
    published: events.filter((e) => e.status === 'published').length,
    cancelled: events.filter((e) => e.status === 'cancelled').length,
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-hero py-10">
        <div className="container-custom flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-display-md text-white mb-2">My Events</h1>
            <p className="text-primary-200">Manage your events</p>
          </div>
          <Link to="/create-event" className="btn bg-white text-primary-700 hover:bg-primary-50 mt-4 md:mt-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} active={filter === 'all'} onClick={() => setFilter('all')} />
        <StatCard label="Draft" value={stats.draft} active={filter === 'draft'} onClick={() => setFilter('draft')} color="yellow" />
        <StatCard label="Published" value={stats.published} active={filter === 'published'} onClick={() => setFilter('published')} color="green" />
        <StatCard label="Cancelled" value={stats.cancelled} active={filter === 'cancelled'} onClick={() => setFilter('cancelled')} color="red" />
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-6xl block mb-4">📭</span>
          <h3 className="text-xl font-semibold text-surface-900 mb-2">No events yet</h3>
          <p className="text-surface-600 mb-6">
            {filter === 'all'
              ? "You haven't created any events yet."
              : `You don't have any ${filter} events.`}
          </p>
          <Link to="/create-event" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <EventRow key={event._id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  active,
  onClick,
  color = 'blue',
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  color?: 'blue' | 'yellow' | 'green' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        active ? `${colorClasses[color]} ring-2 ring-primary-500` : 'bg-white border-surface-200 hover:border-surface-300'
      }`}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-surface-600">{label}</div>
    </button>
  );
}

function EventRow({ event, onDelete }: { event: IEvent; onDelete: (id: string, name: string) => void }) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const categoryEmojis: Record<string, string> = {
    music: '🎵',
    sports: '⚽',
    arts: '🎨',
    business: '💼',
    food: '🍴',
    health: '💪',
    tech: '💻',
    other: '📌',
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Event Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{categoryEmojis[event.category] || '📌'}</span>
            <h3 className="text-lg font-semibold text-surface-900">{event.eventName}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[event.status]}`}>
              {event.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-surface-600">
            <span>📅 {formatDate(event.eventDate)}</span>
            <span>⏰ {event.eventTime}</span>
            <span>📍 {event.venue}</span>
            <span>👥 {event.capacity} capacity</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/events/${event._id}`}
            className="btn-secondary text-sm"
          >
            View
          </Link>
          <Link
            to={`/edit-event/${event._id}`}
            className="btn-secondary text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(event._id, event.eventName)}
            className="btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
