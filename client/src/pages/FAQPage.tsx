import { useState } from 'react';

const faqs = [
  { q: 'How do I create an event?', a: "Register as an Organiser, then click \"Create Event\" from your dashboard or navigation bar. Fill in the event details including name, description, date, venue, and category. You can save it as a draft and publish when ready." },
  { q: 'How does payment work?', a: "EVENTO uses Stripe in test mode for payment processing. For free events, bookings are confirmed instantly. For paid events, you'll be redirected to a secure checkout. In test mode, use card number 4242 4242 4242 4242 with any future expiry date." },
  { q: 'Can I cancel my booking?', a: "Booking cancellation is available through the My Bookings page. Navigate to the booking you wish to cancel and click the cancel button. Refunds for paid bookings will be processed according to the event's cancellation policy." },
  { q: 'Is EVENTO free to use?', a: 'Yes! EVENTO is completely free for both organisers and attendees. There are no platform fees, listing fees, or hidden charges. Organisers can create unlimited events and sell tickets without any commission.' },
  { q: 'How do I check in attendees?', a: "As an organiser, go to your event's Attendees page. You can search for attendees by name or email and toggle their check-in status. You can also use the QR code lookup to quickly check in attendees by entering their booking reference." },
  { q: 'What event categories are available?', a: 'EVENTO supports 8 event categories: Music, Sports, Arts, Business, Food, Health, Tech, and Other. Choose the category that best fits your event to help attendees discover it through browsing and filtering.' },
  { q: 'Can I edit my event after publishing?', a: "Yes, you can edit your event details at any time from the My Events page. Click the edit button on any event to update its information. Attendees will be notified of any significant changes to events they've booked." },
  { q: 'How do I view my analytics?', a: 'Organisers can access the Analytics Dashboard from the navigation bar. It shows total revenue, tickets sold, sales trends over time, and per-event breakdowns. You can also export data as CSV for further analysis.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container-custom relative">
          <h1 className="text-display-md md:text-display-lg text-white mb-4 animate-fade-in-up">Frequently Asked Questions</h1>
          <p className="text-primary-100 text-lg max-w-2xl animate-fade-in-up stagger-1">Everything you need to know about using EVENTO.</p>
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-50 transition-colors">
                <span className="font-semibold text-surface-900 pr-4">{faq.q}</span>
                <svg className={`w-5 h-5 text-surface-400 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-surface-600 leading-relaxed border-t border-surface-100 pt-4">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
