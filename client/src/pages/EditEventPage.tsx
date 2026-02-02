import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { updateEventSchema, type UpdateEventInput, eventCategories } from '@ems/shared';
import { getEventById, updateEvent } from '../services/events';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const event = await getEventById(id);
        // Format the date for the input
        const eventDate = new Date(event.eventDate).toISOString().split('T')[0];
        reset({
          eventName: event.eventName,
          description: event.description,
          eventDate,
          eventTime: event.eventTime,
          endTime: event.endTime,
          venue: event.venue,
          address: event.address,
          category: event.category,
          capacity: event.capacity,
          status: event.status,
        });
      } catch (error: any) {
        toast.error('Failed to load event');
        navigate('/my-events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, reset, navigate]);

  const onSubmit = async (data: UpdateEventInput) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateEvent(id, data);
      toast.success('Event updated successfully!');
      navigate('/my-events');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-1">Update your event details</p>
        </div>

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
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cancelled"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span>Cancelled</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 py-3"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
  );
}
