import mongoose, { Document, Schema, Types } from 'mongoose';
import type { ITicket } from '@ems/shared';

// Extend ITicket for Mongoose document
export interface ITicketDocument extends Omit<ITicket, '_id' | 'eventId'>, Document {
  eventId: Types.ObjectId;
}

const ticketSchema = new Schema<ITicketDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    ticketType: {
      type: String,
      required: [true, 'Ticket type is required'],
      trim: true,
      maxlength: [100, 'Ticket type cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [10000, 'Price cannot exceed 10,000'],
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [100000, 'Quantity cannot exceed 100,000'],
    },
    quantitySold: {
      type: Number,
      default: 0,
      min: [0, 'Quantity sold cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret._id = ret._id.toString();
        ret.eventId = ret.eventId.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for common queries
ticketSchema.index({ eventId: 1, isActive: 1 });

// Virtual for remaining quantity
ticketSchema.virtual('remainingQuantity').get(function () {
  return this.quantityAvailable - this.quantitySold;
});

// Virtual for checking if sold out
ticketSchema.virtual('isSoldOut').get(function () {
  return this.quantitySold >= this.quantityAvailable;
});

export const Ticket = mongoose.model<ITicketDocument>('Ticket', ticketSchema);

export default Ticket;
