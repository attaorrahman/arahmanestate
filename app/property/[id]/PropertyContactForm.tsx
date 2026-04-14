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
    const waMessage = encodeURIComponent(
      `Hi, I'm ${form.name} (${form.email}). ${form.message}`
    );
    return (
      <div className="text-center py-4">
        <CheckCircle size={28} className="text-[#C9A84C] mx-auto mb-2" />
        <p className="font-body text-gray-700 text-sm font-medium">Message sent!</p>
        <p className="font-body text-gray-400 text-xs mb-3">We will be in touch shortly.</p>
        <a
          href={`https://wa.me/971557757123?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm font-body text-xs font-medium text-white transition-colors"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Also send via WhatsApp
        </a>
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
