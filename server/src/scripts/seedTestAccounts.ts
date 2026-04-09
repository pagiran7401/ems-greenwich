/**
 * Seed three idempotent test accounts for User Management verification.
 *
 * Upserts by email, so running repeatedly is safe.
 *
 * Accounts:
 *   1. pagiran@evento.com          — organizer, admin of "Pagiran Events"
 *   2. pagiran+member@evento.com   — organizer, member of same organization
 *   3. pagiran@test.com            — attendee
 *
 * Run: npm run seed:test  (from /server)
 */
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import User from '../models/User';
import Organization from '../models/Organization';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://eventoadmin:eventopassword@localhost:27017/evento_db?authSource=admin';

const PASSWORD = 'Password123!';
const ORG_NAME = 'Pagiran Events';

const ADMIN_EMAIL = 'pagiran@evento.com';
const MEMBER_EMAIL = 'pagiran+member@evento.com';
const ATTENDEE_EMAIL = 'pagiran@test.com';

async function upsertUser(opts: {
  email: string;
  firstName: string;
  lastName: string;
  userType: 'organizer' | 'attendee';
  organizationId?: mongoose.Types.ObjectId | null;
  organizerRole?: 'admin' | 'member' | null;
}) {
  const existing = await User.findOne({ email: opts.email });
  if (existing) {
    existing.firstName = opts.firstName;
    existing.lastName = opts.lastName;
    existing.userType = opts.userType;
    existing.organizationId = opts.organizationId ?? null;
    existing.organizerRole = opts.organizerRole ?? null;
    existing.isActive = true;
    // Always reset password so the seed is a known-good baseline
    existing.password = PASSWORD;
    // Clear any lockout from previous failed attempts
    (existing as any).failedLoginAttempts = 0;
    (existing as any).lockUntil = null;
    await existing.save();
    return existing;
  }
  return await User.create({
    email: opts.email,
    password: PASSWORD,
    firstName: opts.firstName,
    lastName: opts.lastName,
    userType: opts.userType,
    organizationId: opts.organizationId ?? null,
    organizerRole: opts.organizerRole ?? null,
    isActive: true,
  });
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  // Step 1: create admin user (without org yet so we know the _id for ownerId)
  const adminStub = await upsertUser({
    email: ADMIN_EMAIL,
    firstName: 'Pagiran',
    lastName: 'Rabichandran',
    userType: 'organizer',
    organizationId: null, // will set after org creation
    organizerRole: 'admin',
  });

  // Step 2: upsert the Organization, owned by the admin
  let org = await Organization.findOne({ ownerId: adminStub._id });
  if (org) {
    org.name = ORG_NAME;
    await org.save();
  } else {
    org = await Organization.create({ name: ORG_NAME, ownerId: adminStub._id });
  }

  // Step 3: finalize admin's organizationId
  adminStub.organizationId = org._id;
  await adminStub.save();

  // Step 4: member (same org)
  const member = await upsertUser({
    email: MEMBER_EMAIL,
    firstName: 'Member',
    lastName: 'User',
    userType: 'organizer',
    organizationId: org._id,
    organizerRole: 'member',
  });

  // Step 5: attendee (no org)
  const attendee = await upsertUser({
    email: ATTENDEE_EMAIL,
    firstName: 'Test',
    lastName: 'Attendee',
    userType: 'attendee',
    organizationId: null,
    organizerRole: null,
  });

  console.log('=== Test accounts ready ===');
  console.log(`Organization: "${org.name}"  (${org._id})`);
  console.log('');
  console.log('[ADMIN organizer]');
  console.log(`  email:    ${adminStub.email}`);
  console.log(`  password: ${PASSWORD}`);
  console.log(`  role:     admin of ${org.name}`);
  console.log('');
  console.log('[MEMBER organizer]');
  console.log(`  email:    ${member.email}`);
  console.log(`  password: ${PASSWORD}`);
  console.log(`  role:     member of ${org.name}`);
  console.log('');
  console.log('[ATTENDEE]');
  console.log(`  email:    ${attendee.email}`);
  console.log(`  password: ${PASSWORD}`);
  console.log('');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
