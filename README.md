# Oromia Trade and Investment Bureau (OTIB)
## Institutional Website & CMS — Minimum Viable Product (MVP)

A modern, responsive, and manageable institutional digital portal for the newly restructured **Oromia Trade and Investment Bureau** (*Biiroo Daldalaa fi Invastimantii Oromiyaa*).

Developed as the MVP implementation of the institutional Terms of Reference (TOR).

---

### 🏛️ Core System Architecture

```
├── client/                     # Public Portal & Admin CMS (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable institutional UI components
│   │   ├── pages/              # Public & Admin CMS views
│   │   ├── locales/            # Multilingual dictionaries (EN / Afaan Oromoo / Amharic)
│   │   └── App.jsx
│   └── vite.config.js          # Configured with proxy to backend API (:5000)
│
├── server/                     # Backend REST API (Node.js + Express + JWT)
│   ├── src/
│   │   ├── config/             # Store & realistic Oromia seed data
│   │   ├── middleware/         # JWT Authentication & role protection
│   │   ├── routes/             # Opportunities, Trade, News, Services, Documents, Inquiries
│   │   └── index.js            # Express server entry point
│   └── data/                   # Persistent local store data
│
└── package.json                # Root management scripts
```

---

### 🚀 Getting Started

#### 1. Install Dependencies
```bash
# In root directory:
npm run install:all
```
*(Or navigate to `/server` and `/client` individually and run `npm install`)*

#### 2. Start the Backend API
```bash
npm run dev:server
# Server starts on http://localhost:5000
```

#### 3. Start the Frontend Client
```bash
npm run dev:client
# Client starts on http://localhost:5173
```

---

### 🔑 Default Demo Administrator Credentials
* **Email:** `admin@investoromia.gov.et`
* **Password:** `admin123`
* **Role:** Administrator (Executive Bureau Directorate)

---

### 🌐 Official API Endpoints (MVP)

| Module | Method | Endpoint | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/login` | Public |
| **Auth** | GET | `/api/auth/me` | Protected (JWT) |
| **Stats** | GET | `/api/stats` | Public |
| **Investment** | GET | `/api/opportunities` | Public (Published only) |
| **Investment** | POST / PUT / DELETE | `/api/opportunities/:id?` | Protected (Admin) |
| **Trade** | GET | `/api/trade` | Public |
| **Trade** | POST | `/api/trade` | Protected (Admin) |
| **News** | GET | `/api/news` | Public |
| **News** | POST / PUT / DELETE | `/api/news/:id?` | Protected (Admin) |
| **Services** | GET | `/api/services` | Public |
| **Services** | POST | `/api/services` | Protected (Admin) |
| **Documents** | GET | `/api/documents` | Public |
| **Documents** | POST / DELETE | `/api/documents/:id?` | Protected (Admin) |
| **Inquiries** | POST | `/api/messages` | Public |
| **Inquiries** | GET / PATCH / DELETE | `/api/messages/:id?` | Protected (Admin) |
