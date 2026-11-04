import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ImagePlus, Loader2, Link2 } from 'lucide-react';

/**
 * Staff CMS image field: upload to Cloudinary (preferred) or paste a URL.
 */
export default function CloudinaryImageField({
  label = 'Featured Image',
  value = '',
  onChange,
  folder = 'otib'
}) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('folder', folder);

      const res = await fetch('/api/uploads/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{label}</label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <img src={value} alt="Preview" className="w-full h-36 object-cover" />
        </div>
      ) : null}

      <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-3 py-3 text-xs font-semibold cursor-pointer transition-colors ${
        uploading
          ? 'border-emerald-300 bg-emerald-50/50 text-emerald-700'
          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-600 dark:text-slate-300'
      }`}>
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading to Cloudinary...
          </>
        ) : (
          <>
            <ImagePlus className="w-4 h-4 text-emerald-600" />
            Upload image to Cloudinary
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={handleFile}
        />
      </label>

      <div className="relative">
        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL"
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 text-xs"
        />
      </div>

      {error ? <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
