Full Stack Post Analyzer App
This is a full-stack web application built with Next.js, PostgreSQL, and a C++ backend service.
It allows users to:

View post details

Edit post titles and save them to the database

Analyze post content using a native C++ API

🔧 Tech Stack
Frontend: Next.js (React), TailwindCSS

Backend: Node.js (API routes), PostgreSQL

Native Service: C++ microservice (for text analysis)

Dockerized: All services containerized for local development

🗂 Project Structure
python
Copy
Edit
frontend/
├── backend/                # Database connection setup
├── components/             # Reusable UI components
├── pages/
│   ├── api/
│   │   └── post/
│   │       └── [id].js     # GET and PUT post by ID
│   │   ├── getPosts.js     # (Optional) All post fetch
│   │   └── syncPosts.js    # Populate mock data into DB
│   ├── post/
│   │   └── [id].js         # Post detail UI (edit & analyze)
│   └── index.js            # (Optional) Home or post listing
├── public/                 # Static assets
├── styles/                 # Tailwind styles
├── Dockerfile              # Frontend Dockerfile
└── next.config.mjs
🏗 Architecture Overview
scss
Copy
Edit
                ┌────────────────────┐
                │   Web Browser      │
                │ (React + Next.js)  │
                └────────┬───────────┘
                         │
                         ▼
               ┌────────────────────┐
               │   Next.js API      │
               │ (/api/post/[id])   │
               └───────┬────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  PostgreSQL Database       │
         │  (Containerized)           │
         └────────────────────────────┘

               ┌────────────────────┐
               │   C++ Backend      │
               │  (localhost:8080)  │
               └────────────────────┘
Data is fetched and saved via the Next.js API.

Analysis is done by making POST requests to the C++ service running at localhost:8080.

