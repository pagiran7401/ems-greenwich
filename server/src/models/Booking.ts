import mongoose, { Document, Schema, Types } from 'mongoose';
import type { IBooking, PaymentStatus, CheckInStatus } from '@ems/shared';

// Extend IBooking for Mongoose document
export interface IBookingDocument extends Omit<IBooking, '_id' | 'attendeeId' | 'eventId' | 'ticketId'>, Document {
  attendeeId: Types.ObjectId;
  eventId: Types.ObjectId;
  ticketId: Types.ObjectId;
}

const bookingSchema = new Schema<IBookingDocument>(
  {
    attendeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Attendee ID is required'],
      index: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Cannot book more than 10 tickets'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    checkInStatus: {
      type: String,
      enum: ['not_checked_in', 'checked_in'],
      default: 'not_checked_in',
    },
    transactionId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret._id = ret._id.toString();
        ret.attendeeId = ret.attendeeId.toString();
        ret.eventId = ret.eventId.toString();
        ret.ticketId = ret.ticketId.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for common queries
bookingSchema.index({ attendeeId: 1, paymentStatus: 1 });
bookingSchema.index({ eventId: 1, paymentStatus: 1 });
bookingSchema.index({ transactionId: 1 });

export const Booking = mongoose.model<IBookingDocument>('Booking', bookingSchema);

export default Booking;
