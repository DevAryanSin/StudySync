# Deployment summary — Frontend (Vercel) and Backend (GCP Cloud Run)

This file summarizes the steps and recommended files added to help deploy the project.

Files added

- `backend/Dockerfile` — containerizes the FastAPI app (used for Cloud Run or Docker).
- `backend/.dockerignore` — keeps secrets and build files out of the image.
- `backend/cloudbuild.yaml` — optional Cloud Build pipeline to build & deploy to Cloud Run.
- `backend/README.md` — local and Cloud Run deployment instructions.
- `frontend/vercel.json` — minimal Vercel config with example env var.
- `frontend/.env.example` — example env values for local or Vercel.
- `frontend/README.md` — local and Vercel deployment instructions.

Quick local test (both services)

1. Run backend locally:

```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate; pip install -r requirements.txt
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

2. Run frontend locally (in another terminal):

```powershell
cd frontend
npm install
set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000; npm run dev
```

Deploying backend to Cloud Run (summary)

- Use `gcloud run deploy` or submit `cloudbuild.yaml` via `gcloud builds submit`.
- Use Secret Manager for credentials; set env vars in Cloud Run for runtime configuration.

Deploying frontend to Vercel

- Connect repo to Vercel and set `NEXT_PUBLIC_API_URL` to your Cloud Run URL in the Vercel dashboard.

Deploying frontend to Netlify

- This repository includes a `netlify.toml` configured for the Next plugin and sets `NEXT_PUBLIC_API_URL` for both build-time and production in the file. Netlify will use that value during builds and at runtime.
- If you prefer to set or override the value in the Netlify UI: open your site in Netlify → Site settings → Build & deploy → Environment → Environment variables, add `NEXT_PUBLIC_API_URL` with value `https://studysync-136760819044.us-central1.run.app`.
- Ensure the `@netlify/plugin-nextjs` plugin is installed in the `frontend` folder before building on Netlify (see `netlify.toml` notes).
