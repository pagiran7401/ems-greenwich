import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Ticket from '../models/Ticket';
import Event from '../models/Event';
import { createTicketSchema, updateTicketSchema } from '@ems/shared';

// Create ticket for an event (Organizer only)
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?._id;

    // Validate input
    const validation = createTicketSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    // Check if event exists and belongs to the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add tickets to this event' });
    }

    // Create ticket
    const ticket = await Ticket.create({
      eventId: new Types.ObjectId(eventId),
      ...validation.data,
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to create ticket' });
  }
};

// Get all tickets for an event
export const getEventTickets = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const tickets = await Ticket.find({ eventId, isActive: true }).sort({ price: 1 });

    // Add computed fields
    const ticketsWithAvailability = tickets.map((ticket) => ({
      ...ticket.toJSON(),
      remainingQuantity: ticket.quantityAvailable - ticket.quantitySold,
      isSoldOut: ticket.quantitySold >= ticket.quantityAvailable,
    }));

    res.json({
      success: true,
      data: ticketsWithAvailability,
    });
  } catch (error: any) {
    console.error('Get tickets error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

// Update ticket (Organizer only)
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user?._id;

    // Validate input
    const validation = updateTicketSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.flatten().fieldErrors,
      });
    }

    // Find ticket and check ownership
    const ticket = await Ticket.findById(ticketId).populate('eventId');
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const event = await Event.findById(ticket.eventId);
    if (!event || event.organizerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    // Update ticket
    Object.assign(ticket, validation.data);
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    });
  } catch (error: any) {
    console.error('Update ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to update ticket' });
  }
};

// Delete ticket (Organizer only)
export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user?._id;

    // Find ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check ownership
    const event = await Event.findById(ticket.eventId);
    if (!event || event.organizerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this ticket' });
    }

    // Check if tickets have been sold
    if (ticket.quantitySold > 0) {
      // Soft delete - just deactivate
      ticket.isActive = false;
      await ticket.save();
      return res.json({
        success: true,
        message: 'Ticket deactivated (cannot delete sold tickets)',
      });
    }

    // Hard delete if no tickets sold
    await ticket.deleteOne();

    res.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete ticket' });
  }
};
