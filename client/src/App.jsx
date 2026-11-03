import React, { useState, useEffect } from 'react';

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(`${data.bureau} API (${data.status})`))
      .catch(() => setServerStatus('API Server offline (start backend on :5000)'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-emerald-700 text-white rounded-xl flex items-center justify-center mx-auto text-2xl font-bold shadow-md shadow-emerald-700/20 mb-4">
          OTIB
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Oromia Trade and Investment Bureau
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Biiroo Daldalaa fi Invastimantii Oromiyaa • MVP Institutional Portal
        </p>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block text-left text-xs font-mono">
          <div><span className="text-slate-400">Frontend:</span> <span className="text-emerald-700 font-bold">Vite + React + Tailwind</span></div>
          <div className="mt-1"><span className="text-slate-400">Backend API:</span> <span className="text-blue-700 font-bold">{serverStatus}</span></div>
        </div>

        <p className="text-slate-600 text-sm mt-6">
          Scaffold completed. Ready to implement the public portal and CMS modules.
        </p>
      </div>
    </div>
  );
}

export default App;
