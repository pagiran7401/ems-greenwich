import { jsPDF } from 'jspdf';
import { generateQRDataURL } from './qrCode';

interface TicketData {
  bookingId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  attendeeName: string;
}

export const downloadPDFTicket = async (data: TicketData) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const ref = data.bookingId.slice(-8).toUpperCase();

  // Header gradient (purple bar)
  doc.setFillColor(91, 33, 182); // primary-700
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('EVENTO', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Event Management Platform', 15, 26);

  // Ticket badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - 55, 10, 42, 18, 3, 3, 'F');
  doc.setTextColor(91, 33, 182);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('E-TICKET', pageWidth - 42, 20, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`REF: ${ref}`, pageWidth - 42, 25, { align: 'center' });

  // Event name
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const eventLines = doc.splitTextToSize(data.eventName, pageWidth - 30);
  doc.text(eventLines, 15, 52);

  // Divider
  const yAfterTitle = 52 + eventLines.length * 7 + 5;
  doc.setDrawColor(220, 220, 220);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, yAfterTitle, pageWidth - 15, yAfterTitle);
  doc.setLineDashPattern([], 0);

  // Details section
  let y = yAfterTitle + 10;
  const addField = (label: string, value: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(label.toUpperCase(), 15, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(value, 15, y + 5);
    y += 14;
  };

  addField('Date & Time', `${data.eventDate} at ${data.eventTime}`);
  addField('Venue', data.venue);

  // Two columns for ticket type and quantity
  const colY = y;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text('TICKET TYPE', 15, colY);
  doc.text('QTY', pageWidth / 2, colY);
  doc.text('TOTAL', pageWidth / 2 + 30, colY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(data.ticketType, 15, colY + 5);
  doc.text(String(data.quantity), pageWidth / 2, colY + 5);
  doc.text(data.totalAmount === 0 ? 'FREE' : `£${data.totalAmount.toFixed(2)}`, pageWidth / 2 + 30, colY + 5);
  y = colY + 16;

  addField('Attendee', data.attendeeName);

  // Divider before QR
  doc.setDrawColor(220, 220, 220);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineDashPattern([], 0);

  // QR Code
  const qrDataUrl = await generateQRDataURL(data.bookingId);
  const qrSize = 35;
  const qrX = (pageWidth - qrSize) / 2;
  doc.addImage(qrDataUrl, 'PNG', qrX, y + 5, qrSize, qrSize);

  // QR label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text('Scan at event for check-in', pageWidth / 2, y + qrSize + 10, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(91, 33, 182);
  doc.text(`Booking Ref: ${ref}`, pageWidth / 2, y + qrSize + 16, { align: 'center' });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text('This is your official e-ticket. Please present this at the event entrance.', pageWidth / 2, footerY, { align: 'center' });

  // Save
  doc.save(`EVENTO-Ticket-${ref}.pdf`);
};
