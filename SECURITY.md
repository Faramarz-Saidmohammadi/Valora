# Security Policy

## Supported version

Security fixes are maintained on the latest `main` branch.

## Reporting a vulnerability

Do not open a public issue for an unpatched security vulnerability. Use GitHub's private vulnerability reporting feature when it is available for this repository.

Include enough detail to reproduce and assess the issue, such as the affected route or component, required authentication level, impact, and a minimal proof of concept.

## Security boundaries

Changes that affect authentication, authorization, orders, payments, file uploads, or administrative operations require explicit regression testing. In particular:

- order records must remain restricted to their owner or an administrator
- payment state changes must remain restricted to the owning customer or an administrator
- administrative routes must enforce authorization on the server
- uploaded product images must remain authenticated, type-validated, and size-limited
- credentials and production secrets must never be committed

## Secrets

Use `.env.example` for configuration documentation. Real database credentials, JWT secrets, payment credentials, and other sensitive values belong only in secure environment configuration.
