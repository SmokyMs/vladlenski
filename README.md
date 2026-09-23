# vladlenski

## Project Overview

This repository is a long-term portfolio project focused on Cloud Engineering, Platform Engineering, and DevOps.

The website itself is not the project. It is the first workload used to design, deploy, and operate cloud infrastructure using modern engineering practices.

The primary focus is on:

- Cloud infrastructure
- Infrastructure as Code
- CI/CD
- Reproducible development environments
- Cloud security and identity
- Operational practices
- Documentation
- Engineering decision making

The project is developed incrementally, with each milestone introducing a new engineering capability when there is a practical reason for it.

---

## Current Status

The project currently includes:

- React + TypeScript frontend
- Containerized Nginx runtime
- GitHub Actions continuous integration
- Reproducible Linux development environment using VS Code Dev Containers
- AWS infrastructure managed with Terraform
- Separate AWS management and production workload accounts
- AWS IAM Identity Center (SSO) authentication
- Dedicated Terraform remote-state infrastructure
- S3-native Terraform state locking
- Private production S3 frontend infrastructure

The AWS and Terraform foundation is complete.

The next infrastructure milestone is serving the frontend through CloudFront while keeping the S3 origin private.

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

### CI/CD

- GitHub Actions

### Development Environment

- VS Code Dev Containers
- Docker
- Debian Linux
- Node.js
- Terraform
- AWS CLI
- TFLint

### Container Runtime

- Docker
- Nginx

---

## Architecture

The project separates AWS organization management from application workloads.

```text
AWS Organization
│
├── Management Account
│   ├── AWS Organizations
│   ├── IAM Identity Center
│   └── Governance / account administration
│
└── Production Account
    │
    ├── Terraform remote state
    │   └── S3 backend + native state locking
    │
    └── Portfolio infrastructure
        └── Private frontend S3 bucket
```

The management account is not used for normal application workloads.

The production account contains the Terraform backend and application infrastructure.

The next hosting layer will extend the production architecture with CloudFront in front of the private S3 origin.

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

The repository remains mounted from the host and acts as the source of truth while development tooling runs inside the Linux container.

After cloning the repository, open it in VS Code and select:

`Dev Containers: Reopen in Container`

Frontend dependencies are installed during container creation using `npm ci`.

### AWS Authentication

Authenticated AWS access uses AWS IAM Identity Center (SSO) rather than long-lived IAM access keys.

Two AWS CLI profiles separate normal workload operations from management-account operations:

- `vladlenski-prod` — production workload account
- `vladlenski-management` — AWS Organizations management account

Before account-sensitive infrastructure operations, the target identity can be verified with:

```bash
aws sts get-caller-identity --profile <profile>
```

Long-lived IAM access keys are not used for the normal development workflow.

---

## Infrastructure

Infrastructure is managed declaratively using Terraform.

The Terraform configuration is split into two roots:

```text
infrastructure/
├── bootstrap/
│   └── Terraform backend infrastructure
│
└── main Terraform root
    └── Application infrastructure
```

### Bootstrap Terraform Root

`infrastructure/bootstrap/` manages the infrastructure required by the Terraform remote backend.

The state bucket is configured with:

- S3 public access blocking
- Bucket ownership controls
- Server-side encryption
- Versioning
- TLS enforcement
- Lifecycle and state recovery controls

The bootstrap root intentionally remains independent because the backend infrastructure must exist before the main Terraform configuration can use it.

### Main Terraform Root

`infrastructure/` manages the application infrastructure.

Its state is stored remotely in S3 rather than in a local `terraform.tfstate` file.

The backend uses:

- S3 remote state
- server-side encryption
- S3-native state locking

Current application infrastructure includes a private S3 frontend bucket with:

- Public Access Block
- BucketOwnerEnforced ownership
- SSE-S3 encryption
- versioning
- lifecycle management for noncurrent object versions

The frontend bucket is intentionally private. Public delivery will be introduced through CloudFront rather than by exposing the bucket directly.

---

## Terraform Workflow

Terraform changes follow a review-before-apply workflow.

Configuration changes begin with:

```bash
terraform -chdir=infrastructure fmt
terraform -chdir=infrastructure validate
```

For authenticated infrastructure evaluation, the intended AWS identity is verified first:

```bash
aws sts get-caller-identity --profile vladlenski-prod
```

A Terraform plan is then reviewed:

```bash
AWS_PROFILE=vladlenski-prod \
terraform -chdir=infrastructure plan
```

