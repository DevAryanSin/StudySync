# main.py
import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.cloud import storage
from .rag import answer_question

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryBody(BaseModel):
    group_id: str
    question: str


class ChatBody(BaseModel):
    group_id: str
    query: str


@app.get("/")
def home():
    return {"status": "ok", "message": "CampusConnect Backend is running! ✅"}


@app.on_event("startup")
async def startup_event():
    print("\n" + "="*60)
    print("🚀 CampusConnect Backend Started Successfully!")
    print("="*60)
    print(f"📍 Server running at: http://localhost:8000")
    print(f"📋 Available endpoints:")
    print(f"   - GET  /                (Health check)")
    print(f"   - POST /upload         (Upload files to group)")
    print(f"   - POST /chat           (Chat with group files)")
    print(f"🔧 Make sure your frontend .env.local has:")
    print(f"   NEXT_PUBLIC_API_URL=http://localhost:8000")
    print("="*60 + "\n")



@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    group_id: str = Form(...)
):
    try:
        file_bytes = await file.read()
        
        # Upload to GCS
        bucket_name = os.environ.get("GCS_BUCKET_NAME", "studysync")
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob_name = f"groups/{group_id}/{file.filename}"
        blob = bucket.blob(blob_name)
        blob.upload_from_string(file_bytes, content_type="application/pdf")
        
        gcs_path = f"gs://{bucket_name}/{blob_name}"
        
        return {
            "status": "success",
            "message": f"File '{file.filename}' uploaded successfully",
            "gcs_path": gcs_path,
            "group_id": group_id
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }





@app.post("/chat")
def chat_query(body: ChatBody):
    """Alias for /rag endpoint to match frontend expectations."""
    try:
        print(f"Received chat query for group {body.group_id}: {body.query}")
        result = answer_question(body.group_id, body.query)
        return {"answer": result["answer"], "contexts": result["contexts"]}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in chat_query: {e}")
        return {"answer": f"Error: {str(e)}", "contexts": []}


# local run:
# uvicorn api.main:app --reload

