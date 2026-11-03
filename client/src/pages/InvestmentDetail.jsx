import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Coins,
  CheckCircle2,
  FileCheck,
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  Send
} from 'lucide-react';

export default function InvestmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setOpportunity(data.data))
      .catch(err => {
        console.error(err);
        setOpportunity(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-5xl mx-auto py-24 text-center text-slate-400">Loading investment profile...</div>;
  }

  if (!opportunity) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Opportunity Not Found</h2>
        <p className="text-sm text-slate-500">The investment profile you requested may have been archived or unpublished.</p>
        <Link to="/investment" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Investment Opportunities</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/investment')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities Catalog</span>
        </button>
      </div>

      {/* Main Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide">
            {opportunity.sector}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{opportunity.location}</span>
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium">
            {opportunity.investmentType}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {opportunity.title}
        </h1>
        <p className="text-base text-slate-600 max-w-4xl leading-relaxed">
          {opportunity.summary}
        </p>
      </div>

      {/* Featured Image */}
      <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <img
          src={opportunity.imageUrl}
          alt={opportunity.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Structured Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Scope, Rationale, Incentives */}
        <div className="lg:col-span-8 space-y-8">
          {/* Executive Description */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Project Overview & Rationale
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Investment Incentives Package */}
          <div className="bg-emerald-50/60 p-8 rounded-2xl border border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg font-bold text-emerald-950">
                Official Bureau Incentives Package
              </h3>
            </div>
            <p className="text-xs text-emerald-900">
              Approved fiscal and operational incentives available for certified domestic and international developers under this project:
            </p>
            <ul className="space-y-2.5 pt-2">
              {(opportunity.incentives || []).map((inc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Key Metrics & Inquiry Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">
              Key Investment Parameters
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Estimated Capital Requirement</span>
                <strong className="text-slate-900 text-base font-extrabold">{opportunity.requiredCapital}</strong>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Land & Utility Readiness</span>
                <p className="text-slate-800 font-medium mt-0.5">{opportunity.landAvailable}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Engagement Structure</span>
                <p className="text-slate-800 font-medium mt-0.5">{opportunity.investmentType}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Facilitation Directorate</span>
                <p className="text-emerald-800 font-semibold mt-0.5">{opportunity.contactPerson}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to={`/contact?subject=${encodeURIComponent(`Inquiry on ${opportunity.title}`)}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-emerald-700/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry to Bureau</span>
              </Link>
            </div>
          </div>

          {/* Institutional Trust Note */}
          <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 space-y-1.5 border border-slate-200">
            <strong className="text-slate-800 block">Single-Window Protection</strong>
            <p>
              All formal project inquiries are handled under strict confidentiality by the Directorate of Investment Licensing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
