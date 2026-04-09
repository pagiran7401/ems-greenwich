import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginInput } from '@ems/shared';

interface DemoAccount {
  label: string;
  email: string;
  password: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Organiser (Admin)',
    email: 'pagiran@evento.com',
    password: 'Pagiran123!',
  },
  {
    label: 'Member (Organiser team)',
    email: 'pagiran+member@evento.com',
    password: 'Member123!',
  },
  {
    label: 'Attendee',
    email: 'attendee@evento.com',
    password: 'Attendee123!',
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const fillDemoAccount = (account: DemoAccount) => {
    setValue('email', account.email, { shouldValidate: true, shouldDirty: true });
    setValue('password', account.password, { shouldValidate: true, shouldDirty: true });
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-surface-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-display-sm text-surface-900">Welcome back</h2>
          <p className="mt-2 text-surface-600">
            Sign in to your EVENTO account to continue
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={`input pr-11 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-surface-500 hover:text-surface-700 focus:outline-none focus:text-primary-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-surface-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => toast('Password reset feature coming soon!', { icon: '\uD83D\uDD12' })}
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-surface-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {import.meta.env.DEV && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                Dev only
              </span>
              <span className="text-xs text-surface-500">Demo accounts — click to auto-fill</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map((account) => (
                <div
                  key={account.email}
                  role="button"
                  tabIndex={0}
                  onClick={() => fillDemoAccount(account)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fillDemoAccount(account);
                    }
                  }}
                  className="flex flex-col gap-1.5 p-3 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 hover:border-primary-300 hover:shadow-soft transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <div className="text-sm font-bold text-surface-900">{account.label}</div>

                  <div className="text-[11px] font-mono text-surface-600 break-all leading-snug">
                    {account.email}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-surface-600 break-all leading-snug flex-1">
                      {account.password}
                    </span>
                    <button
                      type="button"
                      aria-label={`Copy password for ${account.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard
                          .writeText(account.password)
                          .then(() => toast.success('Password copied'))
                          .catch(() => toast.error('Copy failed'));
                      }}
                      className="p-1 rounded text-surface-400 hover:text-primary-600 hover:bg-surface-100 flex-shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[10px] text-surface-400 mt-1">Click to auto-fill</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
