import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Booking from '../models/Booking';
import Ticket from '../models/Ticket';
import Event from '../models/Event';

// Get organizer dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    // Get all organizer's events
    const events = await Event.find({ organizerId: userId });
    const eventIds = events.map((e) => e._id);

    // Get all completed bookings for organizer's events
    const bookings = await Booking.find({
      eventId: { $in: eventIds },
      paymentStatus: 'completed',
    });

    // Calculate stats
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = bookings.reduce((sum, b) => sum + b.quantity, 0);
    const totalBookings = bookings.length;
    const totalEvents = events.length;
    const publishedEvents = events.filter((e) => e.status === 'published').length;
    const upcomingEvents = events.filter(
      (e) => e.status === 'published' && new Date(e.eventDate) >= new Date()
    ).length;

    // Revenue by event (for bar chart)
    const revenueByEvent = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: '$eventId',
          revenue: { $sum: '$totalAmount' },
          ticketsSold: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $project: {
          eventName: '$event.eventName',
          revenue: 1,
          ticketsSold: 1,
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Tickets by type (for pie chart)
    const ticketsByType = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: 'completed',
        },
      },
      {
        $lookup: {
          from: 'tickets',
          localField: 'ticketId',
          foreignField: '_id',
          as: 'ticket',
        },
      },
      { $unwind: '$ticket' },
      {
        $group: {
          _id: '$ticket.ticketType',
          count: { $sum: '$quantity' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          ticketType: '$_id',
          count: 1,
          revenue: 1,
        },
      },
    ]);

    // Sales over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesOverTime = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: 'completed',
          bookingDate: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' },
          },
          revenue: { $sum: '$totalAmount' },
          tickets: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent bookings
    const recentBookings = await Booking.find({
      eventId: { $in: eventIds },
      paymentStatus: 'completed',
    })
      .populate('attendeeId', 'firstName lastName email')
      .populate('eventId', 'eventName')
      .populate('ticketId', 'ticketType')
      .sort({ bookingDate: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalTicketsSold,
          totalBookings,
          totalEvents,
          publishedEvents,
          upcomingEvents,
        },
        charts: {
          revenueByEvent,
          ticketsByType,
          salesOverTime,
        },
        recentBookings: recentBookings.map((b: any) => ({
          _id: b._id,
          attendee: b.attendeeId
            ? `${b.attendeeId.firstName} ${b.attendeeId.lastName}`
            : 'Unknown',
          event: b.eventId?.eventName || 'Unknown',
          ticketType: b.ticketId?.ticketType || 'Unknown',
          quantity: b.quantity,
          amount: b.totalAmount,
          date: b.bookingDate,
        })),
      },
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

// Get event-specific analytics
export const getEventAnalytics = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?._id;

    // Check event ownership
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.organizerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view analytics' });
    }

    // Get event tickets
    const tickets = await Ticket.find({ eventId });

    // Get bookings
    const bookings = await Booking.find({
      eventId,
      paymentStatus: 'completed',
    });

    // Calculate stats
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = bookings.reduce((sum, b) => sum + b.quantity, 0);
    const totalCapacity = tickets.reduce((sum, t) => sum + t.quantityAvailable, 0);
    const checkedIn = bookings.filter((b) => b.checkInStatus === 'checked_in').length;

    // Sales by ticket type
    const salesByTicket = tickets.map((ticket) => {
      const ticketBookings = bookings.filter(
        (b) => b.ticketId.toString() === ticket._id.toString()
      );
      return {
        ticketType: ticket.ticketType,
        price: ticket.price,
        available: ticket.quantityAvailable,
        sold: ticketBookings.reduce((sum, b) => sum + b.quantity, 0),
        revenue: ticketBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      };
    });

    // Sales over time for this event
    const salesOverTime = await Booking.aggregate([
      {
        $match: {
          eventId: new Types.ObjectId(eventId),
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' },
          },
          revenue: { $sum: '$totalAmount' },
          tickets: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        event: {
          _id: event._id,
          eventName: event.eventName,
          eventDate: event.eventDate,
          status: event.status,
        },
        overview: {
          totalRevenue,
          totalTicketsSold,
          totalCapacity,
          percentageSold: totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0,
          checkedIn,
          checkInRate: totalTicketsSold > 0 ? Math.round((checkedIn / totalTicketsSold) * 100) : 0,
        },
        salesByTicket,
        salesOverTime,
      },
    });
  } catch (error: any) {
    console.error('Event analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch event analytics' });
  }
};
