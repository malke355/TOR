import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  Building,
  Globe2,
  FileCheck,
  Calendar,
  ExternalLink,
  MapPin,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const HERO_SLIDES = [
  {
    image: '/images/hero/bulbula-industrial-park.png',
    alt: 'Bulbula Integrated Agro-Industrial Park',
    defaultTag: 'Industrial Infrastructure',
    defaultTitle: 'Bulbula Integrated Agro-Industrial Park (BIAIP)',
    defaultDesc: 'State-of-the-art processing infrastructure with complete utility hookups, cold chains, and direct logistics corridors.'
  },
  {
    image: '/images/hero/coffee-harvesting.jpg',
    alt: 'Oromia Specialty Coffee Harvesting & Washing',
    defaultTag: 'World-Class Commodities',
    defaultTitle: 'Premium Oromia Specialty Coffee Harvesting',
    defaultDesc: 'Birthplace of Arabica coffee producing globally acclaimed certified organic Jimma, Guji, Limmu, and Harar varieties.'
  },
  {
    image: '/images/hero/textile-manufacturing.jpg',
    alt: 'Textile and Apparel Manufacturing in Oromia',
    defaultTag: 'Manufacturing Excellence',
    defaultTitle: 'Export-Oriented Textile & Apparel Manufacturing',
    defaultDesc: 'Modern manufacturing plants driving industrial transformation, competitive energy tariffs, and duty-free trade access.'
  },
  {
    image: '/images/hero/borana-livestock.jpg',
    alt: 'Borana Pastoralist Livestock and Agro-pastoral Economy',
    defaultTag: 'Livestock & Agro-Pastoral',
    defaultTitle: 'Borana Pastoralist Livestock & Agro-Pastoral Trade',
    defaultDesc: 'World-renowned Borana breeds and modern abattoir clusters supplying premium organic livestock across East Africa and the Gulf.'
  }
];

export default function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState(null);
  const [featuredOpps, setFeaturedOpps] = useState([]);
  const [tradeProducts, setTradeProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

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
      {/* Hero Section - True Light & Dark Switch */}
      <section className="relative bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 text-slate-900 dark:text-white overflow-hidden py-8 lg:py-12 px-4 sm:px-8 border-b border-slate-200 dark:border-emerald-900/40 transition-colors duration-200">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Hero Image Showcase Carousel */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-emerald-900/50 bg-slate-950 aspect-[16/9] sm:aspect-[21/9] min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] max-h-[580px] w-full select-none">
            {/* Slides */}
            {HERO_SLIDES.map((slide, index) => {
              const slideText = t.hero?.slides?.[index];
              const tag = slideText?.tag || slide.defaultTag;
              const title = slideText?.title || slide.defaultTitle;
              const desc = slideText?.desc || slide.defaultDesc;
              const isActive = index === currentSlide;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Subtle Top & Bottom Gradient Overlays for Readability and Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/30" />

                  {/* Slide Content Caption with generous safe-zone padding */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 px-12 sm:px-16 md:px-20 text-white z-10">
                    <div className="max-w-3xl space-y-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-600/90 text-white shadow-sm backdrop-blur-sm border border-emerald-400/30">
                        {tag}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {title}
                      </h3>
                      <p className="hidden sm:block text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed line-clamp-2 max-w-2xl drop-shadow">
                        {desc}
                      </p>

                      {/* Both Buttons Overlayed on the Pictures */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link
                          to="/investment"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-black/40 backdrop-blur-sm transition-all hover:translate-y-[-1px]"
                        >
                          <span>{t.hero.exploreBtn}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/services"
                          className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 border border-white/25 text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl backdrop-blur-md transition-all shadow-lg hover:border-white/40"
                        >
                          <span>{t.hero.servicesBtn}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Left Chevron Button - Low opacity, thin border, positioned at outer edge */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/25 hover:bg-black/60 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-sm border border-white/15 hover:border-white/40 shadow-sm opacity-35 hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>

            {/* Right Chevron Button - Low opacity, thin border, positioned at outer edge */}
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/25 hover:bg-black/60 text-white/70 hover:text-white flex items-center justify-center backdrop-blur-sm border border-white/15 hover:border-white/40 shadow-sm opacity-35 hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>

            {/* Bottom Indicator Dots */}
            <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-8 z-20 flex items-center gap-2">
              {HERO_SLIDES.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentSlide(dotIndex)}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    dotIndex === currentSlide
                      ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-emerald-500 shadow-md shadow-emerald-500/50'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Investment Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">Strategic Growth</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {t.home?.featuredTitle || "Featured Investment Opportunities"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.home?.featuredSubtitle || "Pre-packaged industrial, agro-processing, and renewable energy projects with pre-allocated land banks and utility access."}
            </p>
          </div>
          <Link
            to="/investment"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>{t.home?.viewAllOpps || t.common.viewAll} ({featuredOpps.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={opp.imageUrl}
                  alt={opp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {opp.sector}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{opp.location}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {opp.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">{t.investment?.capital || "Req. Capital"}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opp.requiredCapital}</span>
                  </div>
                  <Link
                    to={`/investment/${opp.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>{t.investment?.viewDetails || "View Details"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Priority Export Commodities */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16 px-4 sm:px-8 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">Trade Promotion</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {t.home?.tradeTitle || "Priority Regional Export Products"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.home?.tradeSubtitle || "World-renowned single-origin agricultural commodities, organic livestock, and manufactured goods."}
              </p>
            </div>
            <Link
              to="/trade"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <span>{t.home?.viewTradeCatalog || "Explore Trade Portal"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/85 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {prod.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">Public Facilitation</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {t.home?.servicesTitle || "Investor & Trader Services"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.home?.servicesSubtitle || "Transparent service charters detailing requirements, processing timelines, and responsible desks."}
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>{t.home?.viewAllServices || "All Services"}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                    {srv.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.services?.time || "Time"}: <strong className="text-slate-700 dark:text-slate-300">{srv.processingTime}</strong>
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{srv.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {t.services?.dept || "Office"}: <span className="text-slate-700 dark:text-slate-200 font-medium">{srv.responsibleOffice}</span>
                </span>
                <Link
                  to="/services"
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>{t.common.readMore || "Details"}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Latest News & Public Notices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">Media Center</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {t.home?.newsTitle || "Latest News & Announcements"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.home?.newsSubtitle || "Official press releases, policy updates, and regional trade announcements."}
            </p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>{t.home?.viewAllNews || "All News"}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col group"
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
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{item.publishedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <Link
                  to={`/news/${item.id}`}
                  className="pt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 group-hover:underline"
                >
                  <span>{t.news?.readArticle || "Read Article"}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-emerald-700/80 shadow-md flex flex-col md:flex-row items-center gap-8">
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
            <p className="text-sm text-slate-200 leading-relaxed italic">
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
