// Notification Types - Shared across client and server

export type NotificationType = 'booking_confirmed' | 'event_cancelled' | 'event_updated' | 'general';

export interface INotification {
  _id: string;
  userId: string;
  message: string;
  type: NotificationType;
  read: boolean;
  relatedEventId?: string;
  relatedBookingId?: string;
  createdAt: Date;
}
