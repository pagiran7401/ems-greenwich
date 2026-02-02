import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Stripe from 'stripe';
import Booking from '../models/Booking';
import Ticket from '../models/Ticket';
import Event from '../models/Event';
import { createBookingSchema } from '@ems/shared';

// Initialize Stripe (test mode)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

// Create booking and initiate payment
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    // Validate input
    const validation = createBookingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { eventId, ticketId, quantity } = validation.data;

    // Check if event exists and is published
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.status !== 'published') {
      return res.status(400).json({ success: false, message: 'Event is not available for booking' });
    }

    // Check if ticket exists and has availability
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || !ticket.isActive) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const remainingQuantity = ticket.quantityAvailable - ticket.quantitySold;
    if (quantity > remainingQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${remainingQuantity} tickets available`,
      });
    }

    // Calculate total
    const totalAmount = ticket.price * quantity;

    // Create booking with pending status
    const booking = await Booking.create({
      attendeeId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      ticketId: new Types.ObjectId(ticketId),
      quantity,
      totalAmount,
      paymentStatus: 'pending',
    });

    // If free ticket, mark as completed immediately
    if (totalAmount === 0) {
      booking.paymentStatus = 'completed';
      booking.transactionId = `FREE_${Date.now()}`;
      await booking.save();

      // Update ticket sold count
      ticket.quantitySold += quantity;
      await ticket.save();

      return res.status(201).json({
        success: true,
        message: 'Free ticket booked successfully',
        data: { booking, checkoutUrl: null },
      });
    }

    // Create Stripe checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${event.eventName} - ${ticket.ticketType}`,
                description: `${quantity}x ticket(s) for ${event.eventName}`,
              },
              unit_amount: Math.round(ticket.price * 100), // Stripe uses pence
            },
            quantity,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/booking/cancel?booking_id=${booking._id}`,
        metadata: {
          bookingId: booking._id.toString(),
          eventId,
          ticketId,
          quantity: quantity.toString(),
        },
      });

      // Store session ID
      booking.transactionId = session.id;
      await booking.save();

      res.status(201).json({
        success: true,
        message: 'Booking created, proceed to payment',
        data: {
          booking,
          checkoutUrl: session.url,
        },
      });
    } catch (stripeError: any) {
      // If Stripe fails (e.g., no API key), use mock payment
      console.log('Stripe unavailable, using mock payment:', stripeError.message);

      const mockTransactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      booking.transactionId = mockTransactionId;
      await booking.save();

      res.status(201).json({
        success: true,
        message: 'Booking created (mock payment mode)',
        data: {
          booking,
          checkoutUrl: null,
          mockPayment: true,
        },
      });
    }
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

// Complete payment (mock or webhook confirmation)
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { transactionId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.json({ success: true, message: 'Payment already completed', data: booking });
    }

    // Update booking status
    booking.paymentStatus = 'completed';
    if (transactionId) {
      booking.transactionId = transactionId;
    }
    await booking.save();

    // Update ticket sold count
    const ticket = await Ticket.findById(booking.ticketId);
    if (ticket) {
      ticket.quantitySold += booking.quantity;
      await ticket.save();
    }

    res.json({
      success: true,
      message: 'Payment confirmed',
      data: booking,
    });
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
};

// Get user's bookings
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { status, upcoming } = req.query;

    const query: any = { attendeeId: userId };

    if (status) {
      query.paymentStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('eventId', 'eventName eventDate eventTime venue eventImage category')
      .populate('ticketId', 'ticketType price')
      .sort({ bookingDate: -1 });

    // Filter for upcoming/past if specified
    let filteredBookings = bookings;
    if (upcoming === 'true') {
      filteredBookings = bookings.filter((b: any) => new Date(b.eventId?.eventDate) >= new Date());
    } else if (upcoming === 'false') {
      filteredBookings = bookings.filter((b: any) => new Date(b.eventId?.eventDate) < new Date());
    }

    // Transform to include event and ticket details
    const bookingsWithDetails = filteredBookings.map((booking: any) => ({
      _id: booking._id,
      quantity: booking.quantity,
      totalAmount: booking.totalAmount,
      bookingDate: booking.bookingDate,
      paymentStatus: booking.paymentStatus,
      checkInStatus: booking.checkInStatus,
      transactionId: booking.transactionId,
      event: booking.eventId ? {
        _id: booking.eventId._id,
        eventName: booking.eventId.eventName,
        eventDate: booking.eventId.eventDate,
        eventTime: booking.eventId.eventTime,
        venue: booking.eventId.venue,
        eventImage: booking.eventId.eventImage,
        category: booking.eventId.category,
      } : null,
      ticket: booking.ticketId ? {
        _id: booking.ticketId._id,
        ticketType: booking.ticketId.ticketType,
        price: booking.ticketId.price,
      } : null,
    }));

    res.json({
      success: true,
      data: bookingsWithDetails,
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Get event attendees (Organizer only)
export const getEventAttendees = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?._id;

    // Check event ownership
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.organizerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view attendees' });
    }

    const bookings = await Booking.find({
      eventId,
      paymentStatus: 'completed',
    })
      .populate('attendeeId', 'firstName lastName email')
      .populate('ticketId', 'ticketType price')
      .sort({ bookingDate: -1 });

    const attendees = bookings.map((booking: any) => ({
      _id: booking._id,
      bookingId: booking._id,
      attendee: booking.attendeeId ? {
        _id: booking.attendeeId._id,
        firstName: booking.attendeeId.firstName,
        lastName: booking.attendeeId.lastName,
        email: booking.attendeeId.email,
      } : null,
      ticketType: booking.ticketId?.ticketType || 'Unknown',
      quantity: booking.quantity,
      totalAmount: booking.totalAmount,
      bookingDate: booking.bookingDate,
      paymentStatus: booking.paymentStatus,
      checkInStatus: booking.checkInStatus,
    }));

    res.json({
      success: true,
      data: attendees,
    });
  } catch (error: any) {
    console.error('Get attendees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendees' });
  }
};

// Check in attendee (Organizer only)
export const checkInAttendee = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id;

    const booking = await Booking.findById(bookingId).populate('eventId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check event ownership
    const event = await Event.findById(booking.eventId);
    if (!event || event.organizerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to check in attendees' });
    }

    // Check payment status
    if (booking.paymentStatus !== 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot check in unpaid booking' });
    }

    // Toggle check-in status
    booking.checkInStatus = booking.checkInStatus === 'checked_in' ? 'not_checked_in' : 'checked_in';
    await booking.save();

    res.json({
      success: true,
      message: `Attendee ${booking.checkInStatus === 'checked_in' ? 'checked in' : 'check-in reversed'}`,
      data: { checkInStatus: booking.checkInStatus },
    });
  } catch (error: any) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, message: 'Failed to check in attendee' });
  }
};

// Stripe webhook handler
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        const booking = await Booking.findById(bookingId);
        if (booking && booking.paymentStatus === 'pending') {
          booking.paymentStatus = 'completed';
          booking.transactionId = session.payment_intent as string;
          await booking.save();

          // Update ticket sold count
          const ticket = await Ticket.findById(booking.ticketId);
          if (ticket) {
            ticket.quantitySold += booking.quantity;
            await ticket.save();
          }
        }
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, message: `Webhook Error: ${error.message}` });
  }
};
