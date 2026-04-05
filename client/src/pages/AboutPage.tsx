import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container-custom relative">
          <h1 className="text-display-md md:text-display-lg text-white mb-4 animate-fade-in-up">About EVENTO</h1>
          <p className="text-primary-100 text-lg max-w-2xl animate-fade-in-up stagger-1">
            A modern event management platform built with passion and purpose.
          </p>
        </div>
      </div>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="card p-8 animate-fade-in-up">
            <h2 className="text-display-sm text-surface-900 mb-4">Our Mission</h2>
            <p className="text-surface-600 leading-relaxed text-lg">
              EVENTO is designed to simplify event management for both organisers and attendees.
              Whether you're hosting a small meetup or a large conference, our platform provides
              all the tools you need to create, manage, and attend unforgettable events.
            </p>
          </div>
          <div className="card p-8 animate-fade-in-up stagger-1">
            <h2 className="text-display-sm text-surface-900 mb-4">Project Background</h2>
            <p className="text-surface-600 leading-relaxed mb-4">
              EVENTO was developed as an MSc dissertation project at the{' '}
              <span className="font-semibold text-surface-900">University of Greenwich</span>, London.
              The project demonstrates a production-quality full-stack web application with modern
              technologies and best practices in software engineering.
            </p>
            <p className="text-surface-600 leading-relaxed">
              The system provides end-to-end event lifecycle management including event creation,
              ticket management, booking with payment processing, attendee tracking, real-time
              notifications, analytics dashboards, and comprehensive user profile management.
            </p>
          </div>
          <div className="card p-8 animate-fade-in-up stagger-2">
            <h2 className="text-display-sm text-surface-900 mb-6">The Team</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-glow">PR</div>
              <div>
                <h3 className="text-xl font-semibold text-surface-900">Pagiran Rabichandran</h3>
                <p className="text-surface-600">Developer & Creator</p>
                <p className="text-sm text-surface-500 mt-1">MSc Data Science, University of Greenwich</p>
              </div>
            </div>
          </div>
          <div className="card p-8 animate-fade-in-up stagger-3">
            <h2 className="text-display-sm text-surface-900 mb-6">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'React', emoji: '\u269B\uFE0F', desc: 'Frontend UI' },
                { name: 'Node.js', emoji: '\uD83D\uDFE2', desc: 'Backend Runtime' },
                { name: 'MongoDB', emoji: '\uD83C\uDF43', desc: 'Database' },
                { name: 'TypeScript', emoji: '\uD83D\uDCD8', desc: 'Type Safety' },
                { name: 'Express', emoji: '\uD83D\uDE82', desc: 'API Framework' },
                { name: 'Tailwind CSS', emoji: '\uD83C\uDFA8', desc: 'Styling' },
                { name: 'Docker', emoji: '\uD83D\uDC33', desc: 'Deployment' },
                { name: 'Stripe', emoji: '\uD83D\uDCB3', desc: 'Payments' },
              ].map((tech) => (
                <div key={tech.name} className="p-4 rounded-xl bg-surface-50 border border-surface-100 text-center hover:shadow-soft transition-shadow">
                  <span className="text-2xl block mb-2">{tech.emoji}</span>
                  <p className="font-semibold text-surface-900 text-sm">{tech.name}</p>
                  <p className="text-xs text-surface-500">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center py-8">
            <h2 className="text-display-sm text-surface-900 mb-4">Ready to get started?</h2>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="btn-primary">Create Account</Link>
              <Link to="/events" className="btn-secondary">Browse Events</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
