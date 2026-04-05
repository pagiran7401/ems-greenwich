/**
 * Populate Analytics Script
 * Creates realistic bookings across events to generate meaningful analytics data
 * Run: npx tsx server/src/scripts/populate-analytics.ts
 */
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import User from '../models/User';
import Event from '../models/Event';
import Ticket from '../models/Ticket';
import Booking from '../models/Booking';
import Notification from '../models/Notification';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://eventoadmin:eventopassword@localhost:27017/evento_db?authSource=admin';

// Simulate bookings spread over the last 30 days
function randomPastDate(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 14) + 8); // 8am-10pm
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
}

async function populate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.\n');

    // Get organizer
    const organizer = await User.findOne({ email: 'pagiran@evento.com' });
    if (!organizer) { console.error('Organizer not found'); return; }

    // Create additional attendees if they don't exist
    const attendeeEmails = [
      { email: 'sarah.jones@gmail.com', firstName: 'Sarah', lastName: 'Jones' },
      { email: 'james.wilson@outlook.com', firstName: 'James', lastName: 'Wilson' },
      { email: 'emma.brown@yahoo.com', firstName: 'Emma', lastName: 'Brown' },
      { email: 'michael.davis@gmail.com', firstName: 'Michael', lastName: 'Davis' },
      { email: 'olivia.taylor@hotmail.com', firstName: 'Olivia', lastName: 'Taylor' },
      { email: 'william.anderson@gmail.com', firstName: 'William', lastName: 'Anderson' },
      { email: 'sophia.thomas@outlook.com', firstName: 'Sophia', lastName: 'Thomas' },
      { email: 'daniel.jackson@gmail.com', firstName: 'Daniel', lastName: 'Jackson' },
      { email: 'charlotte.white@yahoo.com', firstName: 'Charlotte', lastName: 'White' },
      { email: 'henry.harris@gmail.com', firstName: 'Henry', lastName: 'Harris' },
      { email: 'amelia.martin@outlook.com', firstName: 'Amelia', lastName: 'Martin' },
      { email: 'oliver.thompson@gmail.com', firstName: 'Oliver', lastName: 'Thompson' },
      { email: 'isabella.garcia@hotmail.com', firstName: 'Isabella', lastName: 'Garcia' },
      { email: 'alexander.martinez@gmail.com', firstName: 'Alexander', lastName: 'Martinez' },
      { email: 'mia.robinson@yahoo.com', firstName: 'Mia', lastName: 'Robinson' },
    ];

    const attendees: any[] = [];
    for (const a of attendeeEmails) {
      let user = await User.findOne({ email: a.email });
      if (!user) {
        user = await User.create({
          email: a.email,
          password: 'Attendee123!',
          userType: 'attendee',
          firstName: a.firstName,
          lastName: a.lastName,
        });
      }
      attendees.push(user);
    }

    // Also add existing attendee
    const existingAttendee = await User.findOne({ email: 'attendee@evento.com' });
    if (existingAttendee) attendees.push(existingAttendee);

    console.log(`${attendees.length} attendees ready.\n`);

    // Get all published events by our organizer
    const events = await Event.find({ organizerId: organizer._id, status: 'published' });
    console.log(`${events.length} published events found.\n`);

    let totalBookings = 0;
    let totalRevenue = 0;

    // For each event, create a realistic number of bookings
    const bookingDistribution: Record<string, number> = {
      'Greenwich Summer Music Festival 2026': 25,
      'London Tech Summit: AI & the Future of Work': 18,
      'Greenwich Food & Wine Festival': 20,
      'Thames-Side Art Exhibition: Perspectives': 12,
      'Greenwich Park 10K Run & Family Fun Day': 22,
      'Entrepreneurs Bootcamp: From Idea to MVP': 10,
      'Mindfulness & Wellness Retreat': 8,
      'Retro Gaming Night: 80s & 90s Arcade': 15,
      'Classical Music Under the Stars': 20,
      'Hackathon: Build for Good': 14,
    };

    for (const event of events) {
      const numBookings = bookingDistribution[event.eventName] || 10;
      const tickets = await Ticket.find({ eventId: event._id, isActive: true });

      if (tickets.length === 0) {
        console.log(`  Skipping ${event.eventName} - no tickets`);
        continue;
      }

      console.log(`Creating ${numBookings} bookings for: ${event.eventName}`);

      // Shuffle attendees for variety
      const shuffled = [...attendees].sort(() => Math.random() - 0.5);

      for (let i = 0; i < numBookings && i < shuffled.length; i++) {
        const attendee = shuffled[i];

        // Check if this attendee already has a booking for this event
        const existingBooking = await Booking.findOne({
          attendeeId: attendee._id,
          eventId: event._id,
          paymentStatus: 'completed',
        });
        if (existingBooking) continue;

        // Pick a random ticket type (weighted towards first/cheapest)
        const ticketIndex = Math.min(
          Math.floor(Math.random() * Math.random() * tickets.length),
          tickets.length - 1
        );
        const ticket = tickets[ticketIndex];

        // Random quantity 1-3
        const quantity = Math.random() < 0.7 ? 1 : Math.random() < 0.8 ? 2 : 3;

        // Check availability
        if (ticket.quantitySold + quantity > ticket.quantityAvailable) continue;

        const totalAmount = ticket.price * quantity;
        const bookingDate = randomPastDate(28); // Last 28 days

        // Create the booking
        const booking = await Booking.create({
          attendeeId: attendee._id,
          eventId: event._id,
          ticketId: ticket._id,
          quantity,
          totalAmount,
          bookingDate,
          paymentStatus: 'completed',
          checkInStatus: Math.random() < 0.3 ? 'checked_in' : 'not_checked_in',
          transactionId: totalAmount === 0
            ? `FREE_${bookingDate.getTime()}`
            : `MOCK_${bookingDate.getTime()}_${Math.random().toString(36).substring(7)}`,
        });

        // Update ticket sold count
        ticket.quantitySold += quantity;
        await ticket.save();

        // Create notification for attendee
        await Notification.create({
          userId: attendee._id,
          message: `Your booking for ${event.eventName} has been confirmed!`,
          type: 'booking_confirmed',
          read: Math.random() < 0.6,
          relatedEventId: event._id,
          relatedBookingId: booking._id,
          createdAt: bookingDate,
        });

        // Create notification for organizer
        await Notification.create({
          userId: organizer._id,
          message: `${attendee.firstName} ${attendee.lastName} booked ${quantity}x ${ticket.ticketType} for ${event.eventName}`,
          type: 'booking_confirmed',
          read: Math.random() < 0.4,
          relatedEventId: event._id,
          relatedBookingId: booking._id,
          createdAt: bookingDate,
        });

        totalBookings++;
        totalRevenue += totalAmount;
      }
    }

    console.log('\n========================================');
    console.log('Analytics Population Complete!');
    console.log('========================================');
    console.log(`Total new bookings created: ${totalBookings}`);
    console.log(`Total revenue generated: £${totalRevenue.toFixed(2)}`);
    console.log(`Attendees used: ${attendees.length}`);
    console.log(`Events populated: ${events.length}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('Population failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

populate();
