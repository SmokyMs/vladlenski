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

Phase 4, Milestone 2 is deployed and validated: the frontend is published to private S3, CloudFront serves it over HTTPS, and a viewer-request Function supports allowlisted SPA routes. Object metadata, live HTTP delivery, invalidation completion, and a final zero-change Terraform plan were verified. The production endpoint is [https://d39xlwqgipdqeo.cloudfront.net](https://d39xlwqgipdqeo.cloudfront.net).

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
└── Production Account (145847015381)
    │
    ├── Terraform remote state
    │   └── S3 backend + native state locking
    │
    └── Portfolio infrastructure
        Internet users
              │
              ▼
        CloudFront (HTTPS + viewer-request SPA Function)
              │
              ▼
        OAC (SigV4 signed origin requests)
              │
              ▼
        Private S3 origin (React / Vite build)
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
│   │   └── images/
│   │       └── profile.webp
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
│   ├── cloudfront.tf
│   ├── cloudfront-spa.js
│   ├── outputs.tf
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

### ✅ Static Website Delivery — Milestones 1 and 2

Deployed delivery architecture:

```text
Internet users
        │
        ▼
CloudFront (HTTPS + viewer-request SPA Function)
        │
        ▼
OAC (SigV4)
        │
        ▼
Private S3 origin (React / Vite build)
```

Milestone 1 configuration (deployed):

- CloudFront public HTTPS delivery using the default `*.cloudfront.net` domain and certificate.
- Signed OAC access to the private S3 regional REST endpoint, restricted by the distribution ARN.
- HTTP-to-HTTPS redirects, GET/HEAD only, compression, `Managed-CachingOptimized`, and `PriceClass_100`.
- Terraform outputs for the distribution ID, domain name, and HTTPS URL.

The default CloudFront certificate uses AWS's `TLSv1` viewer security policy; a stricter minimum TLS policy will be evaluated with the future custom domain and certificate.

CloudFront depends on the existing bucket and OAC; the bucket policy references the generated distribution ARN and therefore follows the distribution. No hardcoded ARN or reverse dependency is needed. Frontend objects are published separately from Terraform through the manual deployment procedure below.

Milestone 2 configuration (deployed and validated):

- The Vite `dist` contents are uploaded to the bucket root. All nine objects passed Content-Type, Cache-Control, and Content-Length checks.
- The LIVE `vladlenski-frontend-prod-spa` CloudFront Function uses `cloudfront-js-2.0` at viewer-request and rewrites only `/infrastructure`, `/projects`, `/resume`, and their trailing-slash variants to `/index.html`. Query strings remain unchanged. `/` uses the existing default root object; assets and unknown routes remain unchanged. The Nginx `try_files` fallback does not apply to S3. No broad 403/404-to-200 fallback is configured.
- S3 Cache-Control metadata is `no-cache` for `index.html`, `public, max-age=31536000, immutable` for hashed Vite JavaScript/CSS, and `public, max-age=300` for unversioned static assets.
- The optimized 960 × 1280 WebP portrait replaces the original JPEG in production. React Router packages are locked to the patched 7.18.2 release; the production dependency audit reported zero vulnerabilities.
- Wildcard invalidation `I7537ONJ5VNUZHHDTMPTQRZQR9` completed after the first upload. Distribution `E1UCMK3Q4UQK2J` is Deployed.
- `Managed-CachingOptimized` TTLs remain minimum 1 second, default 24 hours, and maximum 365 days. The minimum applies even with `no-cache`, `no-store`, or `private`.

#### Manual frontend deployment runbook

Use this repeatable procedure inside the Dev Container for approved frontend deployments. Verify the existing distribution is Deployed. Frontend-only updates do not require Terraform application; any infrastructure change still requires a reviewed saved plan and explicit apply approval. Uploads and invalidations require authorization. GitHub Actions deployment with OIDC is reserved for Milestone 4.

From the repository root, build and inspect the fresh artifact:

```bash
cd frontend
npm ci
npm run lint
npm run build
docker build -t vladlenski-frontend .
rg --files --hidden dist
cat dist/index.html
```

Expect root `index.html`, hashed JavaScript/CSS under `assets/`, `favicon.svg`, `icons.svg`, certification PNGs, and `images/profile.webp`. The original JPEG is retained only as a local backup outside the repository and is not part of the deployment artifact. Confirm every HTML asset reference exists. Do not upload source files, source maps, credentials, or unexpected artifacts. Files in `public/` and client-side values embedded in the bundle become publicly readable through CloudFront. Git ignore rules do not filter S3 uploads.

Verify the production identity immediately before deployment:

```bash
aws sts get-caller-identity --profile vladlenski-prod --region eu-west-2
```

Confirm account `145847015381`. Stop for an account mismatch or expired SSO authentication rather than changing credential configuration.

From `frontend/`, first run each upload command below with `--dryrun` appended and inspect the destinations. Then execute them in order, stopping immediately if any stage fails. Upload the contents of `dist/` to the bucket root, without a `dist/` prefix.

```bash
frontend_bucket='vladlenski-frontend-prod-433cb512de8edb66a5216fe156'

# 1. Upload hashed dependencies first.
aws s3 sync dist/assets/ "s3://${frontend_bucket}/assets/" \
  --cache-control 'public, max-age=31536000, immutable' \
  --profile vladlenski-prod --region eu-west-2

# 2. Upload unversioned static files second.
aws s3 cp dist/ "s3://${frontend_bucket}/" --recursive \
  --exclude 'index.html' --exclude 'assets/*' \
  --cache-control 'public, max-age=300' \
  --profile vladlenski-prod --region eu-west-2

# 3. Publish HTML last, after its dependencies exist.
aws s3 cp dist/index.html "s3://${frontend_bucket}/index.html" \
  --content-type 'text/html' --cache-control 'no-cache' \
  --profile vladlenski-prod --region eu-west-2
```

Retain previous hashed assets; do not use `--delete`. Cached HTML and open tabs can still reference old hashes. Bucket versioning does not serve deleted keys at their normal URLs. Cleanup of obsolete current hashed objects requires separate review; the existing lifecycle expires noncurrent versions only.

The CLI guesses asset MIME types. Use `aws s3api head-object --bucket "$frontend_bucket" --key <object-key> --profile vladlenski-prod --region eu-west-2` to verify `ContentType`, `CacheControl`, and `ContentLength` against local artifacts. Expected types are `text/html`, `text/javascript` or `application/javascript`, `text/css`, `image/svg+xml`, `image/png`, and `image/webp`. Correct mismatches with an explicit `aws s3 cp --content-type` before acceptance. Check root object paths with `aws s3api list-objects-v2` using the same bucket, profile, and region.

A single sync cannot provide all three cache policies or enforce HTML-last ordering. Sync skips unchanged files, including metadata updates; re-upload existing hashed objects with `cp` if their metadata needs correction. Recursive `cp` deliberately refreshes unversioned files and metadata.

HTML uses `no-cache`, hashed assets use `public, max-age=31536000, immutable`, and unversioned files use `public, max-age=300`. The managed policy can still cache HTML for its one-second minimum despite `no-cache`; browsers must revalidate HTML. Missing cache metadata can invoke the 24-hour default. Invalidation does not clear browser caches.

After each successful deployment, clear stale HTML, route responses, and cached errors using one wildcard invalidation:

```bash
aws cloudfront create-invalidation \
  --distribution-id E1UCMK3Q4UQK2J --paths '/*' \
  --profile vladlenski-prod --region eu-west-2

aws cloudfront wait invalidation-completed \
  --distribution-id E1UCMK3Q4UQK2J --id <returned-invalidation-id> \
  --profile vladlenski-prod --region eu-west-2
```

The wildcard simplifies manual operation but also evicts unchanged assets, increasing origin requests. Invalidation, function invocations, S3 requests, and retained objects can incur usage costs.

Verify after invalidation completes:

- HTTPS `/` returns 200, HTTP redirects to HTTPS, and actual JS/CSS and image paths from the new artifact load successfully.
- Directly open and refresh `/`, `/infrastructure`, `/projects`, and `/resume` in a browser. Confirm the correct page and no console or asset errors. Check trailing-slash variants, query strings, and `/#projects` scrolling.
- Missing `/assets/missing.js`, `/images/missing.png`, an extensionless asset, and `/unknown-route` return 403/404, never application HTML with 200. Private S3 can return 403 for missing keys when the caller cannot list the bucket.
- Anonymous access to the known existing S3 `index.html` returns 403 Access Denied.
- CloudFront responses show the intended cache headers. Repeat hashed-asset requests to observe `X-Cache` and `Age`; individual edge misses are possible.
- A post-deployment Terraform plan reports no changes, and Public Access Block and the distribution-scoped OAC policy remain intact.

```bash
curl -I https://d39xlwqgipdqeo.cloudfront.net/
curl -I https://d39xlwqgipdqeo.cloudfront.net/projects
curl -I https://d39xlwqgipdqeo.cloudfront.net/assets/missing.js
curl -i https://vladlenski-frontend-prod-433cb512de8edb66a5216fe156.s3.eu-west-2.amazonaws.com/index.html
```

Test any route allowlist changes locally before deployment. Native CloudFront Function testing can now target the existing function using `aws cloudfront test-function` with the selected stage's ETag and a request event; it does not require republishing or changing the distribution. Local function tests and live HTTP checks were performed for Milestone 2; native function testing was not performed.

Future milestones will cover a custom domain, Route 53 DNS, ACM certificates, and GitHub Actions deployment with OIDC. These are not part of the current deployment.

Cost monitoring: assume CloudFront pay-as-you-go with `PriceClass_100`, without enrolling in a paid pricing plan or adding fixed-cost services. The existing $5 monthly recurring AWS Budget alerts at 50% and 100%; it monitors spending but does not impose a hard cap. CloudFront usage beyond available allowances and S3 storage, retained versions, and requests can incur charges.

Completed automated HTTP and operational acceptance checks:

1. HTTPS `/`, `/infrastructure`, `/projects`, and `/resume` return 200 with the HTML matching the local production artifact.
2. Hashed JavaScript/CSS and `/images/profile.webp` return 200 with the expected MIME types, cache headers, and content matching the local artifacts.
3. `/unknown-route`, `/assets/missing.js`, `/images/missing.png`, and `/assets/missing` return 403 XML errors rather than homepage HTML.
4. HTTP requests return 301 with the HTTPS endpoint in the Location header.
5. Anonymous requests to the known existing S3 `index.html` return 403 AccessDenied.
6. The wildcard invalidation is Completed and the distribution is Deployed.
7. All nine uploaded S3 objects passed metadata and size checks. Public Access Block, distribution-scoped read-only OAC access, and GET/HEAD-only behavior remain unchanged.
8. The final Terraform plan with `-detailed-exitcode` exited 0 and reported `No changes. Your infrastructure matches the configuration.`

Browser visual validation is separate from these automated HTTP checks. The project owner confirmed the live website works, including React Router navigation, dark/light themes, HTTPS redirects, and frontend assets. The automated checks do not execute React or verify visual rendering. Browser refreshes on every route, trailing-slash variants, query strings, and `/#projects` scrolling remain repeatable runbook checks; no additional browser validation is claimed here.

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
