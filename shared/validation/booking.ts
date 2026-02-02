import { z } from 'zod';

// Create booking schema
export const createBookingSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  ticketId: z.string().min(1, 'Ticket ID is required'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be at least 1')
    .max(10, 'Cannot book more than 10 tickets at once'),
});

// Payment processing schema (mock)
export const processPaymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

// Check-in schema
export const checkInSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
