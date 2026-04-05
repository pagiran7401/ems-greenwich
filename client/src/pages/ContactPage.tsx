import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container-custom relative">
          <h1 className="text-display-md md:text-display-lg text-white mb-4 animate-fade-in-up">Contact Us</h1>
          <p className="text-primary-100 text-lg max-w-2xl animate-fade-in-up stagger-1">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card p-8 animate-fade-in-up">
            <h2 className="text-xl font-semibold text-surface-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Name</label><input type="text" required className="input" placeholder="Your name" /></div>
                <div><label className="label">Email</label><input type="email" required className="input" placeholder="you@example.com" /></div>
              </div>
              <div><label className="label">Subject</label><input type="text" required className="input" placeholder="How can we help?" /></div>
              <div><label className="label">Message</label><textarea required rows={5} className="input resize-none" placeholder="Tell us more..." /></div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">{isSubmitting ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
          <div className="space-y-6 animate-fade-in-up stagger-1">
            {[
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Email', detail: 'info@evento.com' },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Phone', detail: '+44 20 1234 5678' },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <h3 className="font-semibold text-surface-900 mb-1">{item.title}</h3>
                <p className="text-surface-600 text-sm">{item.detail}</p>
              </div>
            ))}
            <div className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="font-semibold text-surface-900 mb-1">Address</h3>
              <p className="text-surface-600 text-sm">University of Greenwich<br />Old Royal Naval College<br />London SE10 9LS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
