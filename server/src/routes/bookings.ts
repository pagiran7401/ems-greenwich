import { Router } from 'express';
import { authenticate, isOrganizer } from '../middleware/auth';
import {
  createBooking,
  confirmPayment,
  getMyBookings,
  getEventAttendees,
  checkInAttendee,
  stripeWebhook,
} from '../controllers/bookingController';

const router = Router();

// Stripe webhook (must be before other middleware, raw body needed)
router.post('/webhook', stripeWebhook);

// Create booking (authenticated users)
router.post('/', authenticate, createBooking);

// Confirm payment (mock payment flow)
router.post('/:bookingId/confirm', authenticate, confirmPayment);

// Get my bookings (authenticated users)
router.get('/my-bookings', authenticate, getMyBookings);

// Get event attendees (organizer only)
router.get('/event/:eventId/attendees', authenticate, isOrganizer, getEventAttendees);

// Check in attendee (organizer only)
router.put('/checkin/:bookingId', authenticate, isOrganizer, checkInAttendee);

export default router;
