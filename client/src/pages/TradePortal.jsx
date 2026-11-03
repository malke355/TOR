import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Package,
  Globe2,
  CheckCircle,
  FileCheck2,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function TradePortal() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Agriculture & Beverage',
    'Oilseeds & Pulses',
    'Pulses & Legumes',
    'Floriculture & Horticulture',
    'Livestock & Meat'
  ];

  useEffect(() => {
    fetch('/api/trade')
      .then(res => res.json())
      .then(data => {
        let list = data.data || [];
        if (selectedCategory !== 'All') {
          list = list.filter(p => p.category === selectedCategory);
        }
        setProducts(list);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const exportProcedures = [
    {
      step: "01",
      title: "Export Licensing & Commercial Registration",
      desc: "Obtain or renew your export license through the Oromia Trade Directorate or national eTrade portal with verified tax clearance."
    },
    {
      step: "02",
      title: "Commodity Sourcing & ECX Contracts",
      desc: "Source specialty commodities (Coffee, Sesame, Pulses) directly through certified regional primary cooperatives or the Ethiopian Commodity Exchange."
    },
    {
      step: "03",
      title: "Quality Verification & Phytosanitary Certification",
      desc: "Inspection and testing of moisture, grading, and chemical residue by accredited regional laboratory stations."
    },
    {
      step: "04",
      title: "Customs Clearance & Fast-Track Logistics",
      desc: "Single-window electronic clearance via Mojo Dry Port or Bole Cargo terminal with full customs duty exemptions on export receipts."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Title & Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Package className="w-4 h-4 text-emerald-700" />
          <span>Regional Trade & Export Promotion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Oromia Export Gateway & Market Directory
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Oromia accounts for more than half of Ethiopia's agricultural export volume. We connect international buyers and procurement agencies directly to certified regional producers, cooperatives, and processing clusters.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Priority Export Products Directory
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading export products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    {prod.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Primary Origin Zones</span>
                      <strong className="text-emerald-900 font-semibold">{prod.originZones}</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Export Standard & Specs</span>
                      <p className="text-slate-700">{prod.exportSpecs}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Harvest & Shipping</span>
                      <p className="text-slate-700 font-medium">{prod.seasonality}</p>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/contact?subject=${encodeURIComponent(`Trade Inquiry: Sourcing ${prod.name}`)}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2 rounded-lg transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Request Buyer-Seller Matchmaking</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Procedures Guide */}
      <section className="bg-slate-100 rounded-2xl p-8 sm:p-12 border border-slate-200 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Regulatory Guidance</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How to Export from Oromia: Step-by-Step
          </h2>
          <p className="text-sm text-slate-600">
            A simplified summary of the official export licensing, inspection, and logistics corridor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exportProcedures.map((proc, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-2xl font-black text-emerald-700 block">
                {proc.step}
              </span>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                {proc.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {proc.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-200 text-xs text-slate-600">
          <span>Need complete trade manuals and forms?</span>
          <Link
            to="/documents"
            className="font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>Visit Downloads Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
