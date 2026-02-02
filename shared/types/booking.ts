// Booking Types - Shared across client and server

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type CheckInStatus = 'not_checked_in' | 'checked_in';

export interface IBooking {
  _id: string;
  attendeeId: string;
  eventId: string;
  ticketId: string;
  quantity: number;
  totalAmount: number;
  bookingDate: Date;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking with full details (for attendee view)
export interface IBookingWithDetails extends IBooking {
  event: {
    _id: string;
    eventName: string;
    eventDate: Date;
    eventTime: string;
    venue: string;
    eventImage?: string;
  };
  ticket: {
    _id: string;
    ticketType: string;
    price: number;
  };
}

// Create booking payload
export interface CreateBookingPayload {
  eventId: string;
  ticketId: string;
  quantity: number;
}

// Booking summary for organizer
export interface BookingAttendee {
  _id: string;
  bookingId: string;
  attendee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ticketType: string;
  quantity: number;
  totalAmount: number;
  bookingDate: Date;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
}
