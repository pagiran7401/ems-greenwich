import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { confirmPayment } from '../services/bookings';

export default function BookingConfirmPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Check if coming from Stripe success
  const sessionId = searchParams.get('session_id');
  const fromStripe = !!sessionId;

  useEffect(() => {
    if (fromStripe && bookingId) {
      // Auto-confirm for Stripe success
      handleConfirm();
    }
  }, [fromStripe, bookingId]);

  const handleConfirm = async () => {
    if (!bookingId) return;

    setIsProcessing(true);
    try {
      await confirmPayment(bookingId, sessionId || `MOCK_${Date.now()}`);
      setIsConfirmed(true);
      toast.success('Payment confirmed! Your booking is complete.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12">
        <div className="card p-12 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Booking Confirmed!</h1>
          <p className="text-surface-600 mb-8">
            Your tickets have been booked successfully. You'll receive a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/my-bookings" className="btn-primary">
              View My Bookings
            </Link>
            <Link to="/events" className="btn-secondary">
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12">
      <div className="card p-12 max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Confirm Payment</h1>
        <p className="text-surface-600 mb-8">
          {fromStripe
            ? 'Processing your payment...'
            : 'Click below to complete your mock payment and confirm your booking.'}
        </p>

        {!fromStripe && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Test Mode:</strong> This is a mock payment. No real charges will be made.
            </p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="btn-primary w-full"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Confirm Payment'
          )}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="btn-ghost w-full mt-3"
          disabled={isProcessing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
