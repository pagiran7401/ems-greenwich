/**
 * EVENTO Seed Script
 * Creates organizer "Pagiran Rabichandran" with 10 detailed events
 * Run: npx tsx server/src/scripts/seed.ts
 */
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import User from '../models/User';
import Event from '../models/Event';
import Ticket from '../models/Ticket';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://eventoadmin:eventopassword@localhost:27017/evento_db?authSource=admin';

const events = [
  {
    eventName: 'Greenwich Summer Music Festival 2026',
    description: 'Join us for the biggest music festival in South East London! Featuring over 20 artists across 3 stages, food stalls from local vendors, craft beer tents, and family-friendly activities. From indie rock to electronic beats, there\'s something for every music lover. The festival takes place in the beautiful grounds of Greenwich Park with stunning views of the London skyline. Early bird tickets include a complimentary drink token. VIP guests enjoy exclusive backstage access, premium viewing areas, and a private bar. Don\'t miss headliners including rising UK talent and international acts.',
    eventDate: new Date('2026-07-18'),
    eventTime: '12:00',
    endTime: '23:00',
    venue: 'Greenwich Park',
    address: 'Greenwich Park, London SE10 8QY',
    category: 'music' as const,
    capacity: 5000,
    tickets: [
      { ticketType: 'Early Bird', price: 35, quantityAvailable: 500, description: 'Limited early bird pricing with complimentary drink token' },
      { ticketType: 'General Admission', price: 55, quantityAvailable: 3000, description: 'Full day access to all 3 stages' },
      { ticketType: 'VIP Experience', price: 120, quantityAvailable: 300, description: 'Backstage access, premium viewing, private bar, meet & greet' },
    ],
  },
  {
    eventName: 'London Tech Summit: AI & the Future of Work',
    description: 'The London Tech Summit returns with a focus on Artificial Intelligence and its transformative impact on industries. Hear from CTOs of leading tech companies, participate in hands-on AI workshops, and network with 500+ professionals. Keynote speakers include leaders from DeepMind, Microsoft Research, and OpenAI. Workshop tracks cover: LLM applications in enterprise, responsible AI governance, computer vision in healthcare, and building AI-first products. Lunch and refreshments included. Each attendee receives a digital certificate of participation.',
    eventDate: new Date('2026-06-12'),
    eventTime: '09:00',
    endTime: '18:00',
    venue: 'The O2 Conference Centre',
    address: 'Peninsula Square, London SE10 0DX',
    category: 'tech' as const,
    capacity: 800,
    tickets: [
      { ticketType: 'Conference Pass', price: 149, quantityAvailable: 500, description: 'Full day access to all talks and networking areas' },
      { ticketType: 'Workshop + Conference', price: 249, quantityAvailable: 200, description: 'Conference pass plus hands-on afternoon workshop' },
      { ticketType: 'Student Pass', price: 49, quantityAvailable: 100, description: 'Valid student ID required at check-in' },
    ],
  },
  {
    eventName: 'Greenwich Food & Wine Festival',
    description: 'Celebrate the finest food and wine from around the world at Greenwich\'s annual culinary festival. Over 40 vendors showcasing artisan cheeses, freshly baked sourdough, exotic street food, organic produce, and award-winning wines. Live cooking demonstrations by celebrity chefs every hour. Wine tasting masterclass included with premium tickets. Children\'s cooking workshop available. Located at the historic Greenwich Market with live jazz music throughout the day. Perfect for foodies, families, and anyone who appreciates great cuisine.',
    eventDate: new Date('2026-08-22'),
    eventTime: '10:00',
    endTime: '20:00',
    venue: 'Greenwich Market',
    address: '5B Greenwich Market, London SE10 9HZ',
    category: 'food' as const,
    capacity: 2000,
    tickets: [
      { ticketType: 'General Entry', price: 15, quantityAvailable: 1500, description: 'Access to all food stalls and live demonstrations' },
      { ticketType: 'Tasting Pass', price: 45, quantityAvailable: 400, description: 'General entry plus 10 tasting tokens and wine masterclass' },
      { ticketType: 'Family Pack (4)', price: 40, quantityAvailable: 100, description: '2 adults + 2 children, includes kids cooking workshop' },
    ],
  },
  {
    eventName: 'Thames-Side Art Exhibition: Perspectives',
    description: 'A curated exhibition featuring 30 contemporary artists exploring themes of identity, environment, and urban life. Displayed across three floors of the newly renovated Cutty Sark Gallery, the exhibition includes paintings, sculptures, digital installations, and mixed media works. Opening night features a champagne reception and artist Q&A session. Guided tours available throughout the exhibition period. Special artist-in-residence programme runs alongside, with live creation sessions every weekend. All proceeds support emerging artists through the Greenwich Arts Foundation.',
    eventDate: new Date('2026-05-15'),
    eventTime: '18:00',
    endTime: '22:00',
    venue: 'Cutty Sark Gallery',
    address: 'King William Walk, London SE10 9HT',
    category: 'arts' as const,
    capacity: 300,
    tickets: [
      { ticketType: 'Opening Night', price: 25, quantityAvailable: 150, description: 'Exclusive opening night with champagne reception and artist Q&A' },
      { ticketType: 'General Admission', price: 10, quantityAvailable: 100, description: 'Access to all exhibition floors and guided tour' },
      { ticketType: 'Free Entry', price: 0, quantityAvailable: 50, description: 'Concession - students and seniors (ID required)' },
    ],
  },
  {
    eventName: 'Greenwich Park 10K Run & Family Fun Day',
    description: 'Lace up your running shoes for the annual Greenwich Park 10K! A scenic route through one of London\'s most beautiful Royal Parks, passing the Royal Observatory, the Prime Meridian Line, and offering panoramic views of Canary Wharf. Chip-timed with professional marshals at every kilometre. Post-race celebrations include live music, food trucks, a medal ceremony, and a family fun zone with bouncy castles and face painting. All abilities welcome - from competitive runners to casual joggers. Charity fundraising encouraged with sponsorship forms available.',
    eventDate: new Date('2026-09-06'),
    eventTime: '08:00',
    endTime: '14:00',
    venue: 'Greenwich Park',
    address: 'Greenwich Park, London SE10 8QY',
    category: 'sports' as const,
    capacity: 3000,
    tickets: [
      { ticketType: 'Runner Entry', price: 30, quantityAvailable: 2000, description: 'Chip-timed 10K entry, race pack with t-shirt and medal' },
      { ticketType: 'Spectator + Fun Day', price: 0, quantityAvailable: 800, description: 'Free entry to fun zone, food trucks, and medal ceremony' },
      { ticketType: 'Charity Runner', price: 15, quantityAvailable: 200, description: 'Discounted entry for registered charity fundraisers' },
    ],
  },
  {
    eventName: 'Entrepreneurs Bootcamp: From Idea to MVP',
    description: 'A two-day intensive bootcamp designed for aspiring entrepreneurs. Learn how to validate your business idea, build a minimum viable product, create a pitch deck, and secure seed funding. Led by successful founders who have collectively raised over £50M in funding. Day 1 covers ideation, market research, and business model canvas. Day 2 focuses on product development, user testing, pitch preparation, and a live pitch competition with £5,000 prize. Mentorship from industry experts continues for 3 months after the event. Includes all meals and a coworking space pass.',
    eventDate: new Date('2026-06-28'),
    eventTime: '09:00',
    endTime: '18:00',
    venue: 'University of Greenwich, Dreadnought Building',
    address: '30 Park Row, London SE10 9LS',
    category: 'business' as const,
    capacity: 150,
    tickets: [
      { ticketType: 'Full Bootcamp (2 Days)', price: 199, quantityAvailable: 80, description: 'Complete 2-day programme with meals and 3-month mentorship' },
      { ticketType: 'Day Pass', price: 99, quantityAvailable: 50, description: 'Single day access with lunch included' },
      { ticketType: 'Student Entrepreneur', price: 79, quantityAvailable: 20, description: 'Discounted 2-day pass for current students with valid ID' },
    ],
  },
  {
    eventName: 'Mindfulness & Wellness Retreat',
    description: 'Escape the hustle of city life with a full-day wellness retreat in the tranquil setting of Greenwich. Start with sunrise yoga overlooking the Thames, followed by guided meditation sessions, breathwork workshops, and sound healing with crystal bowls. Enjoy a plant-based lunch prepared by award-winning vegan chef Maya Green. Afternoon sessions include nature walks, journaling workshops, and a talk on stress management in the modern workplace. Take home a wellness goodie bag with essential oils, a yoga mat, and a 30-day mindfulness journal. Suitable for beginners and experienced practitioners.',
    eventDate: new Date('2026-07-04'),
    eventTime: '06:30',
    endTime: '17:00',
    venue: 'The Trafalgar Tavern Gardens',
    address: '6 Park Row, London SE10 9NW',
    category: 'health' as const,
    capacity: 100,
    tickets: [
      { ticketType: 'Full Day Retreat', price: 89, quantityAvailable: 60, description: 'All sessions, plant-based lunch, and wellness goodie bag' },
      { ticketType: 'Morning Session Only', price: 45, quantityAvailable: 30, description: 'Sunrise yoga, meditation, and breathwork (6:30-12:00)' },
      { ticketType: 'Couple\'s Package', price: 150, quantityAvailable: 10, description: 'Two full-day passes with premium goodie bags and couples yoga' },
    ],
  },
  {
    eventName: 'Retro Gaming Night: 80s & 90s Arcade',
    description: 'Step back in time with an evening of retro gaming nostalgia! Over 50 classic arcade machines including Pac-Man, Space Invaders, Street Fighter II, Mortal Kombat, and Donkey Kong. Console stations with N64, SNES, Mega Drive, and PlayStation 1. High score competitions with prizes throughout the night. DJ spinning 80s and 90s hits. Themed cocktails and snacks available at the bar. Dress code: come in your best 80s/90s outfit for a chance to win the costume contest! Perfect for a night out with friends or a unique date night. All games set to free play.',
    eventDate: new Date('2026-05-30'),
    eventTime: '19:00',
    endTime: '01:00',
    venue: 'The Meantime Brewery Tap',
    address: 'Lawrence Trading Estate, Blackwall Lane, London SE10 0AR',
    category: 'other' as const,
    capacity: 250,
    tickets: [
      { ticketType: 'Gamer Pass', price: 20, quantityAvailable: 200, description: 'Free play on all machines, entry to competitions' },
      { ticketType: 'VIP Gamer', price: 40, quantityAvailable: 50, description: 'Priority access, 2 free drinks, exclusive upstairs lounge' },
    ],
  },
  {
    eventName: 'Classical Music Under the Stars',
    description: 'An enchanting evening of classical music performed by the Greenwich Philharmonic Orchestra under the open sky. Programme includes Beethoven\'s Symphony No. 5, Debussy\'s Clair de Lune, and Tchaikovsky\'s Swan Lake Suite. The concert takes place in the stunning grounds of the Old Royal Naval College with the Painted Hall as a breathtaking backdrop. Bring your own picnic blankets or rent premium seating. Pre-concert talk with the conductor at 18:30. Interval refreshments available. Gates open at 18:00 for picnic setup. The concert is weather-dependent with a covered alternative venue available.',
    eventDate: new Date('2026-08-08'),
    eventTime: '19:30',
    endTime: '22:00',
    venue: 'Old Royal Naval College',
    address: 'King William Walk, London SE10 9NN',
    category: 'music' as const,
    capacity: 1500,
    tickets: [
      { ticketType: 'Lawn Ticket', price: 25, quantityAvailable: 1000, description: 'Bring your own blanket and picnic. Open lawn seating.' },
      { ticketType: 'Premium Seated', price: 55, quantityAvailable: 400, description: 'Reserved chair seating with programme booklet' },
      { ticketType: 'Under 16s', price: 0, quantityAvailable: 100, description: 'Free entry for children under 16 (must be accompanied)' },
    ],
  },
  {
    eventName: 'Hackathon: Build for Good',
    description: 'A 24-hour hackathon challenging teams to build technology solutions for social good. This year\'s themes: climate action, healthcare accessibility, and education equity. Form teams of 3-5 or join as an individual and get matched. Mentors from Google, Amazon, and local charities available throughout. Prizes totalling £10,000 including: £5,000 cash for 1st place, cloud credits, and incubator placements. Food, drinks, and energy supplies provided throughout the 24 hours. Sleeping pods available for those who need a power nap. All skill levels welcome - designers, developers, and domain experts needed. Projects must use open-source technologies.',
    eventDate: new Date('2026-10-17'),
    eventTime: '10:00',
    endTime: '10:00',
    venue: 'University of Greenwich, Stockwell Building',
    address: 'University of Greenwich, London SE10 9LS',
    category: 'tech' as const,
    capacity: 200,
    tickets: [
      { ticketType: 'Hacker Pass', price: 0, quantityAvailable: 150, description: 'Full 24-hour access, meals, mentorship, and competition entry' },
      { ticketType: 'Mentor/Judge', price: 0, quantityAvailable: 30, description: 'For industry professionals volunteering as mentors or judges' },
      { ticketType: 'Spectator (Demo Day)', price: 0, quantityAvailable: 20, description: 'Attend the final demo presentations and awards ceremony' },
    ],
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if organizer already exists
    let organizer = await User.findOne({ email: 'pagiran@evento.com' });

    if (!organizer) {
      console.log('Creating organizer: Pagiran Rabichandran...');
      organizer = await User.create({
        email: 'pagiran@evento.com',
        password: 'Pagiran123!',
        userType: 'organizer',
        firstName: 'Pagiran',
        lastName: 'Rabichandran',
        phone: '+44 7911 123456',
      });
      console.log(`Organizer created with ID: ${organizer._id}`);
    } else {
      console.log(`Organizer already exists with ID: ${organizer._id}`);
    }

    // Also create a test attendee
    let attendee = await User.findOne({ email: 'attendee@evento.com' });
    if (!attendee) {
      console.log('Creating test attendee: Test Attendee...');
      attendee = await User.create({
        email: 'attendee@evento.com',
        password: 'Attendee123!',
        userType: 'attendee',
        firstName: 'Alex',
        lastName: 'Thompson',
        phone: '+44 7911 654321',
      });
      console.log(`Test attendee created with ID: ${attendee._id}`);
    }

    // Create events
    for (const eventData of events) {
      const { tickets, ...eventInfo } = eventData;

      // Check if event already exists
      const existing = await Event.findOne({
        organizerId: organizer._id,
        eventName: eventInfo.eventName,
      });

      if (existing) {
        console.log(`Event already exists: ${eventInfo.eventName}`);
        continue;
      }

      console.log(`Creating event: ${eventInfo.eventName}...`);
      const event = await Event.create({
        ...eventInfo,
        organizerId: organizer._id,
        status: 'published',
      });

      // Create tickets for this event
      for (const ticketData of tickets) {
        await Ticket.create({
          ...ticketData,
          eventId: event._id,
        });
      }
      console.log(`  Created ${tickets.length} ticket types`);
    }

    console.log('\n========================================');
    console.log('Seed completed successfully!');
    console.log('========================================');
    console.log('Organizer Login:');
    console.log('  Email: pagiran@evento.com');
    console.log('  Password: Pagiran123!');
    console.log('\nAttendee Login:');
    console.log('  Email: attendee@evento.com');
    console.log('  Password: Attendee123!');
    console.log('========================================\n');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