For infrastructure-changing operations, reviewed plans can be saved before application:

```bash
AWS_PROFILE=vladlenski-prod \
terraform -chdir=infrastructure plan -out=tfplan
```

The plan is reviewed before `terraform apply`.

After infrastructure changes, another plan is run to verify the desired end state:

```text
No changes. Your infrastructure matches the configuration.
```

Terraform state and plan files are excluded from Git.

---

## Running the Frontend

When using the Dev Container, frontend dependencies are installed automatically during container creation.

From the repository root:

```bash
cd frontend
npm run dev
```

Validate the frontend with:

```bash
npm run lint
npm run build
docker build -t vladlenski-frontend .
```

---

## Continuous Integration

GitHub Actions validates frontend changes.

The current CI workflow performs:

```text
npm ci
   │
   ▼
ESLint
   │
   ▼
Production build
   │
   ▼
Docker image build
```

This verifies both the frontend build and the container image before changes are treated as valid.

Automated deployment to AWS is intentionally separate from the current CI workflow and will be introduced in a later milestone.

---

## Repository Structure

```text
.
├── .devcontainer/
│   ├── devcontainer.json
│   └── devcontainer-lock.json
│
├── .github/
│   └── workflows/
│       └── frontend-ci.yml
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── pages/
│
├── infrastructure/
│   ├── bootstrap/
│   │   ├── .terraform.lock.hcl
│   │   ├── outputs.tf
│   │   ├── providers.tf
│   │   ├── s3.tf
│   │   └── versions.tf
│   │
│   ├── .terraform.lock.hcl
│   ├── backend.tf
│   ├── providers.tf
│   ├── s3.tf
│   └── versions.tf
│
├── .gitattributes
├── .gitignore
├── AGENTS.md
└── README.md
```

---

## Engineering Principles

The project follows several engineering principles throughout development:

- Infrastructure as Code
- Small, reviewable changes
- Validation before deployment
- Review before infrastructure mutation
- Git-based version control
- Reproducible development environments
- Temporary authentication instead of long-lived cloud credentials
- Separation of management and workload responsibilities
- Remote and recoverable Terraform state
- Least public exposure of infrastructure
- Incremental architecture evolution
- Production-style engineering workflows without unnecessary complexity

---

## Project Progress

### ✅ Frontend Foundation

Completed:

- React
- TypeScript
- Vite
- React Router
- Portfolio pages and reusable components

---

### ✅ Containerization

Completed:

- Multi-stage Docker build
- Nginx runtime
- Local container validation

---

### ✅ Continuous Integration

Completed:

- GitHub Actions
- Dependency installation
- ESLint
- Production build validation
- Docker image validation

---

### ✅ Development Environment

Completed:

- VS Code Dev Container
- Node.js
- Terraform
- AWS CLI
- TFLint
- Project-specific VS Code extensions
- Locked Dev Container feature versions
- Cross-platform Git line-ending policy

---

### ✅ AWS & Terraform Foundation

Completed:

- Terraform AWS provider configuration
- AWS management/workload account separation
- AWS IAM Identity Center authentication
- Explicit production and management AWS CLI profiles
- Removal of the original long-lived Terraform IAM credential
- Dedicated Terraform backend bootstrap configuration
- Private Terraform state S3 bucket
- Terraform state encryption
- Terraform state versioning
- S3-native Terraform state locking
- Terraform state lifecycle/recovery controls
- Remote Terraform state
- Private production frontend S3 bucket
- SSE-S3 encryption
- Bucket versioning
- Public Access Block
- Bucket ownership controls
- Lifecycle configuration
- Migration of the workload out of the AWS management account
- Verification of the final infrastructure with a zero-change Terraform plan

---

### 🚧 Static Website Delivery

Current target architecture:

```text
React / Vite build
        │
        ▼
   Private S3
        │
        ▼
    CloudFront
        │
        ▼
      HTTPS
        │
        ▼
  Public portfolio
```

Planned:

- Upload production frontend build to S3
- CloudFront distribution
- Origin Access Control
- Private S3 origin access policy
- SPA routing behaviour
- HTTPS using ACM
- Custom domain / DNS
- GitHub Actions deployment
- CloudFront cache invalidation as required

---

### ⏳ Operations & Platform Improvements

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

The portfolio is intended to host and document additional engineering projects over time.

Future workloads will introduce new technologies only where they solve a practical engineering problem rather than for the sake of increasing the technology count.