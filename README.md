# Oromia Trade and Investment Bureau (OTIB)

Official portal + Staff CMS. One process serves the API and the built website on **port 5000**.

## Stack
- Client: React + Vite + Tailwind
- Server: Express + MongoDB Atlas + Cloudinary (CMS images) + local uploads (documents/applications)

## Local / production start (port 5000)

```bash
# 1) Install
npm run install:all

# 2) Configure server/.env  (copy from server/.env.example)
#    Required: MONGODB_URI, JWT_SECRET, CLOUDINARY_*

# 3) Build website + start API (serves UI from client/dist)
npm run build
npm start
```

Open: **http://127.0.0.1:5000/**  
Staff login: **http://127.0.0.1:5000/admin/login**  
Demo: `admin@investoromia.gov.et` / `admin123`

Health: `GET /api/health`

## Deploy frontend on Vercel (you can do this yourself)

1. Open [vercel.com/new](https://vercel.com/new) → **Import** `malke355/TOR`.
2. Leave **Root Directory** empty (repo root). Do **not** set it to `client`.
3. Confirm these settings (already in `vercel.json`):
   - **Install Command:** `npm install --include=dev --prefix client`
   - **Build Command:** `npm run build --prefix client`
   - **Output Directory:** `client/dist`
4. Click **Deploy**.

Optional — if your API is already live on another URL, add Environment Variable:
- `VITE_API_BASE` = your backend origin, e.g. `https://your-api.onrender.com`  
  (no trailing slash). Rebuild after adding it.

Vercel hosts the UI only. Login/data need the backend (see full-stack below).

## Deploy full stack (website + API together) on Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/malke355/TOR)

Direct link: https://render.com/deploy?repo=https://github.com/malke355/TOR

When prompted, paste from `server/.env`: `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.  
In MongoDB Atlas → Network Access → allow `0.0.0.0/0`.

## Deploy checklist (backend env vars)
Set these env vars on your host (Render, Railway, VPS, etc.):

| Variable | Purpose |
|----------|---------|
| `PORT` | Usually set by host (default 5000) |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | Strong random secret |
| `CLIENT_ORIGIN` | `*` or your public site URL |
| `CLOUDINARY_CLOUD_NAME` | Image uploads |
| `CLOUDINARY_API_KEY` | Image uploads |
| `CLOUDINARY_API_SECRET` | Image uploads |

Build command: `npm run build`  
Start command: `npm start`

## Dev (optional two-process)
```bash
npm run dev:server   # API :5000
npm run dev:client   # Vite :5173 with /api proxy
```
