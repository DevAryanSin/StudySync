import os
from typing import List
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from supabase import Client
import pypdf
import io

# Initialize Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize Sentence Transformer (Local Embeddings)
# This will download the model on first run
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> List[float]:
    text = text.replace("\n", " ")
    # Generate embedding (returns numpy array, convert to list)
    return embedding_model.encode(text).tolist()

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

async def process_and_store_file(supabase: Client, group_id: str, file_content: bytes, filename: str):
    # Extract text
    text = ""
    if filename.lower().endswith(".pdf"):
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_content))
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    else:
        # Assume text/markdown
        text = file_content.decode("utf-8", errors="ignore")

    # Chunk text
    chunks = chunk_text(text)

    # Embed and Store
    for chunk in chunks:
        embedding = get_embedding(chunk)
        data = {
            "content": chunk,
            "metadata": {"group_id": group_id, "filename": filename},
            "embedding": embedding
        }
        supabase.table("documents").insert(data).execute()

def query_rag(supabase: Client, group_id: str, query: str) -> str:
    # Embed query
    query_embedding = get_embedding(query)

    # Search in Supabase
    response = supabase.rpc(
        "match_documents",
        {
            "query_embedding": query_embedding,
            "match_threshold": 0.5,
            "match_count": 5,
            "filter_group_id": group_id
        }
    ).execute()

    matches = response.data
    context = "\n\n".join([match["content"] for match in matches])

    # Generate Answer using Gemini
    prompt = f"You are a helpful assistant. Answer the question based only on the following context. If you don't know, say so.\n\nContext: {context}\n\nQuestion: {query}"
    
    response = model.generate_content(prompt)
    return response.text
