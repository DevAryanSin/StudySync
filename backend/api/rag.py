# rag.py
import os
import requests
import time
from typing import List, Dict, Any
from pathlib import Path
from google.cloud import firestore
from google.cloud import storage
from google.cloud import aiplatform  # Move import to top
from google.auth import default
from google.auth.transport.requests import Request
from google.cloud.aiplatform.matching_engine.matching_engine_index_endpoint import Namespace

# Load environment variables
from dotenv import load_dotenv
backend_dir = Path(__file__).parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

# ---------------- CONFIG ----------------

PROJECT_ID = os.environ.get("PROJECT_ID", "studysync-479305")
REGION = os.environ.get("REGION", "us-central1")
ENDPOINT_ID = os.environ.get("ENDPOINT_ID", "4856694592491225088")
DEPLOYED_ID = os.environ.get("DEPLOYED_ID", "syncv1_1764053160166")
GEMINI_MODEL = "gemini-2.0-flash"

FIRESTORE_DB = os.environ.get("FIRESTORE_DB", "default")
FIRESTORE_COLLECTION = os.environ.get("FIRESTORE_COLLECTION", "group_files")
GCS_CHUNKS_BUCKET = os.environ.get("GCS_CHUNKS_BUCKET", "sync_chunks")

# ---------------- GLOBAL CLIENT INITIALIZATION ----------------
# We initialize these ONCE globally, not inside functions.

print("--- Initializing Google Cloud Clients ---")

# 1. Credentials
credentials, _ = default(scopes=["https://www.googleapis.com/auth/cloud-platform"])

# 2. Firestore
try:
    firestore_client = firestore.Client(database=FIRESTORE_DB)
    print(f"✅ Connected to Firestore DB: {FIRESTORE_DB}")
except Exception as e:
    print(f"❌ Failed to connect to Firestore: {e}")
    firestore_client = None

# 3. Storage
storage_client = storage.Client()

# 4. Vertex AI (Initialize once)
try:
    aiplatform.init(project=PROJECT_ID, location=REGION, credentials=credentials)
    # We create the endpoint object here so we don't fetch it on every request
    index_endpoint_client = aiplatform.MatchingEngineIndexEndpoint(
        index_endpoint_name=f"projects/{PROJECT_ID}/locations/{REGION}/indexEndpoints/{ENDPOINT_ID}"
    )
    print(f"✅ Connected to Vertex AI Index Endpoint: {ENDPOINT_ID}")
except Exception as e:
    print(f"❌ Failed to connect to Vertex AI: {e}")
    index_endpoint_client = None


# ---------------- EMBEDDINGS ----------------

def embed_text(text: str) -> List[float]:
    print(f"   [Embed] Generating embedding for query ({len(text)} chars)...")
    start_time = time.time()
    
    url = (
        f"https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/"
        f"locations/{REGION}/publishers/google/models/text-embedding-004:predict"
    )

    payload = {"instances": [{"content": text}]}
    
    # Refresh token if needed
    if not credentials.valid:
        credentials.refresh(Request())
        
    headers = {"Authorization": f"Bearer {credentials.token}"}

    try:
        res = requests.post(url, json=payload, headers=headers, timeout=10) # Reduced timeout
        if res.status_code != 200:
            print(f"   [Embed] Error {res.status_code}: {res.text}")
            return []
        data = res.json()
        embedding = data["predictions"][0]["embeddings"]["values"]
        print(f"   [Embed] Done in {time.time() - start_time:.2f}s (embedding length: {len(embedding)})")
        return embedding
    except Exception as e:
        print(f"   [Embed] Failed: {e}")
        import traceback
        traceback.print_exc()
        return []


# ---------------- VECTOR SEARCH ----------------

def search_vector(group_id: str, embedding: List[float], top_k: int = 3) -> List[Dict[str, Any]]:
    if not index_endpoint_client:
        print("   [Search] Vector Search client not initialized.")
        return []

    print(f"   [Search] Querying Vector Index (top_k={top_k})...")
    start_time = time.time()

    try:
        neighbors = index_endpoint_client.find_neighbors(
            deployed_index_id=DEPLOYED_ID,
            queries=[embedding],
            num_neighbors=top_k,
            filter=[Namespace("group_id", [group_id], [])],
        )
    except Exception as e:
        print(f"   [Search] Error: {e}")
        import traceback
        traceback.print_exc()
        return []

    print(f"   [Search] Done in {time.time() - start_time:.2f}s. Found {len(neighbors[0]) if neighbors else 0} neighbors.")

    if not neighbors or len(neighbors) == 0:
        print("   [Search] No neighbors found.")
        return []

    result = []
    # neighbors[0] is the list of matches for the first query
    for n in neighbors[0]:
        result.append({
            "datapoint_id": str(n.id),
            "score": n.distance,
            "text": ""
        })
    return result


