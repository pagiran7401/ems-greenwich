import Notification from '../models/Notification';
import type { NotificationType } from '../models/Notification';
import { emitNotification } from '../config/socket';

export async function createNotification(params: {
  userId: string;
  message: string;
  type: NotificationType;
  relatedEventId?: string;
  relatedBookingId?: string;
}): Promise<void> {
  try {
    const notification = await Notification.create({
      userId: params.userId,
      message: params.message,
      type: params.type,
      relatedEventId: params.relatedEventId || undefined,
      relatedBookingId: params.relatedBookingId || undefined,
    });

    // Emit real-time notification via Socket.io
    emitNotification(params.userId, {
      _id: notification._id,
      message: notification.message,
      type: notification.type,
      read: false,
      createdAt: notification.createdAt,
      relatedEventId: notification.relatedEventId,
      relatedBookingId: notification.relatedBookingId,
    });
  } catch (error) {
    // Log but don't throw - notifications should not break main flow
    console.error('Failed to create notification:', error);
  }
}
