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
    phone: '',
    organization: '',
    subject: '',
    message: ''
  });
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSuccessMsg(data.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: ''
      });
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.contact?.formHeading || "Official Inquiry Form"}</h3>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
                />
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.phone || "Phone Number"}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 9..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Company / Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g., Global Agro Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.subject || "Subject"} *</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Inquiry topic..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">{t.contact?.message || "Message / Request Details"} *</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your project, land requirements, or trade facilitation needs..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50"
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
              <li>• <strong>Batu Hub:</strong> Rift Valley Horticulture Facilitation Office</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
