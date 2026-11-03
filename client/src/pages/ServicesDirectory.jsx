import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  Clock,
  Building,
  FileText,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Info,
  Globe
} from 'lucide-react';

export default function ServicesDirectory() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterType, setFilterType] = useState('all');

  const categories = [
    'All',
    'Investment Licensing',
    'Land & Infrastructure',
    'Fiscal Incentives',
    'Trade Regulation',
    'Market Support'
  ];

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        let list = data.data || [];
        if (activeCategory !== 'All') {
          list = list.filter(s => s.category.toLowerCase().includes(activeCategory.toLowerCase()));
        }
        if (filterType === 'online') {
          list = list.filter(s => s.isOnline);
        } else if (filterType === 'info') {
          list = list.filter(s => !s.isOnline);
        }
        setServices(list);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{t.services?.badge || "Institutional Public & Business Services"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.services?.title || "Citizen & Business Service Charters"}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {t.services?.desc || "Transparent guidelines defining eligibility, required documentation, expected turnaround times, and responsible offices for all investment, licensing, and trade facilitation services."}
        </p>
      </div>

      {/* Filter and Switcher Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? (t.services?.allServices || 'All Services') : cat}
            </button>
          ))}
        </div>

        {/* Transactional vs Informational Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold w-full md:w-auto justify-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.services?.allServices || "All Services"}
          </button>
          <button
            onClick={() => setFilterType('online')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'online' ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Online Portal Services
          </button>
          <button
            onClick={() => setFilterType('info')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'info' ? 'bg-white dark:bg-slate-700 text-blue-800 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Desk Information
          </button>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading service directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-md text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
                    {srv.category}
                  </span>
                  {srv.isOnline ? (
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md text-[11px] font-bold flex items-center gap-1 border border-blue-200 dark:border-blue-800/60">
                      <Globe className="w-3 h-3" />
                      <span>Online Electronic Service</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[11px] font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                      <Info className="w-3 h-3" />
                      <span>In-Person Bureau Desk</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {srv.description}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Eligibility</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{srv.eligibility}</p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">{t.services?.reqs || "Required Documents"}</span>
                    <p className="text-slate-700 dark:text-slate-300">{srv.requirements}</p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Application Procedure</span>
                    <p className="text-slate-700 dark:text-slate-300">{srv.procedure}</p>
                  </div>
                </div>
              </div>

              {/* Service Meta Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{t.services?.time || "Service Delivery Time"}</span>
                    <strong className="text-emerald-800 dark:text-emerald-400 font-bold">{srv.processingTime}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{t.services?.fee || "Administrative Fee"}</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">{srv.fees}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {t.services?.dept || "Desk"}: <strong className="text-slate-700 dark:text-slate-300">{srv.responsibleOffice}</strong>
                  </span>

                  {srv.isOnline ? (
                    <Link
                      to={`/services/portal/${srv.id}`}
                      className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors"
                    >
                      <span>Access Electronic Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to="/documents"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      <span>Download Service Forms</span>
                      <FileText className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
