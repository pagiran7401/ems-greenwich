interface EmailLog {
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
}

// In-memory email log for development/testing
const emailLog: EmailLog[] = [];

export function getEmailLog(): EmailLog[] {
  return [...emailLog];
}

export async function sendBookingConfirmationEmail(params: {
  to: string;
  attendeeName: string;
  eventName: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
}): Promise<void> {
  const subject = `Booking Confirmed: ${params.eventName}`;
  const body = [
    `Hi ${params.attendeeName},`,
    '',
    `Your booking for ${params.eventName} has been confirmed!`,
    '',
    `Event Details:`,
    `  Event: ${params.eventName}`,
    `  Date: ${params.eventDate}`,
    `  Venue: ${params.venue}`,
    `  Ticket Type: ${params.ticketType}`,
    `  Quantity: ${params.quantity}`,
    `  Total Amount: ${params.totalAmount > 0 ? `GBP ${params.totalAmount.toFixed(2)}` : 'Free'}`,
    '',
    'Thank you for booking with EVENTO!',
  ].join('\n');

  const entry: EmailLog = {
    to: params.to,
    subject,
    body,
    sentAt: new Date(),
  };

  emailLog.push(entry);

  console.log('\n========================================');
  console.log('  EMAIL SENT (Mock)');
  console.log('========================================');
  console.log(`  To:      ${entry.to}`);
  console.log(`  Subject: ${entry.subject}`);
  console.log('----------------------------------------');
  console.log(entry.body);
  console.log('========================================\n');
}

export async function sendEventCancellationEmail(params: {
  to: string;
  attendeeName: string;
  eventName: string;
}): Promise<void> {
  const subject = `Event Cancelled: ${params.eventName}`;
  const body = [
    `Hi ${params.attendeeName},`,
    '',
    `We regret to inform you that the event "${params.eventName}" has been cancelled.`,
    '',
    'If you had a booking, a refund will be processed automatically.',
    '',
    'We apologize for the inconvenience.',
    '',
    'EVENTO Team',
  ].join('\n');

  const entry: EmailLog = {
    to: params.to,
    subject,
    body,
    sentAt: new Date(),
  };

  emailLog.push(entry);

  console.log('\n========================================');
  console.log('  EMAIL SENT (Mock)');
  console.log('========================================');
  console.log(`  To:      ${entry.to}`);
  console.log(`  Subject: ${entry.subject}`);
  console.log('----------------------------------------');
  console.log(entry.body);
  console.log('========================================\n');
}
