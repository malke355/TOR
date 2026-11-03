import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Newspaper,
  FileText,
  Mail,
  Plus,
  ArrowRight,
  CheckCircle,
  Eye,
  ShieldCheck,
  Clock,
  ClipboardCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [appStats, setAppStats] = useState({ total: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()).catch(() => null),
      fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()).catch(() => ({ data: [] })),
      fetch('/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()).catch(() => ({ data: [] }))
    ]).then(([statsData, messagesData, appsData]) => {
      setStats(statsData);
      setRecentMessages((messagesData.data || []).slice(0, 5));
      const apps = appsData.data || [];
      setRecentApps(apps.slice(0, 5));
      setAppStats({
        total: apps.length,
        pending: apps.filter(a => (a.status || '').toLowerCase().includes('pending')).length
      });
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department: {user?.department || 'Executive Bureau'} • Role: {user?.role || 'Staff'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/opportunities"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </Link>
          <Link
            to="/admin/news"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publish News</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link
          to="/admin/applications"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-500 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Applications</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {appStats.total}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <strong className="text-amber-700">{appStats.pending} pending review</strong>
          </div>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Opportunities</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.opportunities?.total || 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{stats?.opportunities?.published || 0} Published</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">{stats?.opportunities?.draft || 0} Drafts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">News & Articles</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.news || 0}
          </div>
          <div className="text-xs text-slate-500">
            Official communications published
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Downloads</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.documents || 0}
          </div>
          <div className="text-xs text-slate-500">
            Active directives & application forms
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Public Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.messages?.total || 0}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <strong className="text-purple-700">{stats?.messages?.new || 0} new incoming</strong>
          </div>
        </div>
      </div>

      {/* Recent Service Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Service Applications</h3>
            <p className="text-xs text-slate-500">Electronic permit, duty-free exemption, and license filings.</p>
          </div>
          <Link
            to="/admin/applications"
            className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>Open Applications Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No service applications currently filed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {app.referenceNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{app.applicantName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{app.companyName || 'Enterprise'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {app.serviceTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (app.status || '').toLowerCase().includes('approved')
                          ? 'bg-emerald-100 text-emerald-800'
                          : (app.status || '').toLowerCase().includes('rejected')
                          ? 'bg-red-100 text-red-800'
                          : (app.status || '').toLowerCase().includes('under')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/applications"
                        className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Citizen & Investor Inquiries</h3>
            <p className="text-xs text-slate-500">Inbound submissions awaiting response or action.</p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No inquiries currently received.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{msg.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {msg.subject}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.status === 'New'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/messages"
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        Read
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
