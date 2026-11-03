import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  MapPin,
  TrendingUp,
  Coins,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function InvestmentPortal() {
  const { t } = useLanguage();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const sectors = [
    'All',
    'Agro-Processing',
    'Manufacturing & Textiles',
    'Agriculture & Agro-Processing',
    'Renewable Energy & Technology',
    'Livestock & Meat'
  ];

  const locations = [
    'All',
    'East Shewa',
    'Finfine',
    'Jimma',
    'Adama',
    'Borena'
  ];

  useEffect(() => {
    fetchOpportunities();
  }, [selectedSector, selectedLocation]);

  const fetchOpportunities = () => {
    setLoading(true);
    let url = '/api/opportunities?includeDrafts=false';
    if (selectedSector !== 'All') url += `&sector=${encodeURIComponent(selectedSector)}`;
    if (selectedLocation !== 'All') url += `&location=${encodeURIComponent(selectedLocation)}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setOpportunities(data.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedSector('All');
    setSelectedLocation('All');
    fetch('/api/opportunities?includeDrafts=false')
      .then(res => res.json())
      .then(data => setOpportunities(data.data || []));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      {/* Page Title & Intro */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Strategic Investment Opportunities Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Invest in Oromia: High-Impact Priority Projects
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Explore structured commercial and joint-venture opportunities prepared by the Bureau with verified land allocations, utility infrastructure readiness, and full regional tax incentives.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects (e.g., agro-processing, coffee, solar)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm"
            />
          </div>

          {/* Sector Select */}
          <div className="md:col-span-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm cursor-pointer"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>
              ))}
            </select>
          </div>

          {/* Location Select */}
          <div className="md:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors text-center shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Found <strong>{opportunities.length}</strong> active opportunity profiles</span>
          <span>Showing verified projects cleared for foreign and domestic participation</span>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading investment opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200">No matching investment opportunities found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your keyword or sector filter criteria.</p>
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline pt-2"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={opp.imageUrl}
                  alt={opp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {opp.sector}
                </span>
                {opp.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded shadow">
                    Priority
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{opp.location}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {opp.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Required Capital</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{opp.requiredCapital}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Land Allocation</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{opp.landAvailable?.split(' ')[0] || 'Ready'} Hectares</strong>
                    </div>
                  </div>

                  <Link
                    to={`/investment/${opp.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-300 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    <span>View Full Investment Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
