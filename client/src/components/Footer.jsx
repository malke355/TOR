import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Decorative top ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Bureau Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex flex-col items-center justify-center font-bold text-sm border border-emerald-500">
                OTIB
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-snug">
                  {t.bureau.title}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {t.bureau.region}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footer?.identityDesc || "Formed through the strategic restructuring of the former Oromia Investment and Industry Bureau and Trade Bureau, providing a unified platform for investment facilitation and trade expansion."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/60">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t.footer?.officialGateway || "Official Institutional Government Gateway"}</span>
            </div>
          </div>

          {/* Col 2: Strategic Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase border-b border-slate-800 pb-2">
              {t.footer?.strategicPortals || "Strategic Portals"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/investment" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{t.nav.investment}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/trade" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{t.nav.trade}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{t.nav.services}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{t.nav.documents}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{t.nav.news}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Economic Corridors */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase border-b border-slate-800 pb-2">
              {t.footer?.regionalFocus || "Regional Focus Zones"}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Special Zone Surrounding Finfine</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Adama Free Trade & Logistics Zone</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Bulbula Integrated Agro-Industrial Park (IAIP)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Jimma Specialty Coffee Cluster</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Borena Halal Livestock Corridor</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase border-b border-slate-800 pb-2">
              {t.footer?.headquarters || "Bureau Headquarters"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sarbet, Finfine (Addis Ababa), Oromia Regional Government Offices</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+251 11 551 2233 / +251 11 552 4455</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@investoromia.gov.et</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon - Fri: 8:30 AM – 5:30 PM (EAT)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {t.footer?.rights || "Oromia Trade and Investment Bureau. All rights reserved."}</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Institutional Website MVP Release v1.0</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-white underline">
              {t.footer?.staffPortal || "Staff Portal"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
