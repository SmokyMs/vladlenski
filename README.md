# vladlenski

## Project Overview

This repository is a long-term portfolio project focused on Cloud Engineering, Platform Engineering, and DevOps.

The website itself is not the project. It is the first workload used to design, deploy, and operate cloud infrastructure using modern engineering practices.

The primary focus is on:

- Cloud infrastructure
- Infrastructure as Code (Terraform)
- Continuous Integration / Continuous Deployment
- Reproducible development environments
- Operational practices
- Documentation
- Engineering decision making

The project is developed incrementally, with each milestone introducing a new engineering capability rather than unnecessary complexity.

---

## Current Status

Current capabilities include:

- React frontend
- Containerized frontend
- GitHub Actions Continuous Integration
- Reproducible Linux development environment using VS Code Dev Containers
- AWS infrastructure managed with Terraform
- Secure S3 bucket provisioned for frontend hosting

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
- Reproducible Dev Container environment
  - Node.js
  - Terraform
  - AWS CLI
  - TFLint
  - Project-specific VS Code extensions
  - Locked Dev Container feature versions
- Cross-platform Git line-ending policy
- Terraform project initialization
- AWS provider configuration
- Secure private S3 bucket
- Server-side encryption (SSE-S3)
- Bucket versioning
- Public Access Block
- Bucket ownership controls
- Lifecycle configuration

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router

### Infrastructure

- Terraform
- AWS

### CI

- GitHub Actions

### Development Environment

- VS Code Dev Containers
- Docker Desktop
- Debian Linux
- Node.js
- Terraform
- AWS CLI
- TFLint

### Container Runtime

- Docker
- Nginx

---

## Development Environment

The repository includes a VS Code Dev Container configuration to provide a consistent Linux-based development environment.

The environment includes the tooling required for frontend and infrastructure development:

- Node.js and npm
- Terraform
- AWS CLI
- TFLint
- Git
- ESLint and Terraform VS Code extensions

The repository remains on the host machine and is mounted into the development container. This allows development tooling to run inside an isolated Linux environment while the repository remains the source of truth for project files.

AWS credentials are not mounted into the development container by default. This keeps authenticated cloud access separate from routine development and validation tasks.

After cloning the repository, open it in VS Code and select:

`Dev Containers: Reopen in Container`

Frontend dependencies are installed automatically during container creation using `npm ci`.

---

## Infrastructure

Infrastructure is managed declaratively using Terraform.

Current AWS resources:

- Private S3 bucket
- Server-side encryption (SSE-S3)
- Bucket versioning
- Public Access Block
- Bucket ownership controls
- Lifecycle policy for non-current object versions

Terraform workflow:

1. `terraform fmt`
2. `terraform validate`
3. `terraform plan`
4. Review the execution plan
5. `terraform apply`
6. `terraform plan` to verify no drift

Infrastructure changes are performed through Terraform rather than manual AWS Console modifications.

Authenticated Terraform operations are kept separate from routine development tasks. AWS credentials are not exposed to the Dev Container by default.

---

## Running the Frontend

When using the Dev Container, frontend dependencies are installed automatically during container creation.

From the repository root:

```bash
cd frontend
npm run dev
```

Validate the frontend:

```bash
npm run lint
npm run build
docker build -t vladlenski-frontend .
```

---

## Working with Terraform

Terraform formatting and configuration validation can be performed inside the Dev Container:

```bash
cd infrastructure

terraform fmt -check
terraform validate
```

Authenticated Terraform operations require AWS credentials:

```bash
terraform plan
terraform apply
```

AWS credentials are not mounted into the Dev Container by default. The authentication workflow for infrastructure operations is intentionally kept separate from routine development and validation tasks.

`terraform apply` is only performed after reviewing the execution plan.

---

## Repository Structure

```text
.
├── .devcontainer/
│   ├── devcontainer.json
│   └── devcontainer-lock.json
├── .github/
│   └── workflows/
│       └── frontend-ci.yml
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── pages/
├── infrastructure/
│   ├── providers.tf
│   ├── s3.tf
│   ├── versions.tf
│   └── .terraform.lock.hcl
├── .gitattributes
├── AGENTS.md
└── README.md
```

---

## Engineering Principles

This project follows several engineering principles throughout development:

- Infrastructure as Code
- Small, reviewable changes
- Validation before deployment
- Git-based version control
- Reproducible development environments
- Separation of development tooling from cloud credentials
- Industry-standard tooling
- Incremental architecture evolution
- Learning through production-style workflows

---

## Roadmap

### ✅ Phase 1 – Frontend Foundation

Completed:

- React
- TypeScript
- Vite
- React Router

Planned:

- Continue improving the portfolio UI/UX
- Personal profile
- CV download
- Infrastructure documentation
- Project showcase

---

### ✅ Phase 2 – Containerization

Completed:

- Multi-stage Docker build
- Nginx runtime
- Local container validation

---

### ✅ Phase 3 – Continuous Integration

Completed:

- GitHub Actions
- Dependency installation
- ESLint
- Production build validation
- Docker image validation

---

### 🚧 Phase 4 – AWS Static Hosting

Completed:

- Terraform setup
- AWS provider configuration
- Secure private S3 bucket
- Server-side encryption
- Bucket versioning
- Public Access Block
- Bucket ownership controls
- Lifecycle configuration
- Reproducible Dev Container development environment

Planned:

- Remote Terraform state and state locking
- Upload frontend build to S3
- CloudFront distribution
- HTTPS using ACM
- Route 53 custom domain
- GitHub Actions deployment

---

### ⏳ Phase 5 – Operations & Platform Improvements

Potential future work:

- CloudWatch monitoring
- Logging
- Cost management
- Security hardening
- Deployment documentation
- Architecture diagrams
- Operational runbooks

---

### ⏳ Future Workloads

The portfolio website is intended to host additional projects over time.

Future workloads will only introduce new technologies when they solve a real engineering problem.

Potential projects include:

- D&D item generator
- Additional cloud-native applications
- Platform engineering demonstrations