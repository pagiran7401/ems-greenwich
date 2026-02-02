import { z } from 'zod';

// Event categories enum
export const eventCategories = [
  'music',
  'sports',
  'arts',
  'business',
  'food',
  'health',
  'tech',
  'other',
] as const;

// Event status enum
export const eventStatuses = ['draft', 'published', 'cancelled'] as const;

// Create event schema
export const createEventSchema = z.object({
  eventName: z
    .string()
    .min(1, 'Event name is required')
    .max(200, 'Event name must be less than 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  eventDate: z.string().refine(date => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }, 'Event date must be in the future'),
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),
  venue: z.string().min(1, 'Venue is required').max(200, 'Venue must be less than 200 characters'),
  address: z.string().max(500, 'Address must be less than 500 characters').optional(),
  category: z.enum(eventCategories, {
    errorMap: () => ({ message: 'Invalid event category' }),
  }),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be greater than 0')
    .max(100000, 'Capacity cannot exceed 100,000'),
  status: z.enum(eventStatuses).optional().default('draft'),
});

// Update event schema (all fields optional)
export const updateEventSchema = createEventSchema.partial();

// Event filter schema
export const eventFilterSchema = z.object({
  search: z.string().optional(),
  category: z.enum(eventCategories).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  status: z.enum(eventStatuses).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sortBy: z.enum(['date', 'name', 'price']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Type exports
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFilterInput = z.infer<typeof eventFilterSchema>;
