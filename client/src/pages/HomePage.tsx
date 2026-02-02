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
  { value: '10K+', label: 'Events Hosted' },
  { value: '50K+', label: 'Happy Attendees' },
  { value: '500+', label: 'Organizers' },
  { value: '99%', label: 'Satisfaction' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero noise-overlay">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container-custom relative">
          <div className="py-24 md:py-32 lg:py-40">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in-down">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span className="text-sm text-white/90 font-medium">Discover events near you</span>
              </div>

              {/* Headline */}
              <h1 className="text-display-xl md:text-display-2xl text-white mb-6 animate-fade-in-up">
                Where Moments
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-accent-400 to-primary-300">
                  Become Memories
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1">
                Your premier destination for discovering, organizing, and experiencing
                unforgettable events. From intimate gatherings to grand celebrations.
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

      {/* Categories Section */}
      <section className="section bg-surface-50">
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
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <span className="badge badge-tech mb-4">Why EMS Greenwich</span>
              <h2 className="text-display-md text-surface-900 mb-6">
                Everything you need to create
                <span className="text-gradient"> amazing events</span>
              </h2>
              <p className="text-lg text-surface-600 mb-8">
                Whether you're hosting a small meetup or a large conference, our platform
                provides all the tools you need to make your event a success.
              </p>

              <div className="space-y-6">
                <FeatureItem
                  icon="🎯"
                  title="Easy Event Discovery"
                  description="Powerful search and filtering to find exactly what you're looking for"
                />
                <FeatureItem
                  icon="🎫"
                  title="Seamless Ticketing"
                  description="Multiple ticket types, pricing tiers, and instant booking confirmation"
                />
                <FeatureItem
                  icon="📊"
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
      <section className="py-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-display-md text-white mb-2">{stat.value}</div>
                <div className="text-primary-200">{stat.label}</div>
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
              <h2 className="text-display-md text-surface-900 mb-4">
                Ready to Get Started?
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-xl">🎫</span>
              </div>
              <span className="text-white font-display font-bold">EMS Greenwich</span>
            </div>
            <p className="text-surface-400 text-sm">
              © 2025 EMS Greenwich. MSc Dissertation Project.
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
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-surface-900 mb-1">{title}</h4>
        <p className="text-surface-600">{description}</p>
      </div>
    </div>
  );
}
