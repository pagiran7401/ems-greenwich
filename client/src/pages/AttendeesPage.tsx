import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IEvent, BookingAttendee } from '@ems/shared';
import { getEventById } from '../services/events';
import { getEventAttendees, checkInAttendee } from '../services/bookings';
import { exportToCSV } from '../utils/csvExport';

export default function AttendeesPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [attendees, setAttendees] = useState<BookingAttendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'checked_in' | 'not_checked_in'>('all');

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    if (!eventId) return;
    try {
      const [eventData, attendeesData] = await Promise.all([
        getEventById(eventId),
        getEventAttendees(eventId),
      ]);
      setEvent(eventData);
      setAttendees(attendeesData);
    } catch (error) {
      toast.error('Failed to load attendees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const result = await checkInAttendee(bookingId);
      setAttendees(attendees.map((a) =>
        a.bookingId === bookingId ? { ...a, checkInStatus: result.checkInStatus as any } : a
      ));
      toast.success(result.checkInStatus === 'checked_in' ? 'Checked in!' : 'Check-in reversed');
    } catch (error) {
      toast.error('Failed to update check-in status');
    }
  };

  const filteredAttendees = attendees.filter((a) => {
    const matchesSearch =
      !search ||
      a.attendee?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      a.attendee?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      a.attendee?.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      a.checkInStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const checkedInCount = attendees.filter((a) => a.checkInStatus === 'checked_in').length;
  const totalTickets = attendees.reduce((sum, a) => sum + a.quantity, 0);

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Ticket Type', 'Quantity', 'Total (GBP)', 'Check-in Status', 'Booking Date'];
    const rows = attendees.map((a) => [
      a.attendee?.firstName ?? '',
      a.attendee?.lastName ?? '',
      a.attendee?.email ?? '',
      a.ticketType,
      a.quantity,
      a.totalAmount.toFixed(2),
      a.checkInStatus === 'checked_in' ? 'Checked In' : 'Not Checked In',
      new Date(a.bookingDate).toLocaleDateString('en-GB'),
    ]);
    exportToCSV(`attendees-${eventId}.csv`, headers, rows);
    toast.success('Attendees list exported');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="container-custom">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-200 rounded w-1/3" />
            <div className="card p-6">
              <div className="h-64 bg-surface-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to={`/events/${eventId}`} className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Event
            </Link>
            <h1 className="text-display-sm text-surface-900">Attendees</h1>
            <p className="text-surface-600">{event.eventName}</p>
          </div>
          <button onClick={handleExportCSV} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-surface-600 text-sm mb-1">Total Attendees</p>
            <p className="text-3xl font-bold text-surface-900">{attendees.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-600 text-sm mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-surface-900">{totalTickets}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-600 text-sm mb-1">Checked In</p>
            <p className="text-3xl font-bold text-emerald-600">
              {checkedInCount} <span className="text-lg text-surface-500">/ {attendees.length}</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(['all', 'checked_in', 'not_checked_in'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'checked_in' ? 'Checked In' : 'Not Checked In'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        {filteredAttendees.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">No attendees found</h3>
            <p className="text-surface-600">
              {attendees.length === 0
                ? 'No one has booked tickets yet'
                : 'No attendees match your search'}
            </p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">Attendee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">Ticket</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">Qty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-surface-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee._id} className="hover:bg-surface-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-surface-900">
                            {attendee.attendee?.firstName} {attendee.attendee?.lastName}
                          </p>
                          <p className="text-sm text-surface-500">{attendee.attendee?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-600">{attendee.ticketType}</td>
                      <td className="px-6 py-4 text-surface-600">{attendee.quantity}</td>
                      <td className="px-6 py-4 font-medium text-surface-900">£{attendee.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${
                          attendee.checkInStatus === 'checked_in'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-surface-100 text-surface-600'
                        }`}>
                          {attendee.checkInStatus === 'checked_in' ? 'Checked In' : 'Not Checked In'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCheckIn(attendee.bookingId)}
                          className={`btn text-sm ${
                            attendee.checkInStatus === 'checked_in'
                              ? 'btn-ghost'
                              : 'btn-primary'
                          }`}
                        >
                          {attendee.checkInStatus === 'checked_in' ? 'Undo' : 'Check In'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
