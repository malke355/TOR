import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Globe,
  Phone,
  Mail,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.investment, path: '/investment' },
    { name: t.nav.trade, path: '/trade' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.news, path: '/news' },
    { name: t.nav.documents, path: '/documents' },
    { name: t.nav.contact, path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Regional Flag Tricolor Header Accent (Red, Black, White + Gold) */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-stone-900 to-amber-500"></div>

      {/* Top Utility Meta Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Contact Direct Line */}
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium tracking-tight">+251 11 551 2233</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>info@investoromia.gov.et</span>
            </span>
          </div>

          {/* Right Tools: Theme Toggle, Language & Staff Portal */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200 text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline text-slate-300 text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* Multilingual Selector */}
            <div className="relative inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-medium text-xs pr-4 appearance-none"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="om" className="bg-slate-900 text-white">Afaan Oromoo</option>
                <option value="am" className="bg-slate-900 text-white">አማርኛ</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2" />
            </div>

            {/* Staff CMS Access */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-emerald-300 hover:text-white font-semibold bg-emerald-950/80 border border-emerald-700 px-3 py-1 rounded-lg transition-all text-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CMS Console</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium text-xs py-1 px-2.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.nav.admin}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-6">
        {/* Institutional Crest & Emblem */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-950/20 border border-emerald-500/50 group-hover:scale-105 transition-transform">
            <span className="text-[13px] font-black text-amber-400 tracking-wider leading-none">OTIB</span>
            <span className="text-[8px] font-extrabold text-emerald-200 tracking-widest uppercase">OROMIA</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-extrabold tracking-widest text-amber-600 dark:text-amber-400 uppercase block">
              {t.bureau.region}
            </span>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {t.bureau.title}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
              Biiroo Daldalaa fi Invastimantii Oromiyaa
            </p>
          </div>
        </Link>

        {/* Desktop Single-Line Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors rounded-lg ${
                  active
                    ? 'text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-emerald-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/80'
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Direct Call to Action Button */}
        <div className="hidden xl:flex items-center shrink-0">
          <Link
            to="/investment"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all group"
          >
            <span>{t.nav.investCTA || 'Invest in Oromia'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link
              to="/investment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl"
            >
              <span>{t.nav.investCTA || 'Invest in Oromia'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold py-2 rounded-xl"
              >
                <Shield className="w-4 h-4" />
                <span>Admin CMS Console</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold py-2 rounded-xl"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Staff CMS Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
