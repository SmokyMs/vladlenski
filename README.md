# vladlenski

## Project overview

This repository is a long-term portfolio project focused on Cloud Engineering, Platform Engineering, and DevOps. The website serves as the first workload, while the primary focus is the cloud infrastructure, delivery pipeline, operational practices, documentation, and engineering decisions that support it.

The project is developed incrementally, with each phase introducing a focused engineering capability.

## Current status

The project is currently in **Phase 2 - Containerization**. 

## Frontend stack

- React
- TypeScript
- Vite
- React Router

ESLint is used for code validation.

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

```text
.
├── frontend/                  # Frontend application
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable UI components
│       └── pages/             # Routed page components
├── AGENTS.md                  # Repository contribution instructions
└── README.md                  # Project overview and roadmap
```

## Planned phases

The project is expected to evolve through the following phases:

1. Frontend foundation
2. Containerization
3. Continuous Integration & Delivery
4. AWS infrastructure with Terraform
5. Backend services
6. Monitoring & Security
7. Kubernetes orchestration

These phases describe the current roadmap and may evolve as the project develops.
