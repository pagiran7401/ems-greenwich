// Event Types - Shared across client and server

export type EventStatus = 'draft' | 'published' | 'cancelled';

export type EventCategory =
  | 'music'
  | 'sports'
  | 'arts'
  | 'business'
  | 'food'
  | 'health'
  | 'tech'
  | 'other';

export interface IEvent {
  _id: string;
  organizerId: string;
  eventName: string;
  description: string;
  eventDate: Date;
  eventTime: string;
  endTime?: string;
  venue: string;
  address?: string;
  category: EventCategory;
  eventImage?: string;
  capacity: number;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Event with organizer info (for listings)
export interface IEventWithOrganizer extends IEvent {
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  ticketCount?: number;
  minPrice?: number;
}

// Create event payload
export interface CreateEventPayload {
  eventName: string;
  description: string;
  eventDate: string;
  eventTime: string;
  endTime?: string;
  venue: string;
  address?: string;
  category: EventCategory;
  capacity: number;
  status?: EventStatus;
}

// Event search/filter params
export interface EventFilters {
  search?: string;
  category?: EventCategory;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  status?: EventStatus;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
}
