'use client';

import { useState } from 'react';
import { Calendar, Clock, CircleCheck as CheckCircle, X } from 'lucide-react';
import { submitInquiry } from '@/lib/client-actions';

const WHATSAPP_NUMBER = '971557757123';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM',
];

export default function BookViewingForm({
  propertyTitle,
  propertyId,
}: {
  propertyTitle: string;
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const resetAndOpen = () => {
    setOpen(true);
    setStep('datetime');
    setDate('');
    setTime('');
    setName('');
    setPhone('');
    setEmail('');
    setError('');
  };

  const handleDateTimeNext = () => {
    if (!date || !time) {
      setError('Please select both a date and time.');
      return;
    }
    setError('');
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setError('Please provide your name and either email or phone.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await submitInquiry({
        name,
        email: email || 'not-provided@placeholder.com',
        phone,
        message: `Viewing request for "${propertyTitle}" on ${date} at ${time}.`,
        property_id: propertyId,
        source: 'booking',
      });
      setStep('success');
    } catch {
      setError('Failed to schedule booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like to book a viewing for "${propertyTitle}" on ${date} at ${time}. My name is ${name}${phone ? `, phone: ${phone}` : ''}${email ? `, email: ${email}` : ''}.`
  );

  return (
    <>
      <div className="bg-[#0D0D0D] rounded-sm p-5 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-[#C9A84C]" />
          <p className="font-display text-white font-semibold text-sm">Schedule Viewing</p>
        </div>
        <p className="font-body text-gray-500 text-xs mb-4">
          Book a private viewing with our specialist agent.
        </p>
        <button
          onClick={resetAndOpen}
          className="btn-gold w-full py-2.5 rounded-sm font-body text-sm font-medium"
        >
          Book Viewing
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-sm w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#C9A84C]" />
                <h3 className="font-display text-gray-900 font-bold text-lg">Book Viewing</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <p className="font-body text-sm text-gray-500 mb-5">{propertyTitle}</p>

              {step === 'datetime' && (
                <div className="space-y-5">
                  <div>
                    <label className="font-body text-sm font-medium text-gray-700 mb-2 block">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <Clock size={14} className="text-[#C9A84C]" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`px-3 py-2 rounded-sm text-sm font-body transition-all border ${
                            time === slot
                              ? 'bg-[#C9A84C] text-white border-[#C9A84C]'
                              : 'border-gray-200 text-gray-600 hover:border-[#C9A84C] hover:text-[#C9A84C]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <p className="font-body text-red-500 text-xs">{error}</p>}

                  <button
                    onClick={handleDateTimeNext}
                    className="btn-gold w-full py-2.5 rounded-sm font-body text-sm font-medium"
                  >
                    Continue
                  </button>
                </div>
              )}

              {step === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-[#FAFAF8] rounded-sm p-3 border border-gray-100 mb-2">
                    <p className="font-body text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">Date:</span> {date}
                    </p>
                    <p className="font-body text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">Time:</span> {time}
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Your name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />

                  {error && <p className="font-body text-red-500 text-xs">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-2 py-2.5 rounded-sm font-body text-sm font-medium disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Schedule Booking'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep('datetime'); setError(''); }}
                    className="w-full text-center font-body text-xs text-gray-400 hover:text-[#C9A84C] transition-colors"
                  >
                    Change date/time
                  </button>
                </form>
              )}

              {step === 'success' && (
                <div className="text-center py-6">
                  <CheckCircle size={36} className="text-[#C9A84C] mx-auto mb-3" />
                  <p className="font-display text-gray-900 font-bold text-lg mb-1">Booking Confirmed!</p>
                  <p className="font-body text-gray-500 text-sm mb-1">{date} at {time}</p>
                  <p className="font-body text-gray-400 text-xs mb-5">
                    We will contact you shortly to confirm.
                  </p>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-body text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Also confirm via WhatsApp
                  </a>

                  <button
                    onClick={() => setOpen(false)}
                    className="block w-full mt-3 font-body text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
