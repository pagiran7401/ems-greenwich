/**
 * Migration: backfill Organizations for existing organizers and events.
 *
 * - Every existing organizer without an organizationId becomes the admin of a
 *   newly created Organization (name: "{firstName}'s Team").
 * - Every existing event without an organizationId inherits its organizer's org.
 * - Idempotent: safe to re-run.
 *
 * Run: npx tsx server/src/scripts/migrateToOrganizations.ts
 */
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import User from '../models/User';
import Event from '../models/Event';
import Organization from '../models/Organization';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://eventoadmin:eventopassword@localhost:27017/evento_db?authSource=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let orgsCreated = 0;
  let usersUpdated = 0;
  let eventsUpdated = 0;

  // Step 1: ensure every organizer has an Organization + organizerRole=admin
  const organizers = await User.find({ userType: 'organizer' });
  for (const user of organizers) {
    let updated = false;

    if (!user.organizationId) {
      const org = await Organization.create({
        name: `${user.firstName}'s Team`,
        ownerId: user._id,
      });
      user.organizationId = org._id;
      orgsCreated += 1;
      updated = true;
    }

    if (!user.organizerRole) {
      user.organizerRole = 'admin';
      updated = true;
    }

    if (user.isActive === undefined || user.isActive === null) {
      user.isActive = true;
      updated = true;
    }

    if (updated) {
      await user.save();
      usersUpdated += 1;
    }
  }

  // Step 2: ensure every attendee has isActive=true
  await User.updateMany(
    { userType: 'attendee', isActive: { $in: [null, undefined] } },
    { $set: { isActive: true } }
  );

  // Step 3: backfill Event.organizationId from the event's organizer
  const eventsMissingOrg = await Event.find({
    $or: [{ organizationId: null }, { organizationId: { $exists: false } }],
  });

  for (const event of eventsMissingOrg) {
    const organizer = await User.findById(event.organizerId);
    if (organizer?.organizationId) {
      event.organizationId = organizer.organizationId;
      await event.save();
      eventsUpdated += 1;
    } else {
      console.warn(
        `Event ${event._id} (${event.eventName}) has no resolvable organization — skipped`
      );
    }
  }

  console.log('\nMigration complete:');
  console.log(`  Organizations created: ${orgsCreated}`);
  console.log(`  Users updated:         ${usersUpdated}`);
  console.log(`  Events updated:        ${eventsUpdated}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
