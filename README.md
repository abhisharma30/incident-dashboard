# Incident Dashboard (React + Vite)

Real-time incident management dashboard with mock REST and WebSocket simulation, filters, pagination, skeleton UI, and responsive design.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

This project is ready for Vercel static hosting. SPA routing is configured via `vercel.json` to rewrite all paths to `index.html`.

Steps:
1. Push this repo to GitHub under your account (`abhisharma30`).
2. Go to Vercel and import the repo.
   - Framework preset: Vite
   - Build Command: `vite build` (already set by Vercel)
   - Output Directory: `dist`
3. Deploy.

Notes:
- Mock API is in-browser (fetch patched), so no server config is required.
- Realtime is simulated with an interval; no external WebSocket service needed.

## Environment
None needed for the mock demo. For a real API, replace the mock layer in `src/mocks` and `src/helpers/websocket.ts`.
