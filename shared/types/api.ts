// API Response Types - Shared across client and server

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Error response
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Analytics types
export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  recentBookings: number;
}

export interface EventAnalytics {
  eventId: string;
  eventName: string;
  ticketsSold: number;
  revenue: number;
  checkInRate: number;
}
