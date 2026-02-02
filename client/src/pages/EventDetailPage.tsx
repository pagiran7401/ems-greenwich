import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IEvent, TicketWithAvailability } from '@ems/shared';
import { getEventById } from '../services/events';
import { getEventTickets } from '../services/tickets';
import { createBooking } from '../services/bookings';
import { useAuth } from '../context/AuthContext';

const categoryConfig: Record<string, { emoji: string; gradient: string }> = {
  music: { emoji: '🎵', gradient: 'from-rose-500 to-pink-600' },
  sports: { emoji: '⚽', gradient: 'from-emerald-500 to-green-600' },
  arts: { emoji: '🎨', gradient: 'from-amber-500 to-orange-600' },
  business: { emoji: '💼', gradient: 'from-blue-500 to-indigo-600' },
  food: { emoji: '🍴', gradient: 'from-red-500 to-rose-600' },
  health: { emoji: '💪', gradient: 'from-teal-500 to-cyan-600' },
  tech: { emoji: '💻', gradient: 'from-violet-500 to-purple-600' },
  other: { emoji: '📌', gradient: 'from-gray-500 to-slate-600' },
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [tickets, setTickets] = useState<TicketWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [eventData, ticketsData] = await Promise.all([
          getEventById(id),
          getEventTickets(id),
        ]);
        setEvent(eventData);
        setTickets(ticketsData);
      } catch (error) {
        toast.error('Failed to load event');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleBooking = async () => {
    if (!selectedTicket || !id) return;

    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setIsBooking(true);
    try {
      const result = await createBooking({
        eventId: id,
        ticketId: selectedTicket,
        quantity,
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.mockPayment) {
        navigate(`/booking/confirm/${result.booking._id}`);
      } else {
        toast.success('Booking confirmed!');
        navigate('/my-bookings');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const selectedTicketData = tickets.find((t) => t._id === selectedTicket);
  const totalPrice = selectedTicketData ? selectedTicketData.price * quantity : 0;
  const isOwner = user && (event as any)?.organizerId?._id === user._id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 py-12">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-64 bg-surface-200 rounded-2xl mb-8" />
            <div className="h-8 bg-surface-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-surface-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Event not found</h2>
          <Link to="/events" className="btn-primary">Browse Events</Link>
        </div>
      </div>
    );
  }

  const config = categoryConfig[event.category] || categoryConfig.other;
  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <div className={`relative h-72 md:h-96 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[12rem] md:text-[16rem] opacity-20">{config.emoji}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/events" className="btn bg-white/20 backdrop-blur text-white hover:bg-white/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-4">
              <span className={`badge badge-${event.category}`}>{event.category}</span>
              {event.status === 'cancelled' && (
                <span className="badge bg-red-500 text-white">Cancelled</span>
              )}
              {isPast && event.status !== 'cancelled' && (
                <span className="badge bg-surface-500 text-white">Past Event</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {event.eventName}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">About This Event</h2>
              <p className="text-surface-600 whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Date & Location */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">Date & Location</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">
                      {eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-surface-600">{event.eventTime}{event.endTime && ` - ${event.endTime}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">{event.venue}</p>
                    {event.address && <p className="text-surface-600">{event.address}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets Section */}
            {!isOwner && event.status === 'published' && !isPast && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-surface-900 mb-4">Select Tickets</h2>

                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-surface-600">No tickets available yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <label
                        key={ticket._id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedTicket === ticket._id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-surface-200 hover:border-surface-300'
                        } ${ticket.isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name="ticket"
                          value={ticket._id}
                          checked={selectedTicket === ticket._id}
                          onChange={() => !ticket.isSoldOut && setSelectedTicket(ticket._id)}
                          disabled={ticket.isSoldOut}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-surface-900">{ticket.ticketType}</p>
                            {ticket.description && (
                              <p className="text-sm text-surface-600 mt-1">{ticket.description}</p>
                            )}
                            <p className="text-sm text-surface-500 mt-1">
                              {ticket.isSoldOut ? (
                                <span className="text-red-500 font-medium">Sold Out</span>
                              ) : (
                                `${ticket.remainingQuantity} remaining`
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-surface-900">
                              {ticket.price === 0 ? 'Free' : `£${ticket.price.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-surface-900 mb-4">Manage Event</h2>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/edit-event/${event._id}`} className="btn-secondary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Event
                  </Link>
                  <Link to={`/events/${event._id}/tickets`} className="btn-secondary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Manage Tickets
                  </Link>
                  <Link to={`/events/${event._id}/attendees`} className="btn-secondary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View Attendees
                  </Link>
                  <Link to={`/events/${event._id}/analytics`} className="btn-secondary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {event.status === 'cancelled' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">This event has been cancelled</p>
                </div>
              ) : isPast ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-surface-600 font-medium">This event has ended</p>
                </div>
              ) : isOwner ? (
                <div className="text-center py-4">
                  <p className="text-surface-600">You are the organizer of this event</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-surface-900 mb-4">Booking Summary</h3>

                  {selectedTicketData ? (
                    <>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-surface-600">
                          <span>Ticket</span>
                          <span className="font-medium text-surface-900">{selectedTicketData.ticketType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-surface-600">Quantity</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
                            >
                              -
                            </button>
                            <span className="font-semibold w-8 text-center">{quantity}</span>
                            <button
                              onClick={() => setQuantity(Math.min(10, quantity + 1, selectedTicketData.remainingQuantity))}
                              className="w-8 h-8 rounded-lg bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between text-surface-600">
                          <span>Price per ticket</span>
                          <span>{selectedTicketData.price === 0 ? 'Free' : `£${selectedTicketData.price.toFixed(2)}`}</span>
                        </div>
                      </div>

                      <div className="border-t border-surface-200 pt-4 mb-6">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-primary-600">
                            {totalPrice === 0 ? 'Free' : `£${totalPrice.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="btn-primary w-full"
                      >
                        {isBooking ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </span>
                        ) : totalPrice === 0 ? (
                          'Get Free Ticket'
                        ) : (
                          'Proceed to Payment'
                        )}
                      </button>
                    </>
                  ) : (
                    <p className="text-surface-500 text-center py-4">
                      Select a ticket type to continue
                    </p>
                  )}

                  {!isAuthenticated && (
                    <p className="text-sm text-surface-500 text-center mt-4">
                      <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link> to book tickets
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
