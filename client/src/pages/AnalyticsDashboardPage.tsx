import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboardStats, type DashboardStats } from '../services/analytics';
import { exportToCSV } from '../utils/csvExport';

// Chart.js setup - must be imported before chart components
import '../utils/chartSetup';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

// ---------- Color palette ----------
const COLORS = {
  purple: '#5B4FD1',
  purpleLight: '#8B83E0',
  purpleLighter: '#C4BFFF',
  emerald: '#10b981',
  amber: '#F5A623',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  sky: '#0ea5e9',
};

const CHART_PALETTE = [
  COLORS.purple,
  COLORS.emerald,
  COLORS.amber,
  COLORS.rose,
  COLORS.violet,
  COLORS.sky,
  COLORS.purpleLight,
];

// ---------- Shared chart option helpers ----------
const gridColor = '#e2e8f0'; // surface-200

const barOptions: ChartOptions<'bar'> = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `Revenue: \u00A3${Number(ctx.raw).toFixed(2)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: gridColor },
      ticks: {
        callback: (value) => `\u00A3${value}`,
      },
    },
    y: {
      grid: { display: false },
      ticks: {
        font: { size: 12 },
      },
    },
  },
};

const doughnutOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 10,
        font: { size: 12 },
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
          const value = ctx.raw as number;
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${ctx.label}: ${value} (${pct}%)`;
        },
      },
    },
  },
};

const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          if (ctx.dataset.label?.toLowerCase().includes('revenue')) {
            return `Revenue: \u00A3${Number(ctx.raw).toFixed(2)}`;
          }
          return `Tickets: ${ctx.raw}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: gridColor },
      ticks: { font: { size: 11 }, maxRotation: 45 },
    },
    y: {
      type: 'linear' as const,
      position: 'left' as const,
      grid: { color: gridColor },
      ticks: {
        callback: (value) => `\u00A3${value}`,
      },
      title: { display: true, text: 'Revenue (\u00A3)', font: { size: 12 } },
    },
    y1: {
      type: 'linear' as const,
      position: 'right' as const,
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'Tickets', font: { size: 12 } },
      ticks: {
        stepSize: 1,
      },
    },
  },
};

// ---------- Stat Card ----------
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
  textColor: string;
}

function StatCard({ label, value, icon, borderColor, textColor }: StatCardProps) {
  return (
    <div className={`card p-6 border-l-4 ${borderColor}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-surface-500 text-sm">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

// ---------- Download icon SVG ----------
function DownloadIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

