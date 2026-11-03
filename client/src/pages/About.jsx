import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Target,
  Compass,
  Award,
  Users,
  Building,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  const leadership = [
    {
      name: "Ato Gemechu Bekele",
      title: "Bureau Head & Commissioner",
      department: "Executive Bureau Leadership",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Oversees strategic regional investment policy, high-level diplomatic investor engagements, and the execution of the unified trade-investment transformation plan."
    },
    {
      name: "Dr. Aster Tolera",
      title: "Deputy Head, Investment Promotion & Licensing",
      department: "Investment Directorate",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Leads the One-Stop-Shop investor service center, incentive endorsements, land bank allocations, and joint-venture facilitation across all 21 zones."
    },
    {
      name: "Ato Tadesse Gudeta",
      title: "Deputy Head, Trade Promotion & Market Development",
      department: "Trade & Export Directorate",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Directs agricultural commodity export strategies, international trade fair missions, bilateral buyer-seller linkages, and commercial regulation."
    }
  ];

  const directorates = [
    {
      name: "Investment Promotion & Facilitation Directorate",
      role: "Identifies strategic opportunities, conducts feasibility profiling, and markets Oromia's investment potential globally."
    },
    {
      name: "Licensing & One-Stop-Shop Directorate",
      role: "Issues new investment permits, processes renewals, and coordinates duty-free endorsements with federal authorities."
    },
    {
      name: "Land Bank & Spatial Infrastructure Directorate",
      role: "Manages industrial park demarcations, agro-processing clusters, and land lease agreements for certified investors."
    },
    {
      name: "Export Trade & Market Linkage Directorate",
      role: "Supports regional coffee, oilseeds, and livestock exporters with quality standardization, logistics, and foreign buyer connections."
    },
    {
      name: "Trade Registration & Commercial Regulation Directorate",
      role: "Ensures compliance with commercial laws, fair trade practices, and consumer protection across the region."
    },
    {
      name: "Policy, Planning & Information Technology Directorate",
      role: "Formulates evidence-based economic guidelines, digital governance platforms, and investor aftercare tracking."
    }
  ];

  return (
    <div className="space-y-16 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{t.about?.badge || "Institutional Profile & Mandate"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.about?.title || "About Oromia Trade & Investment Bureau"}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.about?.desc || "Established under the regional institutional restructuring in October 2026, consolidating the former Oromia Investment and Industry Bureau with the Oromia Trade Bureau into a single, high-efficiency public institution."}
        </p>
      </section>

      {/* Vision, Mission, Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-600/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.about?.visionTitle || "Our Vision"}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about?.visionDesc || '"To position Oromia as the foremost, globally competitive investment destination and agricultural-industrial export powerhouse in Sub-Saharan Africa by 2035."'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-600/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.about?.missionTitle || "Our Mission"}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about?.missionDesc || '"To aggressively mobilize high-impact investments, streamline trade facilitation, protect commercial rights, and deliver world-class digital and physical public services to local and international business partners."'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-600/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.about?.valuesTitle || "Core Values"}</h3>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.about?.v1 || "Institutional Integrity & Transparency"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.about?.v2 || "Investor-Centric Agility"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.about?.v3 || "Sustainable & Inclusive Industrialization"}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.about?.v4 || "Fair & Equitable Trade Practices"}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Institutional Background & Restructuring */}
      <section className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-6 transition-colors">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.about?.restructuringTitle || "Background to the Institutional Restructuring"}
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {t.about?.restructuringP1 || "Prior to October 2026, foreign and domestic commercial entities navigating business in Oromia engaged with two disparate bodies: the former Investment Bureau for licensing and land, and the Trade Bureau for registration and export."}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {t.about?.restructuringP2 || "By unifying these bodies into the Oromia Trade and Investment Bureau (OTIB), the regional government has established a frictionless end-to-end corridor: from project proposal to international export market linkage."}
          </p>
        </div>
      </section>

      {/* Leadership Team (TOR Section 13) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">{t.about?.governanceTitle || "Executive Governance"}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.about?.governanceSubtitle || "Bureau Leadership"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Experienced public sector professionals leading Oromia's economic and commercial transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadership.map((leader, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col group transition-colors"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-lg leading-tight">{leader.name}</h4>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">{leader.title}</p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {leader.bio}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                  {leader.department}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Organizational Structure / Directorates */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">{t.about?.directoratesTitle || "Organizational Architecture"}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.about?.directoratesSubtitle || "Core Directorates & Operational Units"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directorates.map((dir, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 transition-colors">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <Building className="w-4 h-4 shrink-0" />
                <span>{dir.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {dir.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
