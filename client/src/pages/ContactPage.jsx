import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setFormData(prev => ({ ...prev, subject: subjectParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Live validation for text-only fields (numbers not allowed)
    const textOnlyFields = ['name', 'organization', 'subject', 'message'];
    if (textOnlyFields.includes(name)) {
      if (/\d/.test(value)) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: 'Numbers are not allowed. Please enter text only.'
        }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneSuffixChange = (e) => {
    // Only allow numeric digits, max 8 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPhoneSuffix(digitsOnly);

    if (fieldErrors.phone) {
      if (digitsOnly.length === 8) {
        setFieldErrors(prev => ({ ...prev, phone: null }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          phone: `Please enter all 8 digits (${digitsOnly.length}/8 entered)`
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const errors = {};

    // 1. Full Name validation (required & text only)
    if (!formData.name.trim()) {
      errors.name = 'Full Name is required.';
    } else if (/\d/.test(formData.name)) {
      errors.name = 'Full Name must contain text only, no numbers are allowed.';
    }

    // 2. Organization validation (text only if provided)
    if (formData.organization && /\d/.test(formData.organization)) {
      errors.organization = 'Company / Organization must contain text only, no numbers are allowed.';
    }

    // 3. Subject validation (required & text only)
    if (!formData.subject.trim()) {
      errors.subject = 'Subject / Purpose of Inquiry is required.';
    } else if (/\d/.test(formData.subject)) {
      errors.subject = 'Subject / Purpose of Inquiry must contain text only, no numbers are allowed.';
    }

    // 4. Detailed Message validation (required & text only)
    if (!formData.message.trim()) {
      errors.message = 'Detailed Message is required.';
    } else if (/\d/.test(formData.message)) {
      errors.message = 'Detailed Message must contain text only, no numbers are allowed.';
    }

    // 5. Phone validation: must have exactly 8 digits after default +2519
    if (!phoneSuffix || phoneSuffix.length !== 8 || !/^\d{8}$/.test(phoneSuffix)) {
      errors.phone = 'Phone number must start with +2519 followed by exactly 8 digits.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Please correct the highlighted validation errors before submitting.');
      return;
    }

    setSubmitting(true);
    const fullPhone = `+2519${phoneSuffix}`;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSuccessMsg(data.message);
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: ''
      });
      setPhoneSuffix('');
      setFieldErrors({});
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <Phone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{t.contact?.badge || "Bureau Public Communication & Inquiries"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.contact?.title || "Contact the Oromia Trade & Investment Bureau"}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {t.contact?.desc || "Submit project facilitation requests, trade sourcing inquiries, or citizen feedback directly to authorized bureau desks."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.contact?.formHeading || "Send Official Inquiry"}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              All messages are routed directly to the Executive Bureau Inquiries Desk.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-start gap-3 text-emerald-900 dark:text-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Submission Confirmed</strong>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-900 dark:text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Validation Error</strong>
                <p className="text-xs text-red-800 dark:text-red-300 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.name || "Full Name"} *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Abebe Chala"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-sm transition-all shadow-sm`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.email || "Email Address"} *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., abebe@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.phone || "Phone Number"} *</label>
                  <span className={`text-[11px] font-mono font-medium ${phoneSuffix.length === 8 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {phoneSuffix.length}/8 digits
                  </span>
                </div>
                <div className={`flex rounded-xl border ${fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600'} bg-white dark:bg-slate-800 overflow-hidden transition-all shadow-sm`}>
                  <span className="inline-flex items-center px-3.5 bg-slate-100 dark:bg-slate-700/80 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-sm border-r border-slate-300 dark:border-slate-700 select-none tracking-wide">
                    +2519
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phoneSuffix"
                    maxLength={8}
                    required
                    value={phoneSuffix}
                    onChange={handlePhoneSuffixChange}
                    placeholder="12345678"
                    className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 dark:text-white focus:outline-none text-sm font-mono tracking-wider placeholder:text-slate-400"
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Starts with default <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">+2519</span>, enter your remaining 8 digits
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Company / Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g., Oromia Coffee Export"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${fieldErrors.organization ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-sm transition-all shadow-sm`}
                />
                {fieldErrors.organization && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.organization}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.subject || "Subject / Purpose of Inquiry"} *</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Inquiry topic..."
                className={`w-full px-3.5 py-2.5 rounded-xl border ${fieldErrors.subject ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-sm transition-all shadow-sm`}
              />
              {fieldErrors.subject && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.subject}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.message || "Detailed Message / Investment Proposal"} *</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your project, land requirements, or trade facilitation needs..."
                className={`w-full px-3.5 py-2.5 rounded-xl border ${fieldErrors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-sm transition-all shadow-sm`}
              ></textarea>
              {fieldErrors.message && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? (t.contact?.submitting || 'Transmitting...') : (t.contact?.submit || 'Submit Inquiry')}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Physical Desks & Directory */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              Headquarters & Desks
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-white block">Main Complex</strong>
                  <span>Sarbet, Oromia Regional Government Headquarters Compound, Finfine</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-white block">Telephone Switchboard</strong>
                  <span>+251 11 551 2233 / +251 11 552 4455</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-white block">Email Inquiries</strong>
                  <span>info@investoromia.gov.et / contact@investoromia.gov.et</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-white block">Working Hours</strong>
                  <span>Monday – Friday: 8:30 AM – 12:30 PM & 1:30 PM – 5:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Hubs Box */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs transition-colors">
            <h4 className="font-bold text-slate-800 dark:text-white">Major Regional Branch Desks</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>• <strong>Adama Hub:</strong> Adama Free Trade & Economic Zone Center</li>
              <li>• <strong>Bishoftu Hub:</strong> Special Zone Agro-Industrial Desk</li>
              <li>• <strong>Jimma Hub:</strong> Southwestern Coffee & Commodity Desk</li>
              <li>• <strong>Bulbula & Batu Hub:</strong> Bulbula IAIP & Rift Valley Facilitation Office</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
