import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IEvent, TicketWithAvailability, CreateTicketPayload } from '@ems/shared';
import { getEventById } from '../services/events';
import { getEventTickets, createTicket, updateTicket, deleteTicket } from '../services/tickets';

export default function ManageTicketsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [tickets, setTickets] = useState<TicketWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketWithAvailability | null>(null);
  const [formData, setFormData] = useState<CreateTicketPayload>({
    ticketType: '',
    price: 0,
    quantityAvailable: 100,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    if (!eventId) return;
    try {
      const [eventData, ticketsData] = await Promise.all([
        getEventById(eventId),
        getEventTickets(eventId),
      ]);
      setEvent(eventData);
      setTickets(ticketsData);
    } catch (error) {
      toast.error('Failed to load event');
      navigate('/my-events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    setIsSubmitting(true);
    try {
      if (editingTicket) {
        await updateTicket(editingTicket._id, formData);
        toast.success('Ticket updated');
      } else {
        await createTicket(eventId, formData);
        toast.success('Ticket created');
      }
      fetchData();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ticket: TicketWithAvailability) => {
    setEditingTicket(ticket);
    setFormData({
      ticketType: ticket.ticketType,
      price: ticket.price,
      quantityAvailable: ticket.quantityAvailable,
      description: ticket.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await deleteTicket(ticketId);
      toast.success('Ticket deleted');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const handleToggleActive = async (ticket: TicketWithAvailability) => {
    try {
      await updateTicket(ticket._id, { isActive: !ticket.isActive });
      toast.success(ticket.isActive ? 'Ticket deactivated' : 'Ticket activated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTicket(null);
    setFormData({
      ticketType: '',
      price: 0,
      quantityAvailable: 100,
      description: '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-8">
        <div className="container-custom">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-200 rounded w-1/3" />
            <div className="card p-6 space-y-4">
              <div className="h-6 bg-surface-200 rounded w-1/4" />
              <div className="h-20 bg-surface-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={`/events/${eventId}`} className="text-primary-600 hover:text-primary-700 text-sm mb-2 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Event
            </Link>
            <h1 className="text-display-sm text-surface-900">Manage Tickets</h1>
            <p className="text-surface-600">{event.eventName}</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Ticket Type
          </button>
        </div>

        {/* Ticket Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50" onClick={resetForm} />
              <div className="card p-6 w-full max-w-md relative z-10">
                <h2 className="text-xl font-semibold text-surface-900 mb-6">
                  {editingTicket ? 'Edit Ticket' : 'Add Ticket Type'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Ticket Type Name</label>
                    <input
                      type="text"
                      value={formData.ticketType}
                      onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                      className="input"
                      placeholder="e.g., General Admission, VIP, Early Bird"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Price (£)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="input"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Quantity Available</label>
                      <input
                        type="number"
                        value={formData.quantityAvailable}
                        onChange={(e) => setFormData({ ...formData, quantityAvailable: parseInt(e.target.value) || 0 })}
                        className="input"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Description (optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input"
                      rows={3}
                      placeholder="What's included with this ticket?"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                      {isSubmitting ? 'Saving...' : editingTicket ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 flex items-center justify-center">
              <span className="text-4xl">🎫</span>
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">No tickets yet</h3>
            <p className="text-surface-600 mb-6">
              Create ticket types for attendees to purchase
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create First Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className={`card p-6 ${!ticket.isActive ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-surface-900">{ticket.ticketType}</h3>
                      {!ticket.isActive && (
                        <span className="badge bg-surface-200 text-surface-600">Inactive</span>
                      )}
                      {ticket.isSoldOut && (
                        <span className="badge bg-red-100 text-red-700">Sold Out</span>
                      )}
                    </div>
                    {ticket.description && (
                      <p className="text-surface-600 mb-3">{ticket.description}</p>
                    )}
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <span className="text-surface-500">Price:</span>
                        <span className="ml-2 font-semibold text-surface-900">
                          {ticket.price === 0 ? 'Free' : `£${ticket.price.toFixed(2)}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-surface-500">Available:</span>
                        <span className="ml-2 font-semibold text-surface-900">{ticket.quantityAvailable}</span>
                      </div>
                      <div>
                        <span className="text-surface-500">Sold:</span>
                        <span className="ml-2 font-semibold text-emerald-600">{ticket.quantitySold}</span>
                      </div>
                      <div>
                        <span className="text-surface-500">Remaining:</span>
                        <span className="ml-2 font-semibold text-surface-900">{ticket.remainingQuantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(ticket)}
                      className="btn-ghost text-sm"
                      title={ticket.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {ticket.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleEdit(ticket)} className="btn-secondary text-sm">
                      Edit
                    </button>
                    {ticket.quantitySold === 0 && (
                      <button onClick={() => handleDelete(ticket._id)} className="btn-danger text-sm">
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-500">Sales Progress</span>
                    <span className="font-medium text-surface-900">
                      {Math.round((ticket.quantitySold / ticket.quantityAvailable) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all"
                      style={{ width: `${(ticket.quantitySold / ticket.quantityAvailable) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
