import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  TrendingUp,
  Newspaper,
  FileText,
  Mail,
  LogOut,
  ExternalLink,
  ClipboardCheck,
  Sun,
  Moon,
  Package,
  Briefcase
} from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Authenticating...</div>;
  }

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Service Applications', path: '/admin/applications', icon: ClipboardCheck },
    { name: 'Investment Opportunities', path: '/admin/opportunities', icon: TrendingUp },
    { name: 'Trade Products', path: '/admin/trade', icon: Package },
    { name: 'Public Services', path: '/admin/services', icon: Briefcase },
    { name: 'News & Announcements', path: '/admin/news', icon: Newspaper },
    { name: 'Documents & Downloads', path: '/admin/documents', icon: FileText },
    { name: 'Inquiries Inbox', path: '/admin/messages', icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow border border-emerald-500">
              OTIB
            </div>
            <div>
              <h2 className="font-bold text-white text-sm leading-tight">Staff CMS</h2>
              <p className="text-[11px] text-emerald-400">Content Manager</p>
            </div>
          </div>
        </div>

        {/* User Badge */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-600/60 flex items-center justify-center text-emerald-300 font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="truncate">
            <span className="block font-semibold text-white truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-400">{user?.role}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs sm:text-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  active
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">View</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-3.5 flex items-center justify-between transition-colors shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <span className="hidden sm:inline">Oromia Trade and Investment Bureau</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Staff CMS Console</span>
          </div>

          <div className="flex items-center gap-3">
            {/* White & Black Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 shadow-sm transition-all text-xs font-semibold cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">API Connected</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
