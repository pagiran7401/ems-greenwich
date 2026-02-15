import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import Ticket from '../models/Ticket';
import Booking from '../models/Booking';
import { AppError } from '../middleware/errorHandler';
import { createNotification } from '../utils/notifications';
import type {
  CreateEventInput,
  UpdateEventInput,
  EventFilterInput,
  IEvent,
  ApiResponse,
  PaginatedResponse,
} from '@ems/shared';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer only)
export const createEvent = async (
  req: Request<{}, {}, CreateEventInput>,
  res: Response<ApiResponse<IEvent>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!._id;

    const event = await Event.create({
      ...req.body,
      organizerId,
      eventDate: new Date(req.body.eventDate),
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event.toJSON() as unknown as IEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all published events (with filters)
// @route   GET /api/events
// @access  Public
export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query_params = req.query as Record<string, any>;
    const search = query_params.search as string | undefined;
    const category = query_params.category as string | undefined;
    const dateFrom = query_params.dateFrom as string | undefined;
    const dateTo = query_params.dateTo as string | undefined;
    const priceMin = query_params.priceMin ? Number(query_params.priceMin) : undefined;
    const priceMax = query_params.priceMax ? Number(query_params.priceMax) : undefined;
    const status = query_params.status as string | undefined;
    const page = Number(query_params.page) || 1;
    const limit = Number(query_params.limit) || 20;
    const sortBy = (query_params.sortBy as string) || 'date';
    const sortOrder = (query_params.sortOrder as string) || 'asc';

    // Build query - only show published events to public
    const query: any = { status: status || 'published' };

    // Text search on eventName, description, and venue
    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.eventDate = {};
      if (dateFrom) query.eventDate.$gte = new Date(dateFrom);
      if (dateTo) {
        // Set end of day for dateTo to be inclusive
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.eventDate.$lte = endDate;
      }
    } else {
      // By default, only show upcoming events
      query.eventDate = { $gte: new Date() };
    }

    // If price filtering is needed, first find event IDs that match the price range
    let priceFilteredEventIds: string[] | null = null;
    const hasPriceFilter = priceMin !== undefined || priceMax !== undefined;

    if (hasPriceFilter) {
      const ticketQuery: any = { isActive: true };
      if (priceMin !== undefined && priceMax !== undefined) {
        ticketQuery.price = { $gte: Number(priceMin), $lte: Number(priceMax) };
      } else if (priceMin !== undefined) {
        ticketQuery.price = { $gte: Number(priceMin) };
      } else if (priceMax !== undefined) {
        ticketQuery.price = { $lte: Number(priceMax) };
      }

      const matchingTickets = await Ticket.find(ticketQuery)
        .select('eventId')
        .lean();

      priceFilteredEventIds = [
        ...new Set(matchingTickets.map((t) => t.eventId.toString())),
      ];

      // Add event ID filter to the query
      query._id = { $in: priceFilteredEventIds };
    }

    // Build sort
    const sortOptions: any = {};
    switch (sortBy) {
      case 'name':
        sortOptions.eventName = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'price':
        // Price sorting will be handled post-query after enrichment
        // Default to date for the DB query
        sortOptions.eventDate = 1;
        break;
      case 'date':
      default:
        sortOptions.eventDate = sortOrder === 'asc' ? 1 : -1;
        break;
    }

    // For price sorting, we need to fetch all matching events, enrich, sort, then paginate
    const isPriceSorting = sortBy === 'price';
    const skip = (page - 1) * limit;

    let events: any[];
    let total: number;

    if (isPriceSorting) {
      // Fetch all matching events for price sorting (we need all to sort properly)
      const [allEvents, count] = await Promise.all([
        Event.find(query)
          .populate('organizerId', 'firstName lastName')
          .lean(),
        Event.countDocuments(query),
      ]);
      total = count;

      // Enrich with ticket prices
      const eventIds = allEvents.map((e: any) => e._id);
      const ticketPrices = await Ticket.aggregate([
        { $match: { eventId: { $in: eventIds }, isActive: true } },
        {
          $group: {
            _id: '$eventId',
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]);

      const priceMap = new Map(
        ticketPrices.map((t: any) => [t._id.toString(), { minPrice: t.minPrice, maxPrice: t.maxPrice }])
      );

      const enrichedEvents = allEvents.map((event: any) => {
        const prices = priceMap.get(event._id.toString());
        return {
          ...event,
          minPrice: prices?.minPrice ?? null,
          maxPrice: prices?.maxPrice ?? null,
        };
      });

      // Sort by price
      enrichedEvents.sort((a: any, b: any) => {
        const priceA = a.minPrice ?? (sortOrder === 'asc' ? Infinity : -Infinity);
        const priceB = b.minPrice ?? (sortOrder === 'asc' ? Infinity : -Infinity);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });

      // Paginate
      events = enrichedEvents.slice(skip, skip + limit);
    } else {
      // Standard query with pagination
      [events, total] = await Promise.all([
        Event.find(query)
          .populate('organizerId', 'firstName lastName')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Event.countDocuments(query),
      ]);

      // Enrich events with ticket price information
      const eventIds = events.map((e: any) => e._id);
      const ticketPrices = await Ticket.aggregate([
        { $match: { eventId: { $in: eventIds }, isActive: true } },
        {
          $group: {
            _id: '$eventId',
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]);

      const priceMap = new Map(
        ticketPrices.map((t: any) => [t._id.toString(), { minPrice: t.minPrice, maxPrice: t.maxPrice }])
      );

      events = events.map((event: any) => {
        const prices = priceMap.get(event._id.toString());
        return {
          ...event,
          minPrice: prices?.minPrice ?? null,
          maxPrice: prices?.maxPrice ?? null,
        };
      });
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: events as unknown as IEvent[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<IEvent>>,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'firstName lastName')
      .lean();

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Enrich with ticket price information
    const ticketPrices = await Ticket.aggregate([
      { $match: { eventId: event._id, isActive: true } },
      {
        $group: {
          _id: '$eventId',
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    const enrichedEvent = {
      ...event,
      minPrice: ticketPrices[0]?.minPrice ?? null,
      maxPrice: ticketPrices[0]?.maxPrice ?? null,
    };

    res.status(200).json({
      success: true,
      data: enrichedEvent as unknown as IEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer's own events
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer only)
export const getOrganizerEvents = async (
  req: Request,
  res: Response<ApiResponse<IEvent[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!._id;

    const events = await Event.find({ organizerId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: events as unknown as IEvent[],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer only, own events)
export const updateEvent = async (
  req: Request<{ id: string }, {}, UpdateEventInput>,
  res: Response<ApiResponse<IEvent>>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!._id;

    // Find event and verify ownership
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizerId.toString() !== organizerId.toString()) {
      throw new AppError('Not authorized to update this event', 403);
    }

    // Update event
    const updateData = { ...req.body };
    if (updateData.eventDate) {
      (updateData as any).eventDate = new Date(updateData.eventDate);
    }

    // Check if event is being cancelled
    const isCancelling = updateData.status === 'cancelled' && event.status !== 'cancelled';
    const previousStatus = event.status;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    // Send notifications to attendees with confirmed bookings
    try {
      const confirmedBookings = await Booking.find({
        eventId: req.params.id,
        paymentStatus: 'completed',
      }).select('attendeeId');

      const attendeeIds = [...new Set(confirmedBookings.map(b => b.attendeeId.toString()))];

      if (isCancelling) {
        // Event cancelled - notify all attendees
        for (const attendeeId of attendeeIds) {
          await createNotification({
            userId: attendeeId,
            message: `The event ${event.eventName} has been cancelled`,
            type: 'event_cancelled',
            relatedEventId: req.params.id,
          });
        }
      } else if (attendeeIds.length > 0) {
        // Event updated - notify all attendees
        for (const attendeeId of attendeeIds) {
          await createNotification({
            userId: attendeeId,
            message: `${event.eventName} has been updated. Check the latest details.`,
            type: 'event_updated',
            relatedEventId: req.params.id,
          });
        }
      }
    } catch (notifError) {
      // Don't let notification failures break the update flow
      console.error('Failed to send event update notifications:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent as unknown as IEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer only, own events)
export const deleteEvent = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const organizerId = req.user!._id;

    // Find event and verify ownership
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (event.organizerId.toString() !== organizerId.toString()) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    // TODO: Check for existing bookings before allowing delete
    // For now, just delete the event
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