# ---------------- GEMINI ANSWERING ----------------

def generate_answer(question: str, contexts: List[str]) -> str:
    print("   [Gemini] Sending prompt to LLM...")
    start_time = time.time()

    context_text = "\n\n".join(contexts) if contexts else "No context found."
    
    context_info = f"({len(contexts)} file chunks)" if contexts else "(No file context available)"
    
    prompt = f"""
    You are a helpful study assistant. Use the context below to answer the student's question.
    If the context is empty or no file chunks were found, try to answer from general knowledge 
    but clearly mention that you couldn't find specific files to reference.
    
    CONTEXT from Group Files {context_info}:
    {context_text}
    
    STUDENT QUESTION:
    {question}
    
    ANSWER:
    """

    url = (
        f"https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/"
        f"locations/{REGION}/publishers/google/models/{GEMINI_MODEL}:generateContent"
    )

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024
        }
    }

    if not credentials.valid:
        credentials.refresh(Request())
    headers = {"Authorization": f"Bearer {credentials.token}"}

    try:
        res = requests.post(url, json=payload, headers=headers, timeout=30)
        if res.status_code != 200:
            print(f"   [Gemini] Error {res.status_code}: {res.text}")
            return f"Error: Gemini API returned status {res.status_code}. Please try again."
        
        data = res.json()
        
        # Check if response has expected structure
        if "candidates" not in data or not data["candidates"]:
            print(f"   [Gemini] Unexpected response structure: {data}")
            return "Error: Unexpected response from Gemini API."
        
        answer = data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"   [Gemini] Generated answer in {time.time() - start_time:.2f}s ({len(answer)} chars)")
        return answer
    except Exception as e:
        print(f"   [Gemini] Failed: {e}")
        import traceback
        traceback.print_exc()
        return f"Error generating response: {str(e)}"


# ---------------- MAIN PIPELINE ----------------

