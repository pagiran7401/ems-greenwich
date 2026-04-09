import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterInput } from '@ems/shared';

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: 'attendee',
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      await registerUser(data);
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
          <h2 className="text-display-sm text-surface-900">Create an account</h2>
          <p className="mt-2 text-surface-600">
            Join EVENTO to discover and manage events
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* User Type Selection */}
            <div>
              <label className="label">I want to</label>
              <div className="flex gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    value="attendee"
                    {...register('userType')}
                    className="sr-only peer"
                  />
                  <div className="p-4 border-2 rounded-xl cursor-pointer text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:border-surface-300 transition-colors">
                    <span className="text-2xl block mb-1">🎟️</span>
                    <span className="font-medium text-surface-900">Attend Events</span>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    value="organizer"
                    {...register('userType')}
                    className="sr-only peer"
                  />
                  <div className="p-4 border-2 rounded-xl cursor-pointer text-center peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:border-surface-300 transition-colors">
                    <span className="text-2xl block mb-1">📋</span>
                    <span className="font-medium text-surface-900">Organize Events</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="label">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={`input ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="label">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                  autoComplete="new-password"
                  {...register('password')}
                  className={`input pr-11 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a strong password"
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
              <p className="mt-1 text-xs text-surface-500">
                Min 8 characters, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={`input pr-11 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-surface-500 hover:text-surface-700 focus:outline-none focus:text-primary-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-surface-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !agreedToTerms}
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
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-surface-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
