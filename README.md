# vladlenski

## Project Overview

This repository is a long-term portfolio project focused on Cloud Engineering, Platform Engineering, and DevOps.

The website itself is not the project. It is the first workload used to design, deploy, and operate cloud infrastructure using modern engineering practices.

The primary focus is on:

- Cloud infrastructure
- Infrastructure as Code (Terraform)
- Continuous Integration / Continuous Deployment
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

### Local Development

- Docker
- Nginx

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

---

## Running the Frontend

From the repository root:

```bash
cd frontend
npm install
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

```bash
cd infrastructure

terraform fmt
terraform validate
terraform plan
```

`terraform apply` is only performed after reviewing the execution plan.

---

## Repository Structure

```text
.
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

Planned:

- Upload frontend build to S3
- CloudFront distribution
- HTTPS using ACM
- Route 53 custom domain
- GitHub Actions deployment
- Remote Terraform state

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