// Ticket Types - Shared across client and server

export interface ITicket {
  _id: string;
  eventId: string;
  ticketType: string;
  price: number;
  quantityAvailable: number;
  quantitySold: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create ticket payload
export interface CreateTicketPayload {
  ticketType: string;
  price: number;
  quantityAvailable: number;
  description?: string;
}

// Ticket with availability info
export interface TicketWithAvailability extends ITicket {
  remainingQuantity: number;
  isSoldOut: boolean;
}
