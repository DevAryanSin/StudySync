# StudySync - Project Documentation

## 1. Problem Identification

### The Problem
Students and study groups struggle to efficiently manage, share, and retrieve information from multiple study materials (PDFs, notes, documents) during collaborative learning. Current challenges include:

- **Information Overload**: Multiple files scattered across cloud storage with no unified search capability
- **Time Inefficiency**: Students waste time manually browsing documents to find relevant information
- **Collaboration Barriers**: Group members cannot easily share and reference specific content from their collective resources
- **Knowledge Extraction**: No intelligent way to query study materials and get instant answers with source citations

### Why It's Important
As education becomes increasingly digital:
- Students need faster ways to access relevant study material
- Study groups require centralized platforms for collaborative learning
- Educational institutions need better tools to support distance learning
- Academic productivity directly impacts student performance and retention

### Who Will Benefit
- **Students**: Access study materials instantly through intelligent search
- **Study Groups**: Collaborate efficiently with shared document repositories
- **Teachers/Educators**: Monitor group resources and understand student learning patterns
- **Educational Institutions**: Improve student outcomes through better learning tools

---

## 2. Project Design

### Overview
StudySync is an AI-powered study assistant platform that leverages **Retrieval-Augmented Generation (RAG)** and **Vector Search** to help students and study groups manage, search, and learn from their collective study materials.

### Key Innovation
Using Google Cloud's **Vertex AI Matching Engine** (vector search) combined with **Gemini LLM**, StudySync converts static documents into an intelligent knowledge base that can answer questions contextually with source citations.

---

## 3. Features

### Core Features

#### 3.1 **Document Management**
- **File Upload**: Students can upload PDF files to their study groups
- **Automatic Chunking**: PDFs are split into manageable chunks for better retrieval
- **Cloud Storage Integration**: Secure storage in Google Cloud Storage (GCS)

#### 3.2 **Intelligent Search & Q&A**
- **Vector Embeddings**: Questions and documents are converted to high-dimensional vectors using Google's Text Embedding API
- **Semantic Search**: Find relevant content based on meaning, not just keywords
- **Context-Aware Answers**: Gemini 2.0 Flash generates answers based on retrieved document chunks
- **Source Citations**: Retrieve the original chunks that informed the answer

#### 3.3 **Group Collaboration**
- **Group Workspaces**: Create and manage study groups with unique `group_id`
- **Shared Resources**: All group members access the same document repository
- **Unified Q&A**: Ask questions against the entire group's collective knowledge base

#### 3.4 **User Experience**
- **Alumni Profiles**: Browse and connect with alumni from your institution
- **Group Management**: Create, join, and manage multiple study groups
- **Quiz Features**: Interactive quizzes within study groups
- **Responsive UI**: Works seamlessly on desktop and mobile devices

---

## 4. Workflow

### User Journey

