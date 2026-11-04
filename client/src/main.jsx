import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// When the UI is hosted alone (e.g. Vercel) and the API is elsewhere,
// set VITE_API_BASE to the backend origin so /api calls still work.
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
if (API_BASE) {
  const originalFetch = window.fetch.bind(window)
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      return originalFetch(`${API_BASE}${input}`, init)
    }
    return originalFetch(input, init)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
