import api from './api';
import type {
  IEvent,
  CreateEventInput,
  UpdateEventInput,
  EventFilterInput,
  ApiResponse,
  PaginatedResponse,
} from '@ems/shared';

// Get all published events (public)
export const getEvents = async (filters?: EventFilterInput): Promise<PaginatedResponse<IEvent>> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const response = await api.get<PaginatedResponse<IEvent>>(`/events?${params.toString()}`);
  return response.data;
};

// Get single event by ID (public)
export const getEventById = async (id: string): Promise<IEvent> => {
  const response = await api.get<ApiResponse<IEvent>>(`/events/${id}`);
  return response.data.data!;
};

// Get organizer's own events (protected)
export const getMyEvents = async (): Promise<IEvent[]> => {
  const response = await api.get<ApiResponse<IEvent[]>>('/events/organizer/my-events');
  return response.data.data!;
};

// Create new event (protected - organizer only)
export const createEvent = async (data: CreateEventInput): Promise<IEvent> => {
  const response = await api.post<ApiResponse<IEvent>>('/events', data);
  return response.data.data!;
};

// Update event (protected - organizer only)
export const updateEvent = async (id: string, data: UpdateEventInput): Promise<IEvent> => {
  const response = await api.put<ApiResponse<IEvent>>(`/events/${id}`, data);
  return response.data.data!;
};

// Delete event (protected - organizer only)
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};
