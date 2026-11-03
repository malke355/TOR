import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2, Building2 } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setArticle(data.data))
      .catch(err => {
        console.error(err);
        setArticle(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-24 text-center text-slate-400">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-sm text-slate-500">The article you requested could not be located.</p>
        <Link to="/news" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News Center</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div>
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News & Media Center</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Published on {article.publishedAt}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-base text-slate-600 font-medium italic border-l-4 border-emerald-600 pl-4 py-1">
          {article.summary}
        </p>
      </div>

      <div className="w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
        {article.content}
      </div>

      <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Oromia Trade and Investment Bureau Press & Public Relations Directorate</span>
        <span>Reference ID: {article.id}</span>
      </div>
    </article>
  );
}
