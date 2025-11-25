# Backend (FastAPI) — Local testing and GCP Cloud Run deployment

This document explains how to run the backend locally and how to deploy to Google Cloud Run.

Local development

- Create a virtual env and install deps:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate; pip install -r requirements.txt
```

- Run locally with uvicorn:

```powershell
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

Local Docker build and run

```powershell
docker build -t campusconnect-backend:local .
docker run -p 8000:8080 -e PORT=8080 campusconnect-backend:local
# then open http://127.0.0.1:8000
```

Deploy to Cloud Run (quick gcloud guide)

1. Authenticate and set project:

```powershell
gcloud auth login; gcloud config set project YOUR_PROJECT_ID
```

2. Build & push image and deploy (example using Cloud Build):

```powershell
gcloud builds submit --config cloudbuild.yaml . --substitutions=_REGION=us-central1
```

Or manually build and deploy:

```powershell
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/campusconnect-backend:latest .
gcloud run deploy campusconnect-backend --image gcr.io/YOUR_PROJECT_ID/campusconnect-backend:latest --platform managed --region us-central1 --allow-unauthenticated
```

Environment and secrets

- Do NOT commit service account JSON keys. Use Secret Manager and set environment variables in Cloud Run.
- If you must use a service account key locally, keep it out of the repo and reference it via `.env` or environment variables.