```
┌─────────────────────────────────────────────────────────┐
│  User Visits Frontend (Next.js)                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  1. Navigate to Home / Groups / Alumni                  │
│     (Fetch via Next.js App Router)                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  2. User Joins/Creates Study Group                      │
│     (Frontend stores group_id, establishes context)     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  3. Upload PDF Document                                 │
│     POST /upload → Backend FastAPI                      │
│     ├─ File sent to GCS: gs://studysync/{group}/file   │
│     └─ Backend confirms upload                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  4. Document Processing (Async, Backend Service)        │
│     ├─ Extract PDF text                                 │
│     ├─ Split into chunks (e.g., 512 tokens)            │
│     ├─ Generate embeddings for each chunk              │
│     ├─ Store chunks in GCS                             │
│     └─ Index embeddings in Vertex AI Index              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  5. User Asks a Question (Chat Interface)               │
│     POST /chat → Backend FastAPI                        │
│     {group_id: "abc123", query: "What is...?"}         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  6. RAG Pipeline Executes:                              │
│     Step 1: Embed Question                              │
│     ├─ Call Google Text Embedding API                  │
│     └─ Get 768-dim vector                              │
│     Step 2: Vector Search                              │
│     ├─ Query Vertex AI Matching Engine                │
│     ├─ Filter by group_id namespace                   │
│     └─ Get top-k=3 most relevant chunks                │
│     Step 3: Retrieve Context                           │
│     ├─ Query Firestore for metadata                   │
│     ├─ Download chunk text from GCS                   │
│     └─ Assemble context for LLM                        │
│     Step 4: Generate Answer                            │
│     ├─ Send prompt + context to Gemini 2.0 Flash     │
│     ├─ Receive AI-generated answer                    │
│     └─ Return to frontend                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  7. Display Answer to User                              │
│     Frontend shows:                                      │
│     ├─ Generated answer                                 │
│     ├─ Source file references                          │
│     └─ Suggested follow-up questions                   │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Screens/Modules

### Frontend Structure (Next.js App Router)

#### 5.1 **Home Page** (`/app/page.tsx`)
- Landing page introducing StudySync
- Quick navigation to groups and features
- User authentication prompt

#### 5.2 **Home Module** (`/app/home/page.tsx`)
- Dashboard showing active study groups
- Recent documents and Q&A history
- Quick action buttons (Create Group, Upload Document, Ask Question)

#### 5.3 **Group Module** (`/app/group/`)
- **List View** (`/app/group/page.tsx`): Browse all study groups user is part of
- **Group Detail** (`/app/group/[id]/page.tsx`): 
  - View group documents
  - Upload new files
  - Access Q&A history
  - Manage group members
- **Quiz** (`/app/group/quiz/page.tsx`): Take quizzes within study groups
- **Quiz Details** (`/app/group/quiz/[uuid]/page.tsx`): Specific quiz questions and answers

#### 5.4 **Alumni Module** (`/app/alumini/`)
- **Alumni List** (`/app/alumini/page.tsx`): Browse alumni profiles
- **Alumni Profile** (`/app/alumini/[uuid]/page.tsx`): Individual alumni details, connection options

#### 5.5 **Global Components** (`/app/components/`)
- Reusable UI components (buttons, cards, modals, forms)
- Navigation header and sidebar
- Chat interface component
- Document upload widget
- Quiz progress indicator

### Backend API Endpoints (FastAPI)

#### 5.6 **Core Endpoints**

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/` | GET | Health check | - | `{status: "ok", message: "..."}` |
| `/upload` | POST | Upload PDF to group | `file`, `group_id` | `{status, message, gcs_path, group_id}` |
| `/chat` | POST | Ask question to group docs | `{group_id, query}` | `{answer, contexts}` |

---

## 6. Logic & Functionality

### 6.1 **Core RAG Pipeline**

**RAG (Retrieval-Augmented Generation)** is the architectural backbone:

```
User Query → [Embed] → [Search] → [Retrieve] → [Generate] → Answer
```

#### Step 1: **Text Embedding**
- **Function**: `embed_text(text: str) → List[float]`
- **Algorithm**: Google's `text-embedding-004` model
- **Output**: 768-dimensional vector representing semantic meaning
- **Optimization**: Cached embeddings to reduce API calls

```python
# Example: "What is photosynthesis?" 
# → [0.123, -0.456, 0.789, ..., 0.012] (768 values)
```

#### Step 2: **Vector Search**
- **Function**: `search_vector(group_id, embedding, top_k=3)`
- **Engine**: Google Vertex AI Matching Engine
- **Index Type**: Approximate Nearest Neighbor (ANN) index
- **Filtering**: Namespace filter by `group_id` for isolation
- **Output**: Top 3 most similar document chunks

```python
# Query embedding compared against 10,000+ indexed chunk embeddings
# Returns: Top 3 chunks with similarity scores
```

