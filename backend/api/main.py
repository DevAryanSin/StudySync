from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment variables.")

supabase: Client = create_client(url, key) if url and key else None

from . import rag

class ChatRequest(BaseModel):
    query: str
    group_id: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload")
async def upload_file(group_id: str = Form(...), file: UploadFile = File(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    # Read file content
    content = await file.read()
    
    # Upload to Supabase Storage
    file_path = f"{group_id}/{file.filename}"
    try:
        supabase.storage.from_("group-files").upload(file_path, content)
    except Exception as e:
        # If file exists, we might want to overwrite or skip. For now, let's just print error and continue to processing
        print(f"Storage upload error (might already exist): {e}")

    # Process and Store Embeddings
    try:
        await rag.process_and_store_file(supabase, group_id, content, file.filename)
    except Exception as e:
        print(f"RAG processing error: {e}")
        raise HTTPException(status_code=500, detail=f"RAG processing failed: {str(e)}")

    return {"message": "File uploaded and processed successfully"}

@app.post("/chat")
async def chat(request: ChatRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        answer = rag.query_rag(supabase, request.group_id, request.query)
        return {"answer": answer}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