// ---------- Main component ----------
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

  // ---- CSV exports ----
  const handleExportRevenue = () => {
    if (!stats) return;
    const headers = ['Event Name', 'Revenue (GBP)', 'Tickets Sold'];
    const rows = stats.charts.revenueByEvent.map((e) => [
      e.eventName,
      e.revenue.toFixed(2),
      e.ticketsSold,
    ]);
    exportToCSV('revenue-by-event.csv', headers, rows);
    toast.success('Revenue report exported');
  };

  const handleExportBookings = () => {
    if (!stats) return;
    const headers = ['Attendee', 'Event', 'Ticket Type', 'Quantity', 'Amount (GBP)', 'Date'];
    const rows = stats.recentBookings.map((b) => [
      b.attendee,
      b.event,
      b.ticketType,
      b.quantity,
      b.amount.toFixed(2),
      new Date(b.date).toLocaleDateString('en-GB'),
    ]);
    exportToCSV('recent-bookings.csv', headers, rows);
    toast.success('Bookings data exported');
  };

  // ---- Loading state ----
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

  // ---- Empty state ----
  if (!stats) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 mb-2">No data available</h2>
          <p className="text-surface-600 mb-6">Start creating events to see analytics</p>
          <Link to="/create-event" className="btn-primary">
            Create Event
          </Link>
        </div>
      </div>
    );
  }

  const { overview, charts, recentBookings } = stats;

  // ---- Chart datasets ----
  const barData = {
    labels: charts.revenueByEvent.map((e) => e.eventName),
    datasets: [
      {
        label: 'Revenue',
        data: charts.revenueByEvent.map((e) => e.revenue),
        backgroundColor: COLORS.purple,
        borderColor: COLORS.purple,
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const doughnutData = {
    labels: charts.ticketsByType.map((t) => t.ticketType),
    datasets: [
      {
        data: charts.ticketsByType.map((t) => t.count),
        backgroundColor: CHART_PALETTE.slice(0, charts.ticketsByType.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const totalTicketCount = charts.ticketsByType.reduce((s, t) => s + t.count, 0);

  const lineData = {
    labels: charts.salesOverTime.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: charts.salesOverTime.map((d) => d.revenue),
        borderColor: COLORS.purple,
        backgroundColor: 'rgba(91, 79, 209, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.purple,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Tickets',
        data: charts.salesOverTime.map((d) => d.tickets),
        borderColor: COLORS.emerald,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: COLORS.emerald,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderDash: [5, 5],
        yAxisID: 'y1',
      },
    ],
  };

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
        {/* Overview Stats - 4 main cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Revenue"
            value={`\u00A3${overview.totalRevenue.toFixed(2)}`}
            icon={<span role="img" aria-label="money">&#x1F4B0;</span>}
            borderColor="border-emerald-500"
            textColor="text-emerald-700"
          />
          <StatCard
            label="Tickets Sold"
            value={overview.totalTicketsSold}
            icon={<span role="img" aria-label="ticket">&#x1F3AB;</span>}
            borderColor="border-blue-500"
            textColor="text-blue-700"
          />
          <StatCard
            label="Total Bookings"
            value={overview.totalBookings}
            icon={<span role="img" aria-label="clipboard">&#x1F4CB;</span>}
            borderColor="border-purple-500"
            textColor="text-purple-700"
          />
          <StatCard
            label="Total Events"
            value={overview.totalEvents}
            icon={<span role="img" aria-label="calendar">&#x1F4C5;</span>}
            borderColor="border-amber-500"
            textColor="text-amber-700"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Published Events</p>
            <p className="text-2xl font-bold text-emerald-600">{overview.publishedEvents}</p>
          </div>
          <div className="card p-6">
            <p className="text-surface-500 text-sm mb-1">Upcoming Events</p>
            <p className="text-2xl font-bold text-primary-600">{overview.upcomingEvents}</p>
          </div>
        </div>

        {/* Charts row: Revenue by Event + Ticket Types */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart: Revenue by Event */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-surface-900">Revenue by Event</h2>
              <button
                onClick={handleExportRevenue}
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <DownloadIcon />
                Export CSV
              </button>
            </div>
            {charts.revenueByEvent.length === 0 ? (
              <div className="text-center py-8 text-surface-500">No sales data yet</div>
            ) : (
              <div style={{ height: Math.max(charts.revenueByEvent.length * 48, 200) }}>
                <Bar data={barData} options={barOptions} />
              </div>
            )}
          </div>

          {/* Doughnut Chart: Sales by Ticket Type */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-6">
              Sales by Ticket Type
            </h2>
            {charts.ticketsByType.length === 0 ? (
              <div className="text-center py-8 text-surface-500">No sales data yet</div>
            ) : (
              <div className="relative" style={{ height: 320 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                {/* Center text showing total */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: 48 }}>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-surface-900">{totalTicketCount}</p>
                    <p className="text-xs text-surface-500">total sold</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Line Chart: Sales Over Time */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-surface-900 mb-6">
            Sales Trend (Last 30 Days)
          </h2>
          {charts.salesOverTime.length === 0 ? (
            <div className="text-center py-8 text-surface-500">No sales data yet</div>
          ) : (
            <div style={{ height: 320 }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">Recent Bookings</h2>
            {recentBookings.length > 0 && (
              <button
                onClick={handleExportBookings}
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <DownloadIcon />
                Export CSV
              </button>
            )}
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-surface-500">No bookings yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">
                      Attendee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-surface-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-surface-50">
                      <td className="px-6 py-4 font-medium text-surface-900">
                        {booking.attendee}
                      </td>
                      <td className="px-6 py-4 text-surface-600">{booking.event}</td>
                      <td className="px-6 py-4 text-surface-600">{booking.ticketType}</td>
                      <td className="px-6 py-4 text-surface-600">{booking.quantity}</td>
                      <td className="px-6 py-4 font-medium text-surface-900">
                        {'\u00A3'}{booking.amount.toFixed(2)}
                      </td>
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
