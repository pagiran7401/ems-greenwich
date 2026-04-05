export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container-custom relative">
          <h1 className="text-display-md md:text-display-lg text-white mb-4 animate-fade-in-up">Privacy Policy</h1>
          <p className="text-primary-100 text-lg max-w-2xl animate-fade-in-up stagger-1">Last updated: April 2026</p>
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto card p-8 animate-fade-in-up space-y-6">
          {[
            { title: '1. Information We Collect', body: 'When you create an account on EVENTO, we collect your email address, name, and optional phone number. When you create or book events, we collect event details and booking information. We do not collect payment card details directly \u2014 all payment processing is handled securely by Stripe.' },
            { title: '2. How We Use Your Information', body: 'We use your information to provide and improve our services, including: managing your account, processing bookings, sending notifications about your events and bookings, and providing analytics to event organisers. We do not sell your personal information to third parties.' },
            { title: '3. Data Storage and Security', body: 'Your data is stored securely in our MongoDB database. Passwords are hashed using bcrypt with industry-standard salt rounds. Authentication is handled via JWT tokens with configurable expiry. All API communications use HTTPS in production environments.' },
            { title: '4. Cookies and Local Storage', body: 'EVENTO uses localStorage to maintain your authentication session. We do not use tracking cookies or third-party analytics services. Your session token is stored locally and sent with API requests for authentication purposes only.' },
            { title: '5. Your Rights', body: 'You have the right to access, update, or delete your personal information at any time through your profile settings. You can request a complete export of your data by contacting us. In accordance with GDPR, you may request the deletion of all your personal data.' },
            { title: '6. Contact', body: 'If you have any questions about this Privacy Policy, please contact us at info@evento.com.' },
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
