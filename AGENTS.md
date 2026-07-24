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

---

## Collaboration

Before making substantial code changes:

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

---

## Frontend Guidelines

Keep the frontend intentionally simple.

Use:

- functional React components;
- clear naming;
- beginner-readable code;
- straightforward React Router patterns.

Pages belong in:

frontend/src/pages

Reusable UI belongs in:

frontend/src/components

Do not introduce:

- state management libraries;
- animation libraries;
- UI frameworks;
- icon libraries;
- custom architectural patterns;

unless explicitly requested.

## Terraform

When working with Terraform:

- Run terraform fmt before validation.
- Run terraform validate before planning.
- Review terraform plan before applying.
- Never run terraform apply without explicit approval.
After terraform apply, verify the infrastructure with terraform plan and ensure it reports "No changes."
- Do not make manual AWS changes to Terraform-managed resources unless explicitly instructed.

---

## Validation

After frontend changes, prefer validating with:

```bash
cd frontend
npm ci
npm run lint
npm run build
docker build -t vladlenski-frontend .
```

After Terraform changes, prefer validating with:

```bash
cd infrastructure
terraform fmt
terraform validate
terraform plan
```

Never run `terraform apply` unless explicitly instructed.