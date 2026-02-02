import api from './api';
import type { ApiResponse } from '@ems/shared';

export interface DashboardStats {
  overview: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalBookings: number;
    totalEvents: number;
    publishedEvents: number;
    upcomingEvents: number;
  };
  charts: {
    revenueByEvent: Array<{
      _id: string;
      eventName: string;
      revenue: number;
      ticketsSold: number;
    }>;
    ticketsByType: Array<{
      ticketType: string;
      count: number;
      revenue: number;
    }>;
    salesOverTime: Array<{
      _id: string;
      revenue: number;
      tickets: number;
    }>;
  };
  recentBookings: Array<{
    _id: string;
    attendee: string;
    event: string;
    ticketType: string;
    quantity: number;
    amount: number;
    date: string;
  }>;
}

export interface EventAnalytics {
  event: {
    _id: string;
    eventName: string;
    eventDate: string;
    status: string;
  };
  overview: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalCapacity: number;
    percentageSold: number;
    checkedIn: number;
    checkInRate: number;
  };
  salesByTicket: Array<{
    ticketType: string;
    price: number;
    available: number;
    sold: number;
    revenue: number;
  }>;
  salesOverTime: Array<{
    _id: string;
    revenue: number;
    tickets: number;
  }>;
}

// Get organizer dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
  return response.data.data;
};

// Get event-specific analytics
export const getEventAnalytics = async (eventId: string): Promise<EventAnalytics> => {
  const response = await api.get<ApiResponse<EventAnalytics>>(`/analytics/events/${eventId}`);
  return response.data.data;
};
