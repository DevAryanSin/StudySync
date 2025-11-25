FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Cloud Run sets the PORT env var; fall back to 8080
ENV PORT=8080

EXPOSE ${PORT}

# Use shell form so the `PORT` environment variable is expanded at container runtime
# Cloud Run sets PORT; default was set above to 8080
CMD uvicorn api.main:app --host 0.0.0.0 --port $PORT
