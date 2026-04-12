'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Send, CircleCheck as CheckCircle } from 'lucide-react';
import { submitInquiry } from '@/lib/client-actions';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(5, 'Message is required'),
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function PropertyContactForm({
  propertyTitle,
  propertyId,
}: {
  propertyTitle: string;
  propertyId: string;
}) {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    message: `I'm interested in "${propertyTitle}"`,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await submitInquiry({
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
        property_id: propertyId,
        source: 'property_inquiry',
      });
      setSent(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof FormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [key]: e.target.value });
      if (errors[key]) setErrors({ ...errors, [key]: undefined });
    },
  });

  if (sent) {
    return (
      <div className="text-center py-4">
        <CheckCircle size={28} className="text-[#C9A84C] mx-auto mb-2" />
        <p className="font-body text-gray-700 text-sm font-medium">Message sent!</p>
        <p className="font-body text-gray-400 text-xs">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-gray-50 pt-5" noValidate>
      <p className="font-display text-gray-800 font-semibold text-sm">Quick Inquiry</p>

      <div>
        <input
          type="text"
          placeholder="Your name"
          {...field('name')}
          className={`w-full border rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none transition-colors ${
            errors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#C9A84C]'
          }`}
        />
        {errors.name && <p className="font-body text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email address"
          {...field('email')}
          className={`w-full border rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none transition-colors ${
            errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#C9A84C]'
          }`}
        />
        {errors.email && <p className="font-body text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <textarea
          rows={3}
          {...field('message')}
          className={`w-full border rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none transition-colors resize-none ${
            errors.message ? 'border-red-400' : 'border-gray-200 focus:border-[#C9A84C]'
          }`}
        />
        {errors.message && <p className="font-body text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {serverError && <p className="font-body text-red-500 text-xs">{serverError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full flex items-center justify-center gap-2 py-2.5 rounded-sm font-body text-sm font-medium disabled:opacity-70"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send size={13} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
