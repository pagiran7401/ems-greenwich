// MongoDB Initialization Script
// This runs when the container is first created

db = db.getSiblingDB('ems_db');

// Create collections with validators
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'userType', 'firstName', 'lastName'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'User email - required and unique',
        },
        password: {
          bsonType: 'string',
          description: 'Hashed password - required',
        },
        userType: {
          enum: ['organizer', 'attendee'],
          description: 'User type - must be organizer or attendee',
        },
        firstName: {
          bsonType: 'string',
          description: 'First name - required',
        },
        lastName: {
          bsonType: 'string',
          description: 'Last name - required',
        },
      },
    },
  },
});

db.createCollection('events');
db.createCollection('tickets');
db.createCollection('bookings');
db.createCollection('notifications');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.events.createIndex({ organizerId: 1 });
db.events.createIndex({ eventDate: 1 });
db.events.createIndex({ status: 1 });
db.events.createIndex({ category: 1 });
db.tickets.createIndex({ eventId: 1 });
db.bookings.createIndex({ attendeeId: 1 });
db.bookings.createIndex({ eventId: 1 });
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ createdAt: -1 });

print('EMS Database initialized successfully!');
