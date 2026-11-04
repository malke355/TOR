import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  ExternalLink,
  User,
  Building,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Download,
  Briefcase
} from 'lucide-react';

export default function ManageApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    fetch('/api/applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setApplications(data.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, reviewNotes })
      });
      if (!res.ok) throw new Error('Failed to update application status');
      const data = await res.json();
      
      // Update local state
      setApplications(prev => prev.map(a => a.id === id ? data.data : a));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(data.data);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application record? This cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete application');
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
    } catch (err) {
      alert('Error deleting application: ' + err.message);
    }
  };

  // Filtered list
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.serviceTitle || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (app.status || '').toLowerCase() === statusFilter.toLowerCase();

    const matchesService =
      serviceFilter === 'All' ||
      app.serviceId === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // KPI Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => (a.status || '').toLowerCase().includes('pending')).length;
  const underReviewCount = applications.filter(a => (a.status || '').toLowerCase().includes('under')).length;
  const approvedCount = applications.filter(a => (a.status || '').toLowerCase().includes('approved')).length;
  const rejectedCount = applications.filter(a => (a.status || '').toLowerCase().includes('rejected')).length;

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('approved')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    }
    if (s.includes('rejected')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-700">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    if (s.includes('under')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
          <Clock className="w-3.5 h-3.5" /> Under Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
        <AlertCircle className="w-3.5 h-3.5" /> Pending Review
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Service Applications Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Process, evaluate, and manage electronic applications submitted through the Bureau Investor Portal.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Refresh
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusFilter('All')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'All'
              ? 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase block">Total</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Pending Review')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter.toLowerCase().includes('pending')
              ? 'border-amber-600 dark:border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase block">Pending</span>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{pendingCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Under Review')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter.toLowerCase().includes('under')
              ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase block">Under Review</span>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">{underReviewCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter.toLowerCase().includes('approved')
              ? 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase block">Approved</span>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{approvedCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter.toLowerCase().includes('rejected')
              ? 'border-red-600 dark:border-red-500 ring-2 ring-red-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase block">Rejected</span>
          <div className="text-2xl font-black text-red-700 dark:text-red-400 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference, name, company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="All">All Services</option>
            <option value="srv-01">Investment Permit (srv-01)</option>
            <option value="srv-03">Duty-Free Exemption (srv-03)</option>
            <option value="srv-04">Export Trade License (srv-04)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="py-20 text-center text-slate-400 dark:text-slate-500 text-xs">Loading service applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs space-y-2">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">No applications found matching current criteria.</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Applications submitted on the public portal will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Reference No.</th>
                  <th className="py-3.5 px-4">Applicant & Enterprise</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setReviewNotes(app.reviewNotes || '');
                    }}
                    className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                      {app.referenceNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {app.companyName || 'Individual / Enterprise'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{app.serviceTitle}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">{app.serviceId}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : '—'}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewNotes(app.reviewNotes || '');
                          }}
                          className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                          title="View Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dossier Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 p-6 sm:p-8 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {selectedApp.referenceNumber}
                  </span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  {selectedApp.serviceTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submitted on {new Date(selectedApp.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Applicant Contact Information */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Applicant & Representative
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Full Legal Name</span>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">{selectedApp.applicantName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Email Address</span>
                  <a href={`mailto:${selectedApp.applicantEmail}`} className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold">
                    {selectedApp.applicantEmail}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Phone Number</span>
                  <span className="text-slate-800 dark:text-slate-100 font-mono font-semibold">{selectedApp.applicantPhone || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Residential Address</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedApp.formData?.address || '—'}</span>
                </div>
              </div>
            </div>

            {/* Enterprise & Regulatory Identifiers */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Enterprise & Regulatory Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Company Name</span>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">{selectedApp.companyName || selectedApp.formData?.companyName || '—'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">National ID / Passport</span>
                  <span className="text-slate-800 dark:text-slate-100 font-mono font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {selectedApp.formData?.passportId || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px]">TIN Number</span>
                  <span className="text-slate-800 dark:text-slate-100 font-mono font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {selectedApp.formData?.tinNumber || '—'}
                  </span>
                </div>
                {selectedApp.formData?.investorType && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Investor Type</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedApp.formData.investorType}</span>
                  </div>
                )}
                {selectedApp.formData?.businessSector && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Business Sector</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedApp.formData.businessSector}</span>
                  </div>
                )}
                {selectedApp.formData?.existingLicense && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Existing License</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedApp.formData.existingLicense}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project / Operational Specifications */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Project & Operational Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedApp.formData?.projectTitle && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Project Title</span>
                    <p className="text-slate-900 dark:text-white font-bold text-sm">{selectedApp.formData.projectTitle}</p>
                  </div>
                )}
                {selectedApp.formData?.estimatedCapital && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Estimated Capital (ETB)</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-black font-mono">
                      {Number(selectedApp.formData.estimatedCapital).toLocaleString()} ETB
                    </strong>
                  </div>
                )}
                {selectedApp.formData?.employmentProjection && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Projected Employment</span>
                    <strong className="text-slate-800 dark:text-slate-100 font-bold">{selectedApp.formData.employmentProjection} Jobs</strong>
                  </div>
                )}
                {selectedApp.formData?.investmentZone && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Target Zone / Location</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedApp.formData.investmentZone}</span>
                  </div>
                )}
                {selectedApp.formData?.landRequirement && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Land Requirement</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedApp.formData.landRequirement}</span>
                  </div>
                )}
                {selectedApp.formData?.projectDescription && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">Detailed Description</span>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                      {selectedApp.formData.projectDescription}
                    </p>
                  </div>
                )}
                {selectedApp.formData?.additionalNotes && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] mb-1">Additional Notes or Special Requests</span>
                    <p className="text-slate-700 dark:text-amber-200/90 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                      {selectedApp.formData.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Documents */}
            {selectedApp.uploadedDocuments && selectedApp.uploadedDocuments.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-white dark:bg-slate-900">
                <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Attached Verification Documents ({selectedApp.uploadedDocuments.length})
                </h3>
                <div className="space-y-1.5">
                  {selectedApp.uploadedDocuments.map((doc, idx) => {
                    const label = typeof doc === 'string' ? doc : (doc.label || doc.fieldName || 'Attachment');
                    const fileName = typeof doc === 'string' ? '' : (doc.fileName || '');
                    const canDownload = typeof doc !== 'string' && doc.downloadUrl && doc.storedFileName;

                    const handleFileDownload = async () => {
                      if (!canDownload) return;
                      try {
                        const res = await fetch(doc.downloadUrl, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (!res.ok) throw new Error('Download failed');
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName || doc.storedFileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } catch (err) {
                        alert(err.message || 'Unable to download file');
                      }
                    };

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{label}</span>
                            {fileName && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate block">{fileName}{doc.fileSize ? ` • ${doc.fileSize}` : ''}</span>
                            )}
                          </div>
                        </div>
                        {canDownload ? (
                          <button
                            type="button"
                            onClick={handleFileDownload}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 cursor-pointer shrink-0"
                          >
                            Download
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                            No file
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Official Review & Decision Section */}
            <div className="bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase text-emerald-900 dark:text-emerald-300 tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> Bureau Decision & Review Notes
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Review Notes / Internal Remarks
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g., Documents verified. Articles of association notarized. Approved for investment permit issuance."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Update Status:</span>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Under Review')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Set Under Review
                  </button>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Approve Application
                  </button>
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Reject Application
                  </button>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
