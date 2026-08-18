# Contributing

## Setup

Use npm for both the backend and frontend.

```bash
npm ci
npm ci --prefix frontend
cp .env.example .env
```

## Before opening a pull request

Run the checks relevant to your change:

```bash
npm test
npm run build
npm audit --omit=dev --audit-level=high
npm audit --prefix frontend --omit=dev --audit-level=high
```

For storefront or navigation changes, also run:

```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

## Engineering guidelines

- keep changes focused and reviewable
- preserve server-side authorization checks when changing routes or controllers
- add or update regression coverage for authentication, order, payment, upload, or storefront behavior
- do not commit credentials, local environment files, generated build output, or runtime uploads
- update lockfiles only when package manifests change
- avoid unrelated formatting or dependency churn in feature and bug-fix pull requests

## Pull requests

Explain the problem, the behavioral change, and how the change was verified. If a change affects authorization, payments, uploads, or checkout, state the security impact explicitly.
