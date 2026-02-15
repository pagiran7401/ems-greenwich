import Notification from '../models/Notification';
import type { NotificationType } from '../models/Notification';

export async function createNotification(params: {
  userId: string;
  message: string;
  type: NotificationType;
  relatedEventId?: string;
  relatedBookingId?: string;
}): Promise<void> {
  try {
    await Notification.create({
      userId: params.userId,
      message: params.message,
      type: params.type,
      relatedEventId: params.relatedEventId || undefined,
      relatedBookingId: params.relatedBookingId || undefined,
    });
  } catch (error) {
    // Log but don't throw - notifications should not break main flow
    console.error('Failed to create notification:', error);
  }
}
