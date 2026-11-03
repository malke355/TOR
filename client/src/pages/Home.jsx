import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  Globe2,
  FileCheck,
  Calendar,
  ExternalLink,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [featuredOpps, setFeaturedOpps] = useState([]);
  const [tradeProducts, setTradeProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()).catch(() => null),
      fetch('/api/opportunities?includeDrafts=false').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/trade').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/services').then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/news').then(res => res.json()).catch(() => ({ data: [] })),
    ]).then(([statsData, oppsData, tradeData, servicesData, newsData]) => {
      setStats(statsData);
      setFeaturedOpps((oppsData.data || []).slice(0, 3));
      setTradeProducts((tradeData.data || []).slice(0, 4));
      setServices((servicesData.data || []).slice(0, 4));
      setNews((newsData.data || []).slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white overflow-hidden py-16 lg:py-24 px-4 sm:px-8 border-b border-emerald-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/70 border border-emerald-600/50 text-emerald-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/investment"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-700/30 transition-all hover:translate-y-[-1px]"
              >
                <span>{t.hero.exploreBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                <span>{t.hero.servicesBtn}</span>
              </Link>
            </div>
          </div>

          {/* Quick Institutional Focus Card */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Institutional Mandate</h3>
                <p className="text-xs text-emerald-300">Unified Trade & Investment Gateway</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                Oromia Region
              </span>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Single-window investor licensing and duty-free import exemptions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pre-cleared land bank allocation in agro-processing and industrial parks</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct market linkages for specialty coffee, oilseeds, and organic livestock</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Strategic rail and road corridor access to Djibouti port and regional markets</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/about"
                className="text-xs text-emerald-300 hover:text-white font-semibold flex items-center gap-1 group"
              >
                <span>Learn more about the Bureau restructuring</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
              {stats?.institutionalMetrics?.licensedInvestorsYTD || '240+'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">{t.hero.stats.projects}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.institutionalMetrics?.activeInvestmentZones || '12'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">{t.hero.stats.zones}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {stats?.institutionalMetrics?.regionalExportVolumeUSD || '$2.4B+'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">{t.hero.stats.exportValue}</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {stats?.institutionalMetrics?.priorityExportSectors || '6'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">{t.hero.stats.prioritySectors}</div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Investment Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Strategic Growth</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Investment Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pre-profiled commercial projects with allocated land, utility infrastructure, and fiscal incentives.
            </p>
          </div>
          <Link
            to="/investment"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>{t.common.viewAll} ({featuredOpps.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={opp.imageUrl}
                  alt={opp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {opp.sector}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{opp.location}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {opp.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Est. Capital</span>
                    <span className="text-xs font-bold text-slate-800">{opp.requiredCapital}</span>
                  </div>
                  <Link
                    to={`/investment/${opp.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Priority Export Commodities */}
      <section className="bg-slate-100 py-16 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Trade Promotion</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Priority Regional Export Products
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                World-renowned single-origin agricultural commodities, organic livestock, and manufactured goods.
              </p>
            </div>
            <Link
              to="/trade"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>Explore Trade Portal</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {prod.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold pt-2 border-t border-slate-100">
                    Origin: {prod.originZones}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Essential Bureau Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Public Facilitation</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Investor & Trader Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Transparent service charters detailing requirements, processing timelines, and responsible desks.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>All Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {srv.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Time: <strong className="text-slate-700">{srv.processingTime}</strong>
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Office: <span className="text-slate-700 font-medium">{srv.responsibleOffice}</span>
                </span>
                <Link
                  to="/services"
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Latest News & Public Notices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Media Center</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Latest News & Announcements
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Official press releases, policy updates, and regional trade announcements.
            </p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>All News</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.publishedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <Link
                  to={`/news/${item.id}`}
                  className="pt-2 text-xs font-bold text-emerald-700 inline-flex items-center gap-1 group-hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-emerald-800/80 shadow-md flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-emerald-400/40 shrink-0 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Bureau Head"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3 flex-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Bureau Leadership Message
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              "Building a Resilient, Investor-Centric Economy in Oromia"
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "Through the unification of our trade and investment portfolios, we are unlocking unprecedented value for investors while ensuring our agricultural and industrial producers have frictionless access to international trade corridors."
            </p>
            <div className="pt-2 text-xs text-emerald-300 font-semibold">
              Commissioner & Head of Bureau • Oromia Trade and Investment Bureau
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
