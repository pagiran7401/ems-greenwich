import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createEventSchema, type CreateEventInput, eventCategories } from '@ems/shared';
import { createEvent } from '../services/events';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      status: 'draft',
      category: 'other',
      capacity: 100,
    },
  });

  const onSubmit = async (data: CreateEventInput) => {
    setIsSubmitting(true);
    try {
      const event = await createEvent(data);
      toast.success('Event created successfully!');
      navigate('/my-events');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for min date validation
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero py-10">
        <div className="container-custom">
          <h1 className="text-display-md text-white mb-2">Create New Event</h1>
          <p className="text-primary-200">Fill in the details to create your event</p>
        </div>
      </div>
      <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="label">
                Event Name *
              </label>
              <input
                id="eventName"
                type="text"
                {...register('eventName')}
                className={`input ${errors.eventName ? 'input-error' : ''}`}
                placeholder="Summer Music Festival 2025"
              />
              {errors.eventName && (
                <p className="mt-1 text-sm text-red-600">{errors.eventName.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className={`input ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe your event in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="label">
                Category *
              </label>
              <select
                id="category"
                {...register('category')}
                className={`input ${errors.category ? 'input-error' : ''}`}
              >
                {eventCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="eventDate" className="label">
                  Event Date *
                </label>
                <input
                  id="eventDate"
                  type="date"
                  min={minDate}
                  {...register('eventDate')}
                  className={`input ${errors.eventDate ? 'input-error' : ''}`}
                />
                {errors.eventDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="eventTime" className="label">
                  Start Time *
                </label>
                <input
                  id="eventTime"
                  type="time"
                  {...register('eventTime')}
                  className={`input ${errors.eventTime ? 'input-error' : ''}`}
                />
                {errors.eventTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.eventTime.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="endTime" className="label">
                  End Time
                </label>
                <input
                  id="endTime"
                  type="time"
                  {...register('endTime')}
                  className={`input ${errors.endTime ? 'input-error' : ''}`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="label">
                Venue *
              </label>
              <input
                id="venue"
                type="text"
                {...register('venue')}
                className={`input ${errors.venue ? 'input-error' : ''}`}
                placeholder="O2 Arena, London"
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="label">
                Full Address
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={`input ${errors.address ? 'input-error' : ''}`}
                placeholder="Peninsula Square, London SE10 0DX"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="label">
                Capacity *
              </label>
              <input
                id="capacity"
                type="number"
                min={1}
                max={100000}
                {...register('capacity', { valueAsNumber: true })}
                className={`input ${errors.capacity ? 'input-error' : ''}`}
                placeholder="500"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="label">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="draft"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span>Draft</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="published"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span>Published</span>
                </label>
              </div>
              <p className="text-sm text-surface-500 mt-1">
                Draft events are only visible to you. Published events are visible to everyone.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 py-3"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-events')}
                className="btn-secondary flex-1 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
