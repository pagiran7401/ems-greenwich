import { Router } from 'express';
import { authenticate, isOrganizer } from '../middleware/auth';
import {
  createTicket,
  getEventTickets,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController';

const router = Router();

// Get tickets for an event (public)
router.get('/event/:eventId', getEventTickets);

// Create ticket for an event (organizer only)
router.post('/event/:eventId', authenticate, isOrganizer, createTicket);

// Update ticket (organizer only)
router.put('/:ticketId', authenticate, isOrganizer, updateTicket);

// Delete ticket (organizer only)
router.delete('/:ticketId', authenticate, isOrganizer, deleteTicket);

export default router;
