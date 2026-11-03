import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  Phone,
  Mail,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronDown,
  Building2,
  TrendingUp,
  Package,
  Layers,
  FileText,
  Newspaper,
  PhoneCall
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t.nav.home, path: '/', icon: Building2 },
    { name: t.nav.about, path: '/about', icon: Layers },
    { name: t.nav.investment, path: '/investment', icon: TrendingUp },
    { name: t.nav.trade, path: '/trade', icon: Package },
    { name: t.nav.services, path: '/services', icon: Layers },
    { name: t.nav.news, path: '/news', icon: Newspaper },
    { name: t.nav.documents, path: '/documents', icon: FileText },
    { name: t.nav.contact, path: '/contact', icon: PhoneCall },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Institutional Top Ribbon with regional colors */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-stone-900 to-white border-b border-slate-200"></div>

      {/* Top Meta Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+251 11 551 2233 / +251 11 552 4455</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>info@investoromia.gov.et</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-medium text-xs pr-1"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="om" className="bg-slate-900 text-white">Afaan Oromoo</option>
                <option value="am" className="bg-slate-900 text-white">አማርኛ</option>
              </select>
            </div>

            {/* Admin CMS Access */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>CMS ({user?.role || 'Staff'})</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-400 p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-800"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.nav.admin}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Bureau Emblem & Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex flex-col items-center justify-center font-black tracking-wider shadow-md shadow-emerald-900/20 border-2 border-emerald-600 group-hover:scale-105 transition-transform">
            <span className="text-base leading-none font-extrabold text-amber-300">OTIB</span>
            <span className="text-[9px] text-emerald-200 tracking-tighter">OROMIA</span>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-emerald-800 transition-colors">
              {t.bureau.title}
            </div>
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              {t.bureau.tagline}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 mt-2"
            >
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Admin CMS Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 mt-2"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Staff Login</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
