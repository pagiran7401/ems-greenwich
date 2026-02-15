import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = [
  { id: 'music', emoji: '🎵', label: 'Music', color: 'from-rose-500 to-pink-600' },
  { id: 'sports', emoji: '⚽', label: 'Sports', color: 'from-emerald-500 to-green-600' },
  { id: 'arts', emoji: '🎨', label: 'Arts', color: 'from-amber-500 to-orange-600' },
  { id: 'business', emoji: '💼', label: 'Business', color: 'from-blue-500 to-indigo-600' },
  { id: 'tech', emoji: '💻', label: 'Tech', color: 'from-violet-500 to-purple-600' },
  { id: 'food', emoji: '🍴', label: 'Food', color: 'from-red-500 to-rose-600' },
];

const stats = [
  { value: '10K+', label: 'Events Hosted', icon: '📅' },
  { value: '50K+', label: 'Happy Attendees', icon: '🎉' },
  { value: '500+', label: 'Organizers', icon: '👤' },
  { value: '99%', label: 'Satisfaction', icon: '⭐' },
];

const steps = [
  {
    number: '01',
    title: 'Browse Events',
    description: 'Explore a curated selection of events happening near you. Filter by category, date, or location.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Book Tickets',
    description: 'Select your tickets, choose your quantity, and complete your booking in seconds.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Enjoy the Experience',
    description: 'Show up, check in, and create unforgettable memories at amazing events.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero noise-overlay">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-warm-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-primary-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container-custom relative">
          <div className="py-32 md:py-40 lg:py-48">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-down">
                <span className="w-2 h-2 rounded-full bg-warm-400 animate-pulse-soft" />
                <span className="text-sm text-white/90 font-medium">Discover your next experience</span>
              </div>

              {/* Headline */}
              <h1 className="text-display-xl md:text-display-2xl text-white mb-6 animate-fade-in-up">
                Where Moments
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-warm-400 to-primary-300">
                  Become Memories
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1">
                The modern platform for discovering, organizing, and experiencing
                unforgettable events. Free for organizers, seamless for attendees.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
                <Link
                  to="/events"
                  className="btn bg-white text-primary-700 hover:bg-primary-50 hover:shadow-soft-xl px-8 py-4 text-base"
                >
                  Explore Events
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20 px-8 py-4 text-base"
                  >
                    Start Organizing
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafafa"/>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-surface-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-100 text-warm-700 text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-display-md text-surface-900 mb-4">
              Three simple steps to your next event
            </h2>
            <p className="text-surface-600 max-w-2xl mx-auto">
              Whether you are attending or organizing, EVENTO makes it effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="card p-8 text-center h-full hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-bold shadow-glow">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-5 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                    {step.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-surface-900 mb-3">{step.title}</h3>
                  <p className="text-surface-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Connector arrow (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-display-md text-surface-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-surface-600 max-w-2xl mx-auto">
              From music festivals to tech conferences, find events that match your interests
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/events?category=${category.id}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-interactive p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{category.emoji}</span>
                  </div>
                  <span className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
                    {category.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-surface-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">
                Why EVENTO
              </span>
              <h2 className="text-display-md text-surface-900 mb-6">
                Everything you need to create
                <span className="text-gradient"> amazing events</span>
              </h2>
              <p className="text-lg text-surface-600 mb-8">
                Whether you are hosting a small meetup or a large conference, our platform
                provides all the tools you need to make your event a success.
              </p>

              <div className="space-y-6">
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  title="Easy Event Discovery"
                  description="Powerful search and filtering to find exactly what you are looking for"
                />
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  }
                  title="Seamless Ticketing"
                  description="Multiple ticket types, pricing tiers, and instant booking confirmation"
                />
                <FeatureItem
                  icon={
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  title="Real-time Analytics"
                  description="Track sales, attendance, and engagement with detailed insights"
                />
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-mesh rounded-3xl" />
              <div className="relative grid grid-cols-2 gap-4 p-8">
                <div className="space-y-4">
                  <div className="card p-6 animate-float">
                    <div className="text-4xl mb-2">🎵</div>
                    <h4 className="font-semibold">Live Concert</h4>
                    <p className="text-sm text-surface-500">Tonight at 8 PM</p>
                  </div>
                  <div className="card p-6 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="text-4xl mb-2">💼</div>
                    <h4 className="font-semibold">Tech Meetup</h4>
                    <p className="text-sm text-surface-500">50 attending</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="card p-6 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="text-4xl mb-2">🎨</div>
                    <h4 className="font-semibold">Art Exhibition</h4>
                    <p className="text-sm text-surface-500">Free entry</p>
                  </div>
                  <div className="card p-6 animate-float" style={{ animationDelay: '3s' }}>
                    <div className="text-4xl mb-2">⚽</div>
                    <h4 className="font-semibold">Football Match</h4>
                    <p className="text-sm text-surface-500">Tickets available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-warm-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative">
          <div className="text-center mb-12">
            <h2 className="text-display-md text-white mb-3">Trusted by thousands</h2>
            <p className="text-primary-200">Join a growing community of event organizers and attendees</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-display-md text-white mb-1">{stat.value}</div>
                <div className="text-warm-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-surface-50">
        <div className="container-custom">
          <div className="card p-12 md:p-16 text-center bg-gradient-mesh relative overflow-hidden">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-100 text-warm-700 text-sm font-semibold mb-6">
                Get Started Today
              </div>
              <h2 className="text-display-md text-surface-900 mb-4">
                Ready to create something unforgettable?
              </h2>
              <p className="text-lg text-surface-600 mb-8 max-w-xl mx-auto">
                Join thousands of event organizers and attendees. Create your account
                and start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary px-8 py-4 text-base">
                  Create Free Account
                </Link>
                <Link to="/events" className="btn-secondary px-8 py-4 text-base">
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface-900">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-white font-display font-bold text-lg tracking-tight">EVENTO</span>
            </div>
            <div className="flex items-center gap-6 text-surface-400 text-sm">
              <Link to="/events" className="hover:text-white transition-colors">Browse Events</Link>
              <Link to="/register" className="hover:text-white transition-colors">Get Started</Link>
            </div>
            <p className="text-surface-500 text-sm">
              &copy; 2026 EVENTO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-surface-900 mb-1">{title}</h4>
        <p className="text-surface-600">{description}</p>
      </div>
    </div>
  );
}
