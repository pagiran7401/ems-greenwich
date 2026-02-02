import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import { AppError } from '../middleware/errorHandler';
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
      data: event.toJSON() as IEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all published events (with filters)
// @route   GET /api/events
// @access  Public
export const getEvents = async (
  req: Request<{}, {}, {}, EventFilterInput>,
  res: Response<PaginatedResponse<IEvent>>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      category,
      dateFrom,
      dateTo,
      priceMin,
      priceMax,
      status,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'asc',
    } = req.query;

    // Build query - only show published events to public
    const query: any = { status: status || 'published' };

    // Text search
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
      if (dateTo) query.eventDate.$lte = new Date(dateTo);
    } else {
      // By default, only show upcoming events
      query.eventDate = { $gte: new Date() };
    }

    // Build sort
    const sortOptions: any = {};
    switch (sortBy) {
      case 'name':
        sortOptions.eventName = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'date':
      default:
        sortOptions.eventDate = sortOrder === 'asc' ? 1 : -1;
        break;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizerId', 'firstName lastName')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Event.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: events as IEvent[],
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

    res.status(200).json({
      success: true,
      data: event as IEvent,
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
      data: events as IEvent[],
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

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent as IEvent,
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