#### Step 3: **Context Retrieval**
- **Function**: Multi-step fallback mechanism
  1. Query Firestore for metadata by `datapoint_id`
  2. Fetch actual text from GCS using constructed path
  3. Fallback: Query by `file_id`
  4. Fallback: Query by chunks array
  5. Fallback: Scan GCS directory for matching file
- **Resilience**: Handles missing documents gracefully

#### Step 4: **Answer Generation**
- **Function**: `generate_answer(question, contexts) → str`
- **Model**: `gemini-2.0-flash` (latest Gemini model)
- **Prompt Engineering**:
  ```
  System: You are a helpful study assistant
  Context: [Top 3 document chunks]
  Question: [User's question]
  Answer: [AI-generated response]
  ```
- **Config**: 
  - Temperature: 0.3 (consistent, factual answers)
  - Max tokens: 1024 (reasonable response length)

### 6.2 **Data Handling & Storage**

#### **Storage Architecture**

```
Google Cloud Platform
├── Google Cloud Storage (GCS)
│   ├── gs://studysync/groups/{group_id}/{filename}.pdf
│   │   └─ Raw uploaded PDFs
│   └── gs://sync_chunks/chunks/{group_id}/{file_id}/{datapoint_id}.txt
│       └─ Text chunks extracted from PDFs
├── Firestore Database
│   └── Collection: group_files
│       └── Document: {datapoint_id}
│           ├─ group_id: str
│           ├─ file_id: str
│           ├─ file_name: str
│           ├─ chunk_index: int
│           └─ created_at: timestamp
└── Vertex AI Matching Engine
    └── Index: Deployed embeddings
        ├─ Vector: 768-dim embedding
        └─ Metadata: datapoint_id, group_id (for filtering)
```

#### **Data Flow**

```
PDF Upload
  ↓
[Extract Text via PyMuPDF]
  ↓
[Split into 512-token chunks]
  ↓
[Generate Embedding for each chunk] → Vertex AI Index
  ↓
[Store chunk text in GCS]
  ↓
[Store metadata in Firestore]
  ↓
Ready for Search & RAG
```

### 6.3 **Rule-Based Logic**

#### **Group Isolation**
- Every query is filtered by `group_id` using Vertex AI namespace filtering
- Ensures students only see their group's documents
- Prevents cross-group data leakage

#### **Chunking Strategy**
- **Chunk Size**: ~512 tokens (approximately 4,000 characters)
- **Overlap**: 10-20% token overlap between chunks (for context)
- **Rationale**: 
  - Large enough for meaningful context
  - Small enough for fast search and LLM processing
  - Overlap prevents losing context at chunk boundaries

#### **Ranking & Filtering**
- Vector search returns top-k=3 chunks (tuned for speed vs. quality)
- Similarity score threshold: No hard cutoff; uses top results regardless
- Fallback: If no chunks found, Gemini answers from general knowledge

### 6.4 **Security & Access Control**

#### **Current Implementation** (Development Stage)
- CORS enabled for all origins (dev only)
- Group membership managed by frontend
- No authentication middleware yet

#### **Recommended Production Controls**
- JWT token validation on every request
- Group membership verification against database
- Rate limiting per group/user
- Audit logging for all document access

### 6.5 **Performance Optimizations**

| Optimization | Implementation | Benefit |
|--------------|-----------------|---------|
| **Global Client Init** | Initialize Firestore, Storage, Vertex AI once | Avoid expensive reconnections per request |
| **Credential Refresh** | Refresh OAuth tokens only when invalid | Faster API calls after first request |
| **Reduced top_k** | Use top_k=3 instead of 10 | ~3x faster vector search |
| **Timeout Config** | 10s for embeddings, 30s for Gemini | Fail gracefully on slow APIs |
| **Error Fallbacks** | Multi-step GCS retrieval logic | Robust even if metadata missing |
| **Async Upload** | File upload doesn't block processing | Responsive UI |

---

## 7. Tools & Tech Stack

