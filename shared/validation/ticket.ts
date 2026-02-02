import { z } from 'zod';

// Create ticket schema
export const createTicketSchema = z.object({
  ticketType: z
    .string()
    .min(1, 'Ticket type name is required')
    .max(100, 'Ticket type must be less than 100 characters'),
  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price cannot exceed 10,000'),
  quantityAvailable: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be at least 1')
    .max(100000, 'Quantity cannot exceed 100,000'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Update ticket schema
export const updateTicketSchema = createTicketSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Type exports
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
