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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Institutional Profile & Mandate</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Oromia Trade & Investment Bureau
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Established under the regional institutional restructuring in October 2026, consolidating the former Oromia Investment and Industry Bureau with the Oromia Trade Bureau into a single, high-efficiency public institution.
        </p>
      </section>

      {/* Vision, Mission, Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-600/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            "To position Oromia as the foremost, globally competitive investment destination and agricultural-industrial export powerhouse in Sub-Saharan Africa by 2035."
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-600/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            "To aggressively mobilize high-impact investments, streamline trade facilitation, protect commercial rights, and deliver world-class digital and physical public services to local and international business partners."
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-600/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Core Values</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Institutional Integrity & Transparency</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Investor-Centric Agility</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sustainable & Inclusive Industrialization</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fair & Equitable Trade Practices</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Institutional Background & Restructuring */}
      <section className="bg-slate-100 rounded-2xl p-8 sm:p-10 border border-slate-200 space-y-6">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Background to the Institutional Restructuring
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Prior to October 2026, foreign and domestic commercial entities navigating business in Oromia engaged with two disparate bodies: the <em>Oromia Investment and Industry Bureau</em> for licensing, incentives, and land; and the <em>Oromia Trade Bureau</em> for commercial registration, market regulation, and commodity exports.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            By unifying these two bodies into the <strong>Oromia Trade and Investment Bureau (OTIB)</strong>, the regional government has established a frictionless end-to-end corridor: from initial project proposal and land allocation, to production incentives, and finally through direct international export market linkage.
          </p>
        </div>
      </section>

      {/* Leadership Team (TOR Section 13) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Executive Governance</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bureau Leadership
          </h2>
          <p className="text-sm text-slate-500">
            Experienced public sector professionals leading Oromia's economic and commercial transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadership.map((leader, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group"
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
                <p className="text-xs text-slate-600 leading-relaxed">
                  {leader.bio}
                </p>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-800">
                  {leader.department}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Organizational Structure / Directorates */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Organizational Architecture</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Core Directorates & Operational Units
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directorates.map((dir, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Building className="w-4 h-4 shrink-0" />
                <span>{dir.name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {dir.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