### **Frontend Stack**

| Component | Tool/Library | Version | Purpose |
|-----------|--------------|---------|---------|
| **Framework** | Next.js | 16.0.3 | React-based SSR/SSG framework |
| **UI Library** | React | 19.2.0 | Component-based UI building |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS framework |
| **Language** | TypeScript | v5 | Type-safe JavaScript |
| **Linting** | ESLint | v9 | Code quality & consistency |
| **Build Tool** | Webpack (Next.js) | Built-in | Module bundling |
| **Node Version** | Node.js | 20.x | JavaScript runtime |

### **Backend Stack**

| Component | Tool/Library | Version | Purpose |
|-----------|--------------|---------|---------|
| **Framework** | FastAPI | Latest | High-performance Python web API |
| **Server** | Uvicorn | [standard] | ASGI server for async Python |
| **Language** | Python | 3.9+ | Backend logic |
| **PDF Processing** | PyMuPDF (fitz) | Latest | Extract text from PDFs |
| **HTTP Client** | Requests | Latest | Make API calls to Google APIs |
| **Environment** | python-dotenv | Latest | Load environment variables |
| **Multipart Support** | python-multipart | Latest | Handle file uploads |
| **CORS** | FastAPI CORS | Built-in | Handle cross-origin requests |

### **Cloud Infrastructure**

| Service | Purpose | Role |
|---------|---------|------|
| **Google Cloud Storage (GCS)** | File & chunk storage | Primary data repository |
| **Firestore** | Metadata & indexing | Document metadata, chunk references |
| **Vertex AI Matching Engine** | Vector search | Semantic similarity search (ANN index) |
| **Vertex AI Generative AI** | Large Language Model | Answer generation (Gemini 2.0 Flash) |
| **Text Embedding API** | Vectorization | Convert text to embeddings |
| **Cloud Run** | Serverless deployment | Backend deployment |
| **Vercel** | Frontend hosting | Frontend deployment |

### **Authentication & Credentials**

| Component | Method | Status |
|-----------|--------|--------|
| **Google Cloud Auth** | Service Account JSON | Configured (local dev) |
| **OAuth 2.0** | Google credentials | Used for Cloud API access |
| **Frontend Auth** | Not yet implemented | Future: Firebase Auth / Google OAuth |

### **Development & Deployment**

| Tool | Purpose |
|------|---------|
| **Git/GitHub** | Version control & collaboration |
| **Docker** | Containerization (backend) |
| **Cloud Build** | CI/CD pipeline (GCP) |
| **Vercel CLI** | Frontend deployment automation |
| **gcloud CLI** | GCP resource management |

### **API Integrations**

| API | Endpoint | Rate | Purpose |
|-----|----------|------|---------|
| **Google Text Embedding API** | `aiplatform.googleapis.com/.../predict` | Per call | Generate 768-dim embeddings |
| **Google Gemini API** | `aiplatform.googleapis.com/.../generateContent` | Per request | Generate AI answers |
| **Vertex AI Matching Engine API** | `aiplatform.googleapis.com/.../findNeighbors` | Per query | Vector similarity search |

---

## 8. Data Models

### **Frontend Data Structures**

```typescript
// Study Group
interface StudyGroup {
  id: string;              // Unique group identifier
  name: string;            // Group name
  description: string;     // Purpose/topic
  members: User[];         // List of members
  documents: Document[];   // Uploaded documents
  createdAt: Date;
}

// Document (uploaded file reference)
interface Document {
  id: string;              // File ID
  name: string;            // Original filename
  groupId: string;         // Parent group
  gcsPath: string;         // Path in Google Cloud Storage
  uploadedAt: Date;
  uploadedBy: string;      // User who uploaded
}

// Chat Message
interface ChatMessage {
  id: string;
  groupId: string;
  query: string;           // User's question
  answer: string;          // AI response
  contexts: Chunk[];       // Source chunks
  timestamp: Date;
}
```

