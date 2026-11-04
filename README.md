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

## One-click deploy (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/malke355/TOR)

Direct link: https://render.com/deploy?repo=https://github.com/malke355/TOR

When Render asks, paste these from your local `server/.env`:
`MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Also in MongoDB Atlas → Network Access → allow `0.0.0.0/0` so Render can reach the database.

## Deploy checklist
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

Build command: `npm run install:all && npm run build`  
Start command: `npm start`

## Dev (optional two-process)
```bash
npm run dev:server   # API :5000
npm run dev:client   # Vite :5180 with /api proxy
```
