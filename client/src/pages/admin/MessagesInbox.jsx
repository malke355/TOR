import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Check, Trash2, X, Phone, Building, Calendar, AlertCircle } from 'lucide-react';

export default function MessagesInbox() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    fetch('/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/messages/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchMessages();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg({ ...selectedMsg, status });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      if (selectedMsg?.id === id) setSelectedMsg(null);
      fetchMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Public & Investor Inquiries Inbox
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review incoming requests, investor consultations, and trade facilitation messages.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="py-20 text-center text-slate-400 dark:text-slate-500 text-xs">Loading inbox...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">No inquiries currently in inbox.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Sender Details</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Received Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => {
                      setSelectedMsg(msg);
                      if (msg.status === 'New') handleUpdateStatus(msg.id, 'Read');
                    }}
                    className={`cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      msg.status === 'New' ? 'bg-purple-50/30 dark:bg-purple-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900 dark:text-white">{msg.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">{msg.organization} • {msg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {msg.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.status === 'New'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                          : msg.status === 'Replied'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      {msg.status !== 'Replied' && (
                        <button
                          onClick={() => handleUpdateStatus(msg.id, 'Replied')}
                          title="Mark as Replied"
                          className="p-1.5 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        title="Delete Message"
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
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

      {/* Message Detail Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Ref: {selectedMsg.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedMsg.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(selectedMsg.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <div><strong>Sender:</strong> {selectedMsg.name}</div>
              <div><strong>Organization:</strong> {selectedMsg.organization}</div>
              <div><strong>Email:</strong> <a href={`mailto:${selectedMsg.email}`} className="text-emerald-700 dark:text-emerald-400 underline">{selectedMsg.email}</a></div>
              {selectedMsg.phone && <div><strong>Phone:</strong> {selectedMsg.phone}</div>}
              <div><strong>Status:</strong> <span className="font-semibold text-emerald-800 dark:text-emerald-400">{selectedMsg.status}</span></div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Inquiry Content:</span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed whitespace-pre-line">
                {selectedMsg.message}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => handleUpdateStatus(selectedMsg.id, 'Replied')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Mark as Replied
              </button>
              <button
                onClick={() => setSelectedMsg(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold px-3 py-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
