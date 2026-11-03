import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  MapPin,
  TrendingUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function ManageOpportunities() {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    sector: 'Agro-Processing',
    location: '',
    investmentType: 'Joint Venture / PPP',
    requiredCapital: '1.50 Billion ETB',
    landAvailable: '30 Hectares with road connectivity',
    status: 'Published',
    imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    description: '',
    contactPerson: 'Oromia Investment Facilitation Directorate'
  });

  const sectors = [
    'Agro-Processing',
    'Manufacturing & Textiles',
    'Agriculture & Agro-Processing',
    'Renewable Energy & Technology',
    'Livestock & Meat',
    'Mining & Mineral Value-Addition',
    'Tourism & Hospitality'
  ];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = () => {
    setLoading(true);
    fetch('/api/opportunities?includeDrafts=true')
      .then(res => res.json())
      .then(data => setOpportunities(data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      sector: 'Agro-Processing',
      location: '',
      investmentType: 'Joint Venture / PPP',
      requiredCapital: '1.50 Billion ETB',
      landAvailable: '30 Hectares with road connectivity',
      status: 'Published',
      imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80',
      summary: '',
      description: '',
      contactPerson: 'Oromia Investment Facilitation Directorate'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (opp) => {
    setEditingItem(opp);
    setFormData({
      title: opp.title,
      sector: opp.sector,
      location: opp.location,
      investmentType: opp.investmentType || 'Joint Venture / PPP',
      requiredCapital: opp.requiredCapital,
      landAvailable: opp.landAvailable || '',
      status: opp.status,
      imageUrl: opp.imageUrl,
      summary: opp.summary,
      description: opp.description,
      contactPerson: opp.contactPerson || 'Oromia Investment Facilitation Directorate'
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investment opportunity?')) return;

    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (opp) => {
    const newStatus = opp.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`/api/opportunities/${opp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Status update failed');
      fetchOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/opportunities/${editingItem.id}` : '/api/opportunities';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save opportunity');
      }

      setModalOpen(false);
      fetchOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Investment Opportunities Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, update, publish, or draft priority investment project profiles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Opportunity Profile</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No opportunities found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Opportunity Title</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Capital Req.</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 max-w-xs">
                      <div className="truncate">{opp.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opp.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{opp.sector}</td>
                    <td className="py-3.5 px-4 text-slate-600">{opp.location}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{opp.requiredCapital}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(opp)}
                        title="Click to toggle publish status"
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                          opp.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {opp.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(opp)}
                        title="Edit Opportunity"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id)}
                        title="Delete Opportunity"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form for Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? 'Edit Investment Opportunity' : 'Create New Investment Profile'}
                </h3>
                <p className="text-xs text-slate-500">Provide verified project details.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Mojo Leather Value Addition Hub"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Sector *</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm bg-white"
                  >
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Location / Zone *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Adama Special Economic Zone"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Estimated Capital *</label>
                  <input
                    type="text"
                    required
                    value={formData.requiredCapital}
                    onChange={(e) => setFormData({ ...formData, requiredCapital: e.target.value })}
                    placeholder="e.g., 1.50 Billion ETB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm bg-white"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Land & Infrastructure Details</label>
                <input
                  type="text"
                  value={formData.landAvailable}
                  onChange={(e) => setFormData({ ...formData, landAvailable: e.target.value })}
                  placeholder="e.g., 25 Hectares with 33kV dedicated substation connection"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Brief Summary *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief one-paragraph project hook..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Description & Project Rationale</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed project scope, domestic supply chains, market rationale..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-xs sm:text-sm"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  {editingItem ? 'Update Opportunity' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
