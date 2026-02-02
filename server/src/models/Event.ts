import mongoose, { Document, Schema, Types } from 'mongoose';
import type { IEvent, EventStatus, EventCategory } from '@ems/shared';

// Extend IEvent for Mongoose document
export interface IEventDocument extends Omit<IEvent, '_id' | 'organizerId'>, Document {
  organizerId: Types.ObjectId;
}

const eventSchema = new Schema<IEventDocument>(
  {
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer ID is required'],
      index: true,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [200, 'Event name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    eventTime: {
      type: String,
      required: [true, 'Event time is required'],
    },
    endTime: {
      type: String,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      maxlength: [200, 'Venue cannot exceed 200 characters'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['music', 'sports', 'arts', 'business', 'food', 'health', 'tech', 'other'],
      required: [true, 'Category is required'],
      index: true,
    },
    eventImage: {
      type: String,
      default: '',
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [100000, 'Capacity cannot exceed 100,000'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret._id = ret._id.toString();
        ret.organizerId = ret.organizerId.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for common queries
eventSchema.index({ status: 1, eventDate: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ eventName: 'text', description: 'text' });

// Virtual for checking if event is in the past
eventSchema.virtual('isPast').get(function () {
  return new Date(this.eventDate) < new Date();
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function () {
  return new Date(this.eventDate) >= new Date();
});

export const Event = mongoose.model<IEventDocument>('Event', eventSchema);

export default Event;
