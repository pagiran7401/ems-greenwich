export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container-custom relative">
          <h1 className="text-display-md md:text-display-lg text-white mb-4 animate-fade-in-up">Terms of Service</h1>
          <p className="text-primary-100 text-lg max-w-2xl animate-fade-in-up stagger-1">Last updated: April 2026</p>
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto card p-8 animate-fade-in-up space-y-6">
          {[
            { title: '1. Acceptance of Terms', body: 'By accessing and using EVENTO, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.' },
            { title: '2. User Accounts', body: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your password and for all activities under your account. You must be at least 18 years old to create an organiser account.' },
            { title: '3. Event Organisers', body: 'As an event organiser, you are responsible for providing accurate event information, managing ticket availability, honouring bookings, and complying with all applicable laws and regulations for your events. You must not create misleading or fraudulent event listings.' },
            { title: '4. Attendees', body: "As an attendee, you agree to provide accurate booking information and to comply with event rules and policies set by organisers. Tickets are non-transferable unless explicitly allowed by the event organiser. Refund policies are determined by individual event organisers." },
            { title: '5. Payments', body: 'All payments are processed securely through Stripe. EVENTO does not store payment card information. Prices are displayed in GBP. Organisers are responsible for setting accurate pricing and managing refunds for their events.' },
            { title: '6. Intellectual Property', body: 'The EVENTO platform, including its design, code, and content, is the intellectual property of its creators. Event content (descriptions, images, etc.) remains the property of the respective organisers who created them.' },
            { title: '7. Limitation of Liability', body: 'EVENTO is provided as an academic demonstration project. While we strive to provide a reliable service, we do not guarantee uninterrupted access. EVENTO is not liable for any losses arising from the use of the platform.' },
            { title: '8. Changes to Terms', body: 'We reserve the right to modify these terms at any time. Continued use of EVENTO after changes constitutes acceptance of the updated terms. Users will be notified of significant changes via in-app notifications.' },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-surface-900 mb-3">{section.title}</h2>
              <p className="text-surface-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
