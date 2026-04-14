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
              Let Find Your
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
                <p className="font-body text-gray-400 mb-5">
                  Thank you for reaching out. Our team will contact you within 24 hours.
                </p>

                <a
                  href={`https://wa.me/923216108400?text=${encodeURIComponent(
                    `Hi, I'm ${form.name} (${form.email}${form.phone ? `, ${form.phone}` : ''}). ${form.message}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-body text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Also send via WhatsApp
                </a>

                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                  className="block mx-auto mt-5 btn-gold px-6 py-3 rounded-sm font-body text-sm font-medium"
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
