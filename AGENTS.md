# AGENTS.md — vladlenski

## Project Purpose

This repository is a long-term Cloud Engineering / Platform Engineering / DevOps portfolio.

The website itself is not the project.

The infrastructure, deployment pipeline, operational practices, documentation, and engineering decisions are the primary deliverables.

The frontend is simply the first workload running on an evolving cloud platform.

---

## Engineering Philosophy

- Implement only the requested task.
- Keep changes small and easy to review.
- Prefer simple, maintainable, industry-standard solutions.
- Do not over-engineer.
- Avoid unnecessary abstractions.
- When multiple valid solutions exist, prefer the one most commonly used in production.
- Optimize for learning and long-term maintainability over cleverness.
- Require explicit authorization before modifying repository files or infrastructure.

Read-only inspection and agreed validation commands do not constitute authorization to modify repository files or infrastructure.

---

## Collaboration

Before making substantial code or infrastructure changes:

1. Explain the implementation plan.
2. List the files you intend to modify.
3. Explain why each file needs to change.
4. Wait for approval before editing.

Do not silently make architectural decisions.

If something is ambiguous, ask.

---

## Scope Control

Do not:

- introduce new dependencies unless requested;
- reorganize unrelated files;
- perform drive-by refactoring;
- create folders or files for future phases;
- change formatting outside the requested scope.

One task should result in one focused change.

---

## Git

Never:

- commit;
- push;
- create branches;
- merge;
- open pull requests;

unless explicitly instructed.

---

## Development Environment

The VS Code Dev Container is the preferred development environment for this repository.

Run project development and validation commands inside the Dev Container unless the task explicitly requires host-level access.

The Dev Container provides the project tooling, including:

- Node.js and npm;
- Terraform;
- AWS CLI;
- TFLint;
- Git.

The repository is mounted into the Dev Container, so changes made inside the container modify the repository working tree.

AWS authentication uses AWS IAM Identity Center (SSO).

Do not:

- create or use long-lived IAM access keys for normal development;
- copy static AWS credentials into the repository;
- introduce credentials into Terraform configuration;
- weaken or bypass the SSO authentication model;
- change AWS profiles or account mappings without explicit approval.

Configured AWS CLI profiles:

- `vladlenski-prod` — normal project workload account;
- `vladlenski-management` — AWS Organizations management account.

Project workload infrastructure belongs in the production account.

The management account is reserved for organization, identity, billing, governance, and explicitly approved management-account operations.

Before account-sensitive or destructive AWS operations, explicitly select the intended profile and verify the active identity with:

```bash
aws sts get-caller-identity --profile <profile>
```

Do not infer the target AWS account from the profile name alone.

If authenticated AWS access is unavailable or expired, stop and report that authentication is required rather than changing credential configuration or creating an alternative authentication mechanism without approval.

---

## Current Technology Stack

Frontend:

- React
- TypeScript
- Vite
- React Router

Infrastructure:

- Terraform
- AWS

CI/CD:

- GitHub Actions

Development:

- VS Code Dev Containers
- Docker
- Debian Linux
- TFLint

---

## Frontend Guidelines

Keep the frontend intentionally simple.

Use:

- functional React components;
- clear naming;
- beginner-readable code;
- straightforward React Router patterns.

Pages belong in:

`frontend/src/pages`

Reusable UI belongs in:

`frontend/src/components`

Do not introduce:

- state management libraries;
- animation libraries;
- UI frameworks;
- icon libraries;
- custom architectural patterns;

unless explicitly requested.

---

## Terraform

When working with Terraform:

- Run `terraform fmt` before validation.
- Run `terraform validate` before planning.
- Verify the intended AWS identity before AWS-backed planning or applying.
- Review the complete `terraform plan` before applying.
- Prefer saving reviewed infrastructure-changing plans with `terraform plan -out=<plan-file>`.
- Never run `terraform apply` without explicit approval.
- When practical, apply the reviewed saved plan rather than generating a new unreviewed plan at apply time.
- After `terraform apply`, verify the infrastructure with `terraform plan` and ensure it reports `No changes`.
- Do not make manual AWS changes to Terraform-managed resources unless explicitly instructed.
- Treat Terraform state as sensitive operational data.
- Do not commit Terraform state files or plan files.
- Do not modify, move, delete, import, or migrate Terraform state unless explicitly instructed.

Terraform formatting and validation can run inside the Dev Container without authenticated AWS access.

Commands that interact with AWS, including a normal refresh-based `terraform plan` or `terraform apply`, require authenticated AWS access through the appropriate SSO profile.

Do not work around missing or expired authentication without approval.

### Terraform Roots

`infrastructure/bootstrap/` is a separate Terraform root responsible for the remote-state infrastructure.

`infrastructure/` is the main Terraform root for application infrastructure and uses the S3 remote backend with S3-native state locking.

The bootstrap root exists to solve the Terraform backend bootstrapping dependency and should remain small and independent.

Do not:

- add a remote backend to `infrastructure/bootstrap/`;
- make the bootstrap root depend on the main Terraform root;
- move resources between Terraform roots without explicit approval;
- change backend configuration, backend keys, or state locations without explicit approval;
- run Terraform state migration commands without explicit approval;
- introduce DynamoDB state locking unless explicitly requested.

### Destructive Terraform Operations

For destructive infrastructure operations:

- explicitly select the intended AWS profile;
- verify the target AWS account with `aws sts get-caller-identity`;
- create and review a saved Terraform plan;
- inspect every destructive action before applying;
- stop if unrelated or unexpected resources appear in the plan;
- never apply without explicit approval.

---

## Validation

After frontend changes, prefer validating inside the Dev Container with:

```bash
cd frontend

npm ci
npm run lint
npm run build
docker build -t vladlenski-frontend .
```

After Terraform configuration changes, begin with:

```bash
terraform -chdir=infrastructure fmt
terraform -chdir=infrastructure validate
```

For changes to the bootstrap Terraform root, validate it separately:

```bash
terraform -chdir=infrastructure/bootstrap fmt
terraform -chdir=infrastructure/bootstrap validate
```

When authenticated AWS access is available and the task requires infrastructure evaluation, first verify the intended account:

```bash
aws sts get-caller-identity --profile <profile>
```

Then run Terraform with the profile explicitly selected:

```bash
AWS_PROFILE=<profile> terraform -chdir=infrastructure plan
```

Review the execution plan before any apply.

Never run `terraform apply` unless explicitly instructed.