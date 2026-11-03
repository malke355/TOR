import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Download, Search, FileCheck, Calendar, ShieldCheck } from 'lucide-react';

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Investment Guide',
    'Directives & Laws',
    'Trade Procedures',
    'Application Forms'
  ];

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const fetchDocuments = () => {
    setLoading(true);
    let url = '/api/documents';
    const params = [];
    if (selectedCategory !== 'All') params.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setDocuments(data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleDownload = (doc) => {
    const content = `OROMIA TRADE AND INVESTMENT BUREAU
===================================================
Document: ${doc.title}
Reference: ${doc.refNumber}
Category: ${doc.category}
Date of Publication: ${doc.publishedDate}
===================================================
This is an official document issued by the Oromia Trade and Investment Bureau.
For verified inquiries contact: info@investoromia.gov.et`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{t.documents?.badge || "Official Public Document Repository"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.documents?.title || "Downloads, Directives & Application Forms"}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {t.documents?.desc || "Access and download approved investment policies, regional land lease directives, standard licensing application forms, and export procedure compendiums."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or ref number (e.g. DIR-144)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
          />
        </form>
      </div>

      {/* Documents Table / Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading document repository...</div>
      ) : documents.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">No documents found matching your filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Document Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 hidden md:table-cell">Reference</th>
                  <th className="py-4 px-4 hidden sm:table-cell">Format & Size</th>
                  <th className="py-4 px-4 hidden lg:table-cell">Published Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0 border border-red-200 dark:border-red-900/40">
                          PDF
                        </div>
                        <span className="line-clamp-2">{doc.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell font-mono text-xs text-slate-500 dark:text-slate-400">
                      {doc.refNumber}
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-500 dark:text-slate-400">
                      {doc.fileType} • {doc.fileSize}
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-500 dark:text-slate-400">
                      {doc.publishedDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-700 hover:text-white text-emerald-800 dark:text-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.documents?.download || "Download"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
