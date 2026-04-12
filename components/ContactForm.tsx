'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Send, Phone, Mail, MapPin, CircleCheck as CheckCircle } from 'lucide-react';
import { submitInquiry } from '@/lib/client-actions';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
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
        phone: result.data.phone || undefined,
        message: result.data.message,
        source: 'contact_form',
      });
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof FormData) => ({
    value: form[key] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [key]: e.target.value });
      if (errors[key]) setErrors({ ...errors, [key]: undefined });
    },
  });

  return (
    <section className="py-24 bg-[#0D0D0D] relative overflow-hidden" id="contact">
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-5"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800&q=40)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#0D0D0D] to-transparent" />
{/* test */}
{/* another test */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] font-body text-xs tracking-[0.25em] uppercase font-medium">
                Get In Touch
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Let's Find Your
              <span className="block italic text-[#C9A84C]">Perfect Property</span>
            </h2>
            <p className="font-body text-gray-400 text-lg mb-12 leading-relaxed">
              Our expert agents are ready to help you discover the finest properties across the UAE.
              Reach out for a personalized consultation.
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Phone', value: '+971 55 775 7123' },
                { icon: Mail, label: 'Email', value: 'info@bnhmasterkey.ae' },
                { icon: MapPin, label: 'Office', value: 'DIFC Gate Village, Dubai, UAE' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-sm bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-colors shrink-0">
                    <Icon size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-body text-gray-500 text-xs uppercase tracking-wider">{label}</p>
                    <p className="font-body text-white text-sm mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/4 backdrop-blur-sm border border-white/8 rounded-sm p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-display text-white text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="font-body text-gray-400">
                  Thank you for reaching out. Our team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                  className="mt-6 btn-gold px-6 py-3 rounded-sm font-body text-sm font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h3 className="font-display text-white text-2xl font-semibold mb-6">
                  Property Inquiry
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-gray-400 text-xs uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      {...field('name')}
                      className={`w-full bg-white/5 border rounded-sm px-4 py-3 text-white placeholder-gray-600 font-body text-sm focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500/60' : 'border-white/10 focus:border-[#C9A84C]/60'
                      }`}
                    />
                    {errors.name && <p className="font-body text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block font-body text-gray-400 text-xs uppercase tracking-wider mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+971 50 000 0000"
                      {...field('phone')}
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-600 font-body text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-gray-400 text-xs uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...field('email')}
                    className={`w-full bg-white/5 border rounded-sm px-4 py-3 text-white placeholder-gray-600 font-body text-sm focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500/60' : 'border-white/10 focus:border-[#C9A84C]/60'
                    }`}
                  />
                  {errors.email && <p className="font-body text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block font-body text-gray-400 text-xs uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="I'm interested in a 3-bedroom villa in Dubai Marina..."
                    {...field('message')}
                    className={`w-full bg-white/5 border rounded-sm px-4 py-3 text-white placeholder-gray-600 font-body text-sm focus:outline-none transition-colors resize-none ${
                      errors.message ? 'border-red-500/60' : 'border-white/10 focus:border-[#C9A84C]/60'
                    }`}
                  />
                  {errors.message && <p className="font-body text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {serverError && (
                  <p className="font-body text-red-400 text-sm">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2.5 py-3.5 rounded-sm font-body font-medium text-sm tracking-wide disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
