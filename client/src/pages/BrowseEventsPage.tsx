import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IEvent, EventCategory, EventFilterInput } from '@ems/shared';
import { getEvents } from '../services/events';
import { eventCategories } from '@ems/shared';

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

export default function BrowseEventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilterInput>({
    page: 1,
    limit: 12,
    sortBy: 'date',
    sortOrder: 'asc',
    category: searchParams.get('category') as EventCategory || undefined,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getEvents(filters);
      setEvents(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (key: keyof EventFilterInput, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
      page: key === 'page' ? value : 1,
    };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'date',
      sortOrder: 'asc',
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Header */}
      <div className="bg-gradient-hero py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container-custom relative">
          <h1 className="text-display-lg text-white mb-4 animate-fade-in-up">
            Discover Events
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl animate-fade-in-up stagger-1">
            Find amazing events happening near you. From concerts to conferences,
            there's something for everyone.
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filters */}
        <div className="card p-6 mb-8 animate-fade-in-up stagger-2">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[240px]">
              <label className="label">Search Events</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, venue..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-12"
                />
              </div>
            </div>

            {/* Category */}
            <div className="w-48">
              <label className="label">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="input"
              >
                <option value="">All Categories</option>
                {eventCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryConfig[cat]?.emoji} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="w-44">
              <label className="label">From Date</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                className="input"
              />
            </div>

            {/* Sort */}
            <div className="w-48">
              <label className="label">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: sortBy as 'date' | 'name',
                    sortOrder: sortOrder as 'asc' | 'desc',
                  }));
                }}
                className="input"
              >
                <option value="date-asc">Date (Soonest)</option>
                <option value="date-desc">Date (Latest)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>

            {/* Clear */}
            <button onClick={clearFilters} className="btn-ghost">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-600">
            <span className="font-semibold text-surface-900">{pagination.total}</span> event{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-surface-200 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-surface-200 rounded w-1/4" />
                  <div className="h-6 bg-surface-200 rounded w-3/4" />
                  <div className="h-4 bg-surface-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">No events found</h3>
            <p className="text-surface-600 mb-6">
              Try adjusting your filters or check back later for new events.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => handleFilterChange('page', filters.page! - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="btn-secondary disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <span className="text-surface-600">
                  Page <span className="font-semibold text-surface-900">{filters.page}</span> of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handleFilterChange('page', filters.page! + 1)}
                  disabled={!pagination.hasNextPage}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: IEvent; index: number }) {
  const config = categoryConfig[event.category] || categoryConfig.other;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString('en-GB', { month: 'short' }),
      full: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    };
  };

  const dateInfo = formatDate(event.eventDate);

  return (
    <Link
      to={`/events/${event._id}`}
      className="card-interactive group overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className={`relative h-48 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
        {/* Category Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-30 group-hover:scale-110 transition-transform duration-500">
            {config.emoji}
          </span>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white rounded-xl p-2 text-center shadow-soft min-w-[52px]">
          <div className="text-2xl font-bold text-surface-900 leading-none">{dateInfo.day}</div>
          <div className="text-xs font-semibold text-surface-500 uppercase">{dateInfo.month}</div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`badge badge-${event.category}`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.eventName}
        </h3>

        <div className="space-y-2 text-sm text-surface-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{dateInfo.full} at {event.eventTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100">
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.capacity} capacity
          </div>
          <span className="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
