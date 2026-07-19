# GuardianAI Deployment Guide

Two pieces: FastAPI **backend** on Render, React/Vite **frontend** on Vercel.

## 1. Backend → Render
The repo includes `render.yaml` (a Render Blueprint).

1. Push this repo to GitHub (already at `NikithaJadhav/GuardianAI`).
2. In Render: **New → Blueprint** and select the repo. Render reads `render.yaml`,
   which builds from `backend/` and starts `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Set environment variables (marked `sync: false`, so Render prompts for them):
   - `ALLOWED_ORIGINS` = your Vercel URL, e.g. `https://guardianai.vercel.app`
     (or `*` to allow any origin).
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` — for real SMS.
     Leave unset to run with SMS disabled (alerts still work; delivery is skipped).
4. After deploy, note the backend URL, e.g. `https://guardianai-backend.onrender.com`.
   Verify: `GET /` returns `{"message":"GuardianAI Backend Running Successfully"}`.

> Note: Render free tier sleeps on inactivity; the first request after idle can take ~30–60s.

## 2. Frontend → Vercel
`frontend/vercel.json` configures the SPA build (incl. the rolldown/npm optional-deps
workaround) and client-side routing.

1. In Vercel: **Add New → Project**, import the repo, and set **Root Directory = `frontend`**.
2. Add an environment variable:
   - `VITE_API_BASE_URL` = your Render backend URL (e.g. `https://guardianai-backend.onrender.com`).
   Vite inlines this at build time, so redeploy after changing it.
3. Deploy. Vercel gives a URL, e.g. `https://guardianai.vercel.app`.
4. Go back to Render and set `ALLOWED_ORIGINS` to that Vercel URL, then redeploy the backend.

## 3. Firebase
Firebase Auth/Firestore config is bundled in `frontend/src/firebase/`. Add your deployed
Vercel domain to **Firebase Console → Authentication → Settings → Authorized domains**.

## Local development
```
# backend
cd backend && python -m venv venv && venv/bin/pip install -r requirements.txt
source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# frontend
cd frontend && npm install && npm install @rolldown/binding-linux-x64-gnu
npm run dev   # http://localhost:5173  (defaults to backend http://127.0.0.1:8000)
```
