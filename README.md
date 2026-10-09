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

Phase 4, Milestone 1 is deployed: CloudFront, Origin Access Control (OAC), and the distribution-scoped S3 bucket policy keep the S3 origin private. The post-deployment Terraform plan confirmed no drift.

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

The configured public delivery layer is CloudFront over HTTPS, with signed OAC requests to the private S3 regional REST endpoint.

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

The frontend bucket remains private. The CloudFront service principal receives only `s3:GetObject` on frontend objects, conditioned on the exact distribution ARN. Existing Public Access Block, ownership, encryption, versioning, and lifecycle controls remain unchanged.

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

Milestone 1 configuration (deployed):

- CloudFront public HTTPS delivery using the default `*.cloudfront.net` domain and certificate.
- Signed OAC access to the private S3 regional REST endpoint, restricted by the distribution ARN.
- HTTP-to-HTTPS redirects, GET/HEAD only, compression, `Managed-CachingOptimized`, and `PriceClass_100`.
- Terraform outputs for the distribution ID, domain name, and HTTPS URL.

The default CloudFront certificate uses AWS's `TLSv1` viewer security policy; a stricter minimum TLS policy will be evaluated with the future custom domain and certificate.

CloudFront depends on the existing bucket and OAC; the bucket policy references the generated distribution ARN and therefore follows the distribution. No hardcoded ARN or reverse dependency is needed. Initial requests may fail until the policy is installed and propagated. Publishing frontend objects requires a separate deployment.

Milestone 2 requirements (pending):

- Upload the contents of the Vite `dist` directory to the bucket root with correct content types.
- Evaluate a small CloudFront Function to rewrite known React Router routes to `/index.html`, preserving asset requests and genuine missing-object errors. Until then, direct navigation or refresh on `/infrastructure`, `/projects`, or `/resume` may return 403/404. The Nginx `try_files` fallback does not apply to S3, and the default root object only handles the root URL. Blanket 403/404-to-200 mappings can hide permission failures and return HTML for missing assets.
- Set S3 `Cache-Control` metadata during deployment: `no-cache` for `index.html`, `public, max-age=31536000, immutable` for Vite hashed JavaScript/CSS, and short-lived or revalidated caching for other unversioned assets.
- Account for `Managed-CachingOptimized` TTLs: minimum 1 second, default 24 hours, maximum 365 days. The minimum applies even with `no-cache`, `no-store`, or `private`. Verify updated HTML is served correctly and hashed assets remain cacheable; assess invalidation needs.

Later milestones will cover custom domain/DNS, ACM certificates, and GitHub Actions deployment.

Cost monitoring: assume CloudFront pay-as-you-go with `PriceClass_100`, without enrolling in a paid pricing plan or adding fixed-cost services. The existing $5 monthly recurring AWS Budget alerts at 50% and 100%; it monitors spending but does not impose a hard cap. CloudFront usage beyond available allowances and S3 storage, retained versions, and requests can incur charges.

Post-deployment acceptance criteria (no drift verified; live delivery checks pending frontend deployment):

1. CloudFront successfully retrieves published objects from S3.
2. Anonymous requests directly to the S3 object endpoint receive Access Denied.
3. All four S3 Public Access Block settings remain enabled.
4. The bucket policy grants CloudFront only `s3:GetObject`, conditioned on `AWS:SourceArn` matching this distribution ARN.
5. No public ACLs, public bucket policies, or unnecessary S3 permissions are introduced.
6. HTTP requests redirect to HTTPS.
7. The default cache behavior allows only GET and HEAD.
8. A post-deployment Terraform plan reports no drift.

Frontend uploads, SPA routing, caching configuration, and live delivery checks remain pending for Milestone 2 and require separate approval.

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