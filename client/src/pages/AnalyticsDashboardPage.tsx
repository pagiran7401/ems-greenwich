import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboardStats, type DashboardStats } from '../services/analytics';

export default function AnalyticsDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-200 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="h-4 bg-surface-200 rounded w-1/2 mb-2" />
                  <div className="h-8 bg-surface-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 mb-2">No data available</h2>
          <p className="text-surface-600 mb-6">Start creating events to see analytics</p>
          <Link to="/create-event" className="btn-primary">Create Event</Link>
        </div>
      </div>
    );
  }

  const { overview, charts, recentBookings } = stats;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="container-custom">
          <h1 className="text-display-md text-white mb-2">Analytics Dashboard</h1>
          <p className="text-primary-100">Track your event performance and sales</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-surface-900">£{overview.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Tickets Sold</p>
            <p className="text-2xl font-bold text-surface-900">{overview.totalTicketsSold}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-surface-900">{overview.totalBookings}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Total Events</p>
            <p className="text-2xl font-bold text-surface-900">{overview.totalEvents}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Published</p>
            <p className="text-2xl font-bold text-emerald-600">{overview.publishedEvents}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Upcoming</p>
            <p className="text-2xl font-bold text-primary-600">{overview.upcomingEvents}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue by Event */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-6">Revenue by Event</h2>
            {charts.revenueByEvent.length === 0 ? (
              <div className="text-center py-8 text-surface-500">No sales data yet</div>
            ) : (
              <div className="space-y-4">
                {charts.revenueByEvent.map((event, index) => {
                  const maxRevenue = Math.max(...charts.revenueByEvent.map((e) => e.revenue));
                  const percentage = maxRevenue > 0 ? (event.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={event._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-surface-900 truncate pr-4">{event.eventName}</span>
                        <span className="text-surface-600">£{event.revenue.toFixed(2)}</span>
                      </div>
                      <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-surface-500 mt-1">{event.ticketsSold} tickets sold</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tickets by Type */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-6">Sales by Ticket Type</h2>
            {charts.ticketsByType.length === 0 ? (
              <div className="text-center py-8 text-surface-500">No sales data yet</div>
            ) : (
              <div className="space-y-4">
                {charts.ticketsByType.map((ticket, index) => {
                  const colors = ['bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
                  const totalCount = charts.ticketsByType.reduce((sum, t) => sum + t.count, 0);
                  const percentage = totalCount > 0 ? (ticket.count / totalCount) * 100 : 0;

                  return (
                    <div key={ticket.ticketType} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-surface-900">{ticket.ticketType}</span>
                          <span className="text-surface-600">{ticket.count} sold</span>
                        </div>
                        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors[index % colors.length]} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-semibold text-surface-900">£{ticket.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sales Over Time */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-surface-900 mb-6">Sales Trend (Last 30 Days)</h2>
          {charts.salesOverTime.length === 0 ? (
            <div className="text-center py-8 text-surface-500">No sales data yet</div>
          ) : (
            <div className="h-48 flex items-end gap-1">
              {charts.salesOverTime.map((day, index) => {
                const maxRevenue = Math.max(...charts.salesOverTime.map((d) => d.revenue));
                const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;

                return (
                  <div
                    key={day._id}
                    className="flex-1 group relative"
                    title={`${day._id}: £${day.revenue.toFixed(2)} (${day.tickets} tickets)`}
                  >
                    <div
                      className="bg-primary-500 hover:bg-primary-600 rounded-t transition-all cursor-pointer"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-900 text-white text-xs rounded whitespace-nowrap transition-opacity">
                      £{day.revenue.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-surface-100">
            <h2 className="text-lg font-semibold text-surface-900">Recent Bookings</h2>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-surface-500">No bookings yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">Attendee</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">Event</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">Ticket</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">Qty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-surface-50">
                      <td className="px-6 py-4 font-medium text-surface-900">{booking.attendee}</td>
                      <td className="px-6 py-4 text-surface-600">{booking.event}</td>
                      <td className="px-6 py-4 text-surface-600">{booking.ticketType}</td>
                      <td className="px-6 py-4 text-surface-600">{booking.quantity}</td>
                      <td className="px-6 py-4 font-medium text-surface-900">£{booking.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-surface-500">
                        {new Date(booking.date).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