### **Backend Data Models**

```python
# Request Models
class QueryBody(BaseModel):
    group_id: str
    question: str

class ChatBody(BaseModel):
    group_id: str
    query: str

# Firestore Document Structure
# Collection: group_files
{
  "datapoint_id": "chunk_123",
  "group_id": "group_abc",
  "file_id": "file_xyz",
  "file_name": "lecture_notes.pdf",
  "chunk_index": 0,
  "created_at": Timestamp,
  "chunk_start": 0,
  "chunk_end": 512
}

# Vector Index Entry (Vertex AI)
{
  "id": "chunk_123",
  "embedding": [0.123, -0.456, ...],  # 768 dimensions
  "namespace": {
    "group_id": ["group_abc"]
  }
}
```

---

## 9. Deployment Architecture

### **Current Setup**

```
┌─────────────────────────────┐
│     Frontend (Next.js)      │
│   Deployed on Vercel        │
│   https://[domain]          │
└────────────┬────────────────┘
             │ NEXT_PUBLIC_API_URL
             ↓
┌─────────────────────────────────────────────────┐
│     Backend (FastAPI)                           │
│     Deployed on Google Cloud Run                │
│     https://studysync-136760819044...cloudrun.app
└────────────┬────────────────────────────────────┘
             │
             ├──→ Google Cloud Storage (PDF storage)
             ├──→ Firestore (Metadata)
             ├──→ Vertex AI Matching Engine (Vector index)
             └──→ Vertex AI Generative AI (Gemini API)
```

### **Environment Variables**

#### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000          # Dev
NEXT_PUBLIC_API_URL=https://studysync-...cloudrun.app  # Prod
```

#### Backend (`.env`)
```
PROJECT_ID=studysync-479305
REGION=us-central1
ENDPOINT_ID=4856694592491225088
DEPLOYED_ID=syncv1_1764053160166
FIRESTORE_DB=default
FIRESTORE_COLLECTION=group_files
GCS_CHUNKS_BUCKET=sync_chunks
GCS_BUCKET_NAME=studysync
GEMINI_MODEL=gemini-2.0-flash
```

---

## 10. Future Enhancements

### **Phase 2: Enhanced Features**
- ✅ User authentication (Firebase Auth / Google OAuth)
- ✅ Real-time chat with WebSocket support
- ✅ Document versioning and history
- ✅ Rich text editor for notes
- ✅ Offline mode with service workers
- ✅ Mobile app (React Native)

### **Phase 3: Advanced AI**
- ✅ Streaming responses for faster perceived performance
- ✅ Multi-document summarization
- ✅ Adaptive chunking based on content type
- ✅ Custom fine-tuned embeddings
- ✅ Conversation memory (multi-turn chat)

### **Phase 4: Analytics & Insights**
- ✅ Study progress tracking
- ✅ Learning analytics dashboard
- ✅ Popular topics/concepts detection
- ✅ Personalized recommendations
- ✅ Performance metrics per group

---

## 11. Getting Started

### **Local Development**

#### **Backend Setup**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

#### **Frontend Setup**
```powershell
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### **Production Deployment**

#### **Backend to Cloud Run**
```powershell
gcloud builds submit --config cloudbuild.yaml . --substitutions=_REGION=us-central1
```

#### **Frontend to Vercel**
```powershell
cd frontend
vercel
```

---

## 12. Conclusion

StudySync solves a critical problem in modern education: turning scattered study materials into an intelligent, searchable knowledge base. By combining cutting-edge AI (Vertex AI, Gemini, embeddings) with a user-friendly interface, we enable students to learn smarter, not harder.

**Key Differentiators**:
- ✨ RAG-powered Q&A with source citations
- 🔒 Group-isolated data for privacy
- ⚡ Fast, serverless infrastructure
- 🚀 Scalable to millions of documents
- 🎓 Education-focused design

