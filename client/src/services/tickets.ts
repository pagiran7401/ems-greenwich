import api from './api';
import type { ITicket, CreateTicketPayload, TicketWithAvailability, ApiResponse } from '@ems/shared';

// Get tickets for an event
export const getEventTickets = async (eventId: string): Promise<TicketWithAvailability[]> => {
  const response = await api.get<ApiResponse<TicketWithAvailability[]>>(`/tickets/event/${eventId}`);
  return response.data.data;
};

// Create ticket (organizer)
export const createTicket = async (eventId: string, data: CreateTicketPayload): Promise<ITicket> => {
  const response = await api.post<ApiResponse<ITicket>>(`/tickets/event/${eventId}`, data);
  return response.data.data;
};

// Update ticket (organizer)
export const updateTicket = async (ticketId: string, data: Partial<CreateTicketPayload & { isActive: boolean }>): Promise<ITicket> => {
  const response = await api.put<ApiResponse<ITicket>>(`/tickets/${ticketId}`, data);
  return response.data.data;
};

// Delete ticket (organizer)
export const deleteTicket = async (ticketId: string): Promise<void> => {
  await api.delete(`/tickets/${ticketId}`);
};