def answer_question(group_id: str, question: str):
    total_start = time.time()
    print(f"\n--- Processing Query: '{question}' for Group: {group_id} ---")

    try:
        # 1. Embed
        print("   [Pipeline] Step 1: Embedding question...")
        emb = embed_text(question)
        if not emb:
            print("   ❌ Failed to generate embeddings")
            return {"answer": "Error: Could not generate embeddings for your question.", "contexts": []}

        # 2. Search
        print("   [Pipeline] Step 2: Searching vector index...")
        # Note: Reduced top_k to 3 to improve speed
        chunks = search_vector(group_id, emb, top_k=3)
        print(f"   [Pipeline] Found {len(chunks)} chunks")

        # 3. Fetch Context (The Slow Part)
        context_texts = []
        
        if chunks:
            print(f"   [Pipeline] Step 3: Retrieving text for {len(chunks)} chunks...")
            
            # Optimization: We loop through chunks, but handle errors gracefully
            for i, chunk in enumerate(chunks):
                datapoint_id = chunk["datapoint_id"]

                # Fetch Metadata (Firestore) with robust fallbacks.
                try:
                    found_txt = None

                    # 1) Try direct document by datapoint_id
                    if firestore_client:
                        doc = firestore_client.collection(FIRESTORE_COLLECTION).document(datapoint_id).get()
                        if doc.exists:
                            metadata = doc.to_dict()
                            # Construct GCS Path
                            chunk_group = metadata.get("group_id", group_id)
                            file_id = metadata.get("file_id")
                            if file_id:
                                gcs_path = f"chunks/{chunk_group}/{file_id}/{datapoint_id}.txt"
                                try:
                                    blob = storage_client.bucket(GCS_CHUNKS_BUCKET).blob(gcs_path)
                                    txt = blob.download_as_text()
                                    found_txt = txt
                                    chunk["text"] = txt[:200] + "..."
                                    print(f"      ✅ Chunk {i+1}: Retrieved {len(txt)} chars from {file_id} (via doc)")
                                except Exception as _e:
                                    print(f"      ⚠️ Chunk {i+1}: Failed to download blob at {gcs_path}: {_e}")

                    # 2) Fallback: try to find a document where file_id == datapoint_id
                    if not found_txt and firestore_client:
                        try:
                            q = firestore_client.collection(FIRESTORE_COLLECTION).where("file_id", "==", datapoint_id).limit(1).get()
                            if q and len(q) > 0:
                                metadata = q[0].to_dict()
                                chunk_group = metadata.get("group_id", group_id)
                                file_id = metadata.get("file_id")
                                gcs_path = f"chunks/{chunk_group}/{file_id}/{datapoint_id}.txt"
                                try:
                                    blob = storage_client.bucket(GCS_CHUNKS_BUCKET).blob(gcs_path)
                                    txt = blob.download_as_text()
                                    found_txt = txt
                                    chunk["text"] = txt[:200] + "..."
                                    print(f"      ✅ Chunk {i+1}: Retrieved {len(txt)} chars from {file_id} (via file_id query)")
                                except Exception as _e:
                                    print(f"      ⚠️ Chunk {i+1}: Failed to download blob at {gcs_path}: {_e}")
                        except Exception as _e:
                            print(f"      ⚠️ Chunk {i+1}: Firestore file_id query failed: {_e}")

                    # 3) Fallback: try to find a document that contains this datapoint in an array field (e.g. 'chunks')
                    if not found_txt and firestore_client:
                        try:
                            q2 = firestore_client.collection(FIRESTORE_COLLECTION).where("chunks", "array_contains", datapoint_id).limit(1).get()
                            if q2 and len(q2) > 0:
                                metadata = q2[0].to_dict()
                                chunk_group = metadata.get("group_id", group_id)
                                file_id = metadata.get("file_id")
                                gcs_path = f"chunks/{chunk_group}/{file_id}/{datapoint_id}.txt"
                                try:
                                    blob = storage_client.bucket(GCS_CHUNKS_BUCKET).blob(gcs_path)
                                    txt = blob.download_as_text()
                                    found_txt = txt
                                    chunk["text"] = txt[:200] + "..."
                                    print(f"      ✅ Chunk {i+1}: Retrieved {len(txt)} chars from {file_id} (via chunks array query)")
                                except Exception as _e:
                                    print(f"      ⚠️ Chunk {i+1}: Failed to download blob at {gcs_path}: {_e}")
                        except Exception as _e:
                            print(f"      ⚠️ Chunk {i+1}: Firestore chunks array query failed: {_e}")

                    # 4) Final fallback: scan GCS under group prefix to find matching datapoint file
                    if not found_txt:
                        try:
                            bucket = storage_client.bucket(GCS_CHUNKS_BUCKET)
                            prefix = f"chunks/{group_id}/"
                            print(f"      [GCS Scan] Scanning blobs with prefix: {prefix} to find {datapoint_id}.txt")
                            blobs = bucket.list_blobs(prefix=prefix)
                            for b in blobs:
                                if b.name.endswith(f"/{datapoint_id}.txt"):
                                    try:
                                        txt = b.download_as_text()
                                        found_txt = txt
                                        chunk["text"] = txt[:200] + "..."
                                        print(f"      ✅ Chunk {i+1}: Retrieved {len(txt)} chars from blob {b.name} (via GCS scan)")
                                        break
                                    except Exception as _e:
                                        print(f"      ⚠️ Chunk {i+1}: Failed to download blob {b.name}: {_e}")
                        except Exception as _e:
                            print(f"      ⚠️ Chunk {i+1}: GCS scan failed: {_e}")

                    # 5) If we found text, append it
                    if found_txt:
                        context_texts.append(found_txt)
                    else:
                        print(f"      ⚠️ Chunk {i+1}: Document not found in Firestore and no matching blob found in GCS")
                except Exception as e:
                    print(f"      ❌ Chunk {i+1}: Error retrieving context: {e}")
                    import traceback
                    traceback.print_exc()
                    continue

            if not context_texts:
                print("   ⚠️ Warning: No context texts retrieved, will generate answer without file context")
        else:
            print("   ⚠️ Warning: No chunks found in vector search")

        # 4. Generate
        print("   [Pipeline] Step 4: Generating answer with Gemini...")
        answer = generate_answer(question, context_texts)
        
        if not answer or answer.startswith("Error") or answer.startswith("I encountered"):
            print("   ❌ Answer generation failed or returned error")
        else:
            print("   ✅ Answer generated successfully")
        
        print(f"--- Total Time: {time.time() - total_start:.2f}s ---\n")
        
        return {
            "answer": answer,
            "contexts": chunks,
        }
    
    except Exception as e:
        print(f"   ❌ CRITICAL ERROR in answer_question: {e}")
        import traceback
        traceback.print_exc()
        return {
            "answer": f"An unexpected error occurred: {str(e)}",
            "contexts": [],
        }