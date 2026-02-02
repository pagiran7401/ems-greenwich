import api from './api';
import type {
  IBooking,
  IBookingWithDetails,
  CreateBookingPayload,
  BookingAttendee,
  ApiResponse
} from '@ems/shared';

interface CreateBookingResponse {
  booking: IBooking;
  checkoutUrl: string | null;
  mockPayment?: boolean;
}

// Create booking
export const createBooking = async (data: CreateBookingPayload): Promise<CreateBookingResponse> => {
  const response = await api.post<ApiResponse<CreateBookingResponse>>('/bookings', data);
  return response.data.data;
};

// Confirm payment (mock flow)
export const confirmPayment = async (bookingId: string, transactionId?: string): Promise<IBooking> => {
  const response = await api.post<ApiResponse<IBooking>>(`/bookings/${bookingId}/confirm`, { transactionId });
  return response.data.data;
};

// Get my bookings
export const getMyBookings = async (filters?: { status?: string; upcoming?: boolean }): Promise<IBookingWithDetails[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.upcoming !== undefined) params.append('upcoming', String(filters.upcoming));

  const response = await api.get<ApiResponse<IBookingWithDetails[]>>(`/bookings/my-bookings?${params}`);
  return response.data.data;
};

// Get event attendees (organizer)
export const getEventAttendees = async (eventId: string): Promise<BookingAttendee[]> => {
  const response = await api.get<ApiResponse<BookingAttendee[]>>(`/bookings/event/${eventId}/attendees`);
  return response.data.data;
};

// Check in attendee (organizer)
export const checkInAttendee = async (bookingId: string): Promise<{ checkInStatus: string }> => {
  const response = await api.put<ApiResponse<{ checkInStatus: string }>>(`/bookings/checkin/${bookingId}`);
  return response.data.data;
};
