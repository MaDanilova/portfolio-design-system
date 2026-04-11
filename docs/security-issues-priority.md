# Cyber Attack Scenarios and Fixes

This document lists possible cyber attack scenarios for the product, ranked by urgency and probability, with practical remediation actions.

## Prioritized Issues

| Rank | Attack Scenario | Urgency | Probability | Why It Matters | How to Fix |
|---|---|---|---|---|---|
| 1 | Credential stuffing / account takeover | High | High | Attackers use reused passwords and automated login attempts to hijack user accounts. | Enforce MFA, add login rate limiting, implement bot detection (CAPTCHA/risk scoring), check against breached-password lists, and add lockout + safe recovery flows. |
| 2 | Broken access control (IDOR/BOLA) | High | High | Users may access another user’s reviews or assets by modifying IDs or requests. | Enforce server-side authorization on every object read/write, scope DB queries by authenticated `user_id`, never trust client-provided ownership fields, and add authorization tests for all routes. |
| 3 | Prompt injection via uploaded portfolio content | High | High | Malicious text in uploads or URLs can manipulate model behavior and leak protected instructions/data. | Sanitize and classify inputs, isolate system prompt logic, enforce tool/function allowlists, add output filtering, and block autonomous high-risk model actions. |
| 4 | Malicious file upload (parser exploit/malware) | High | Medium-High | Uploaded files can target processing libraries and infrastructure. | Verify file type by magic bytes, run AV scans, process files in isolated sandbox workers, restrict size/page count, and use strict parsing timeouts. |
| 5 | API abuse / DDoS on review generation | High | Medium-High | High-cost AI endpoints can be exhausted, causing downtime and budget spikes. | Apply per-user/org quotas, WAF + endpoint rate limits, queueing and backpressure, retry limits, and anomaly alerts with auto-throttling. |
| 6 | Session/JWT theft (XSS or token leakage) | High | Medium | Stolen session tokens enable direct account impersonation. | Use `HttpOnly`, `Secure`, `SameSite` cookies, short token TTLs, refresh token rotation, CSP, output encoding, and suspicious-session revocation. |
| 7 | Supply-chain compromise (dependencies) | High | Medium | Malicious package updates can introduce hidden backdoors. | Pin lockfiles, run dependency scanning in CI, block critical CVEs from release, minimize dependency surface, and monitor package provenance. |
| 8 | Injection attacks (SQL/NoSQL) | High | Medium | Injection can expose or alter user/review data. | Enforce parameterized queries/ORM safe APIs, validate request schemas, grant least-privilege DB access, and run SAST/DAST checks continuously. |
| 9 | SSRF via URL-based ingestion | High | Medium | URL fetch features may be abused to access internal services/metadata endpoints. | Block private IP ranges, use strict allowlists, enforce DNS rebinding protections, restrict egress via proxy, and validate scheme/content-type/timeouts. |
| 10 | Secrets exposure (env/logs/client bundle) | High | Medium | Leaked API keys or service credentials allow direct abuse of systems. | Use a secret manager, rotate keys regularly, redact logs, prevent client-side secret exposure, and enforce secret scanning pre-commit and in CI. |
| 11 | CSRF on state-changing dashboard actions | Medium-High | Medium | Attackers can trigger unwanted actions through a victim’s active session. | Use CSRF tokens, origin/referrer checks, `SameSite` cookies, and re-authentication for sensitive operations. |
| 12 | Insider misuse / over-privileged admin access | Medium-High | Medium | Overly broad internal privileges can lead to misuse or data exfiltration. | Implement RBAC least privilege, immutable audit logs, approval workflow for high-risk actions, and break-glass account controls. |

## Priority Bands

Use this model to score and schedule remediation:

`Risk Score = Urgency (1-5) x Probability (1-5)`

- 20-25: Critical (fix immediately)
- 12-19: High (fix this sprint)
- 6-11: Medium (next sprint)
- 1-5: Low (backlog)

## Immediate 30-Day Security Focus

- Week 1: MFA rollout, login protection, session hardening, and credential/key rotation.
- Week 2: Complete access-control audit and add object-level authorization tests.
- Week 3: Harden file upload pipeline with validation, AV scanning, and sandboxed processing.
- Week 4: Add AI safety controls for prompt injection and abusive usage throttling.
