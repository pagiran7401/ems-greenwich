import mongoose, { Document, Schema, Types } from 'mongoose';

export type NotificationType = 'booking_confirmed' | 'event_cancelled' | 'event_updated' | 'general';

export interface INotificationDocument extends Document {
  userId: Types.ObjectId;
  message: string;
  type: NotificationType;
  read: boolean;
  relatedEventId?: Types.ObjectId;
  relatedBookingId?: Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['booking_confirmed', 'event_cancelled', 'event_updated', 'general'],
      required: [true, 'Notification type is required'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedEventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
    relatedBookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret._id = ret._id.toString();
        ret.userId = ret.userId.toString();
        if (ret.relatedEventId) ret.relatedEventId = ret.relatedEventId.toString();
        if (ret.relatedBookingId) ret.relatedBookingId = ret.relatedBookingId.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for common queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);

export default Notification;
