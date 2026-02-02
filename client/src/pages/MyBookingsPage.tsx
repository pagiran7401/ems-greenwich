import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IBookingWithDetails } from '@ems/shared';
import { getMyBookings } from '../services/bookings';

const categoryConfig: Record<string, { emoji: string; gradient: string }> = {
  music: { emoji: '🎵', gradient: 'from-rose-500 to-pink-600' },
  sports: { emoji: '⚽', gradient: 'from-emerald-500 to-green-600' },
  arts: { emoji: '🎨', gradient: 'from-amber-500 to-orange-600' },
  business: { emoji: '💼', gradient: 'from-blue-500 to-indigo-600' },
  food: { emoji: '🍴', gradient: 'from-red-500 to-rose-600' },
  health: { emoji: '💪', gradient: 'from-teal-500 to-cyan-600' },
  tech: { emoji: '💻', gradient: 'from-violet-500 to-purple-600' },
  other: { emoji: '📌', gradient: 'from-gray-500 to-slate-600' },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<IBookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getMyBookings({
        upcoming: filter === 'upcoming' ? true : filter === 'past' ? false : undefined,
      });
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="container-custom">
          <h1 className="text-display-md text-white mb-2">My Bookings</h1>
          <p className="text-primary-100">View and manage your event tickets</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {(['all', 'upcoming', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-surface-600 hover:bg-surface-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-surface-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-surface-200 rounded w-1/3" />
                    <div className="h-4 bg-surface-200 rounded w-1/4" />
                    <div className="h-4 bg-surface-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center">
              <span className="text-4xl">🎫</span>
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">No bookings yet</h3>
            <p className="text-surface-600 mb-6">
              {filter === 'upcoming'
                ? "You don't have any upcoming events"
                : filter === 'past'
                ? "You haven't attended any events yet"
                : 'Start by browsing and booking events'}
            </p>
            <Link to="/events" className="btn-primary">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const event = booking.event;
              if (!event) return null;

              const config = categoryConfig[event.category] || categoryConfig.other;
              const eventDate = new Date(event.eventDate);
              const isPast = eventDate < new Date();

              return (
                <div key={booking._id} className="card overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Event Image */}
                    <div className={`w-full sm:w-32 h-32 bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-5xl opacity-50">{config.emoji}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`badge badge-${event.category}`}>{event.category}</span>
                            {isPast && <span className="badge bg-surface-200 text-surface-600">Past</span>}
                            <span className={`badge ${
                              booking.paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              booking.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                            {booking.checkInStatus === 'checked_in' && (
                              <span className="badge bg-blue-100 text-blue-700">Checked In</span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-surface-900 mb-1">
                            <Link to={`/events/${event._id}`} className="hover:text-primary-600 transition-colors">
                              {event.eventName}
                            </Link>
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(event.eventDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.eventTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {event.venue}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-surface-500">
                            {booking.quantity}x {booking.ticket?.ticketType}
                          </p>
                          <p className="text-xl font-bold text-surface-900">
                            £{booking.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
