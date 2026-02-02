import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
} from '../controllers/eventController';
import { authenticate, isOrganizer } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validate';
import { createEventSchema, updateEventSchema, eventFilterSchema } from '@ems/shared';

const router = Router();

// ============================================================================
// IMPORTANT: Specific routes MUST come before parameterized routes (:id)
// ============================================================================

// GET /api/events/organizer/my-events - Get organizer's own events (PROTECTED)
router.get('/organizer/my-events', authenticate, isOrganizer, getOrganizerEvents);

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

// GET /api/events - Get all published events (with filters)
router.get('/', validateQuery(eventFilterSchema), getEvents);

// GET /api/events/:id - Get single event by ID
router.get('/:id', getEventById);

// ============================================================================
// PROTECTED ROUTES (Authentication required)
// ============================================================================

// POST /api/events - Create new event (Organizer only)
router.post('/', authenticate, isOrganizer, validate(createEventSchema), createEvent);

// PUT /api/events/:id - Update event (Organizer only, own events)
router.put('/:id', authenticate, isOrganizer, validate(updateEventSchema), updateEvent);

// DELETE /api/events/:id - Delete event (Organizer only, own events)
router.delete('/:id', authenticate, isOrganizer, deleteEvent);

export default router;
