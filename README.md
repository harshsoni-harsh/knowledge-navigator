# Knowledge Navigator

An AI-assisted PDF reader + Chatbot powered by GROQ

## Overview

Students often struggle with fragmented, overwhelming study resources. **Knowledge Navigator** solves this by:

- Allowing students to **upload PDFs** and documents
- Using **semantic search** to understand the content
- Answering questions using **large language models (LLMs)**
- Providing **cheatsheets**, **suggested reading**, and **Q&A**

## Tech Stack

| Layer       | Tools & Libraries                                |
|------------|---------------------------------------------------|
| **Frontend** | Next.js, Tailwind CSS, Radix UI, Prisma, PNPM     |
| **Backend**  | Python, FastAPI, pdfplumber, Pinecone, Tavily API, Groq |
| **Vector DB**| Pinecone                                          |
| **Database** | PostgreSQL                                        |

## Project Structure

```
project-root/
├── frontend/       # Next.js + Prisma app
├── backend/        # Python backend (FastAPI)
├── docker-compose.yml # Container orchestration
```

## Local Development

### Prerequisites

- Node.js (v18+)
- pnpm (`npm i -g pnpm`)
- Python 3.12
- Docker
- API keys for:
  - Pinecone
  - Tavily
  - Groq

## Frontend setup

```bash
cd frontend

# Install dependencies
pnpm install

# Setup Prisma
pnpm prisma generate
pnpm prisma migrate dev

# Start the frontend dev server
pnpm dev
```

## Backend setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend
python run.py
```

API Docs: http://localhost:8000/docs (FastAPI Swagger UI)
