# vladlenski

## Project overview

This repository is a long-term portfolio project focused on Cloud Engineering, Platform Engineering, and DevOps. The website serves as the first workload, while the primary focus is the cloud infrastructure, delivery pipeline, operational practices, documentation, and engineering decisions that support it.

The project is developed incrementally, with each phase introducing a focused engineering capability.

## Current status

The project is currently in **Phase 3 – Continuous Integration**. 

Completed:

- React + TypeScript + Vite frontend
- React Router
- Multi-stage Docker image
- Nginx static web server
- Local containerized execution
- GitHub Actions CI
  - npm ci
  - ESLint
  - Production build
  - Docker image validation

## Frontend stack

### Application

- React
- TypeScript
- Vite
- React Router

### Containerization

- Docker (multi-stage build)
- Nginx

## Running locally

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

To validate the frontend:

```bash
npm run build
npm run lint
```

## Repository structure

.
├── .github/
│   └── workflows/
│       └── frontend-ci.yml
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── pages/
├── AGENTS.md
└── README.md

## Roadmap

- ✅ Phase 1 – Frontend foundation
- ✅ Phase 2 – Containerization
- ⏳ Phase 3 – Continuous Integration
- ⏳ Phase 4 – AWS infrastructure with Terraform
- ⏳ Phase 5 – Backend services & APIs
- ⏳ Phase 6 – Monitoring & Security
- ⏳ Phase 7 – Kubernetes orchestration
