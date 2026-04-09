/**
 * Seed the three demo accounts used by the LoginPage quick-fill buttons
 * and the README's Quick Start flow.
 *
 * Idempotent: re-running upserts by email and resets the password.
 *
 * Implementation detail: we always go through `user.save()` so the User
 * model's `pre('save')` hook hashes the password correctly. Using
 * `updateOne` with a plaintext password would bypass the hook and
 * permanently break login.
 *
 * Also one-shot migrates away from the old lockout fields by unsetting
 * `failedLoginAttempts` and `lockUntil` on every user (old data that
 * the current schema no longer declares).
 *
 * Run from /server:  npm run seed:demo
 * Run from root:     npm run seed:demo
 */
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose, { Types } from 'mongoose';
import User from '../models/User';
import Organization from '../models/Organization';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://eventoadmin:eventopassword@localhost:27017/evento_db?authSource=admin';

const ORG_NAME = 'Pagiran Events';

interface DemoAccountSpec {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'organizer' | 'attendee';
  organizerRole: 'admin' | 'member' | null;
}

const ACCOUNTS: DemoAccountSpec[] = [
  {
    email: 'pagiran@evento.com',
    password: 'Pagiran123!',
    firstName: 'Pagiran',
    lastName: 'Rabichandran',
    userType: 'organizer',
    organizerRole: 'admin',
  },
  {
    email: 'pagiran+member@evento.com',
    password: 'Member123!',
    firstName: 'Member',
    lastName: 'User',
    userType: 'organizer',
    organizerRole: 'member',
  },
  {
    email: 'attendee@evento.com',
    password: 'Attendee123!',
    firstName: 'Test',
    lastName: 'Attendee',
    userType: 'attendee',
    organizerRole: null,
  },
];

interface SeedResult {
  email: string;
  status: 'created' | 'updated';
  role: string;
}

async function upsertAccount(
  spec: DemoAccountSpec,
  organizationId: Types.ObjectId | null
): Promise<SeedResult> {
  const existing = await User.findOne({ email: spec.email }).select('+password');
  const roleLabel = spec.organizerRole
    ? `organizer (${spec.organizerRole})`
    : 'attendee';

  if (existing) {
    existing.firstName = spec.firstName;
    existing.lastName = spec.lastName;
    existing.userType = spec.userType;
    existing.organizationId = organizationId;
    existing.organizerRole = spec.organizerRole;
    existing.isActive = true;
    // Setting .password triggers the pre-save hook which bcrypts it.
    existing.password = spec.password;
    await existing.save();
    return { email: spec.email, status: 'updated', role: roleLabel };
  }

  await User.create({
    email: spec.email,
    password: spec.password,
    firstName: spec.firstName,
    lastName: spec.lastName,
    userType: spec.userType,
    organizationId,
    organizerRole: spec.organizerRole,
    isActive: true,
  });
  return { email: spec.email, status: 'created', role: roleLabel };
}

async function run(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  // 1. Purge legacy lockout fields from every user document so stale
  //    values from the old schema can't silently block login.
  const legacy = await User.updateMany(
    {},
    { $unset: { failedLoginAttempts: '', lockUntil: '' } }
  );
  if (legacy.modifiedCount > 0) {
    console.log(`Cleared legacy lockout fields on ${legacy.modifiedCount} user(s)\n`);
  }

  // 2. Ensure the admin exists first so we have an ownerId for the Organization.
  const adminSpec = ACCOUNTS.find((a) => a.organizerRole === 'admin')!;
  const preAdmin = await upsertAccount(adminSpec, null);
  const adminUser = await User.findOne({ email: adminSpec.email });
  if (!adminUser) throw new Error('Admin upsert failed');

  // 3. Upsert the Organization, owned by the admin.
  let org = await Organization.findOne({ ownerId: adminUser._id });
  if (org) {
    org.name = ORG_NAME;
    await org.save();
  } else {
    org = await Organization.create({ name: ORG_NAME, ownerId: adminUser._id });
  }

  // 4. Finalize admin's organizationId (the initial upsert didn't know it yet).
  adminUser.organizationId = org._id;
  await adminUser.save();

  // 5. Upsert the remaining accounts with the now-known org id.
  const memberSpec = ACCOUNTS.find(
    (a) => a.userType === 'organizer' && a.organizerRole === 'member'
  )!;
  const attendeeSpec = ACCOUNTS.find((a) => a.userType === 'attendee')!;

  const memberResult = await upsertAccount(memberSpec, org._id);
  const attendeeResult = await upsertAccount(attendeeSpec, null);

  // 6. Print a clear summary.
  const results: SeedResult[] = [preAdmin, memberResult, attendeeResult];

  console.log('=== Demo accounts ready ===');
  console.log(`Organization: "${org.name}"  (${org._id})\n`);
  for (const r of results) {
    const spec = ACCOUNTS.find((a) => a.email === r.email)!;
    console.log(`[${r.status.toUpperCase()}] ${r.role}`);
    console.log(`  email:    ${spec.email}`);
    console.log(`  password: ${spec.password}`);
    console.log('');
  }

  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
