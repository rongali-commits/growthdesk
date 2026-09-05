# GrowthDesk 1.1: client operations developer foundation

GrowthDesk is a source foundation for developers building a single-business client workspace. It is not a complete CRM or a subscription SaaS service.

## Implemented and tested
- Public enquiry capture with validation, consent and rate limiting
- Private owner access with signed eight-hour sessions
- Server checks on all staff pages and write APIs
- Lead creation, stage changes, settings and persistent D1-compatible storage
- Read-only demonstration with fictional records and no messages or submissions
- Responsive dashboard, client portal and reporting layouts

## Implementation still required
The inbox is an interface example, not a connected mailbox. Automation switches store configuration but do not run a delivery engine. Client portal approvals, downloads, file hosting and payment processing are not implemented. Historic charts and sample conversion numbers are illustrations. Client/project CRUD and a complete feedback-collection workflow require development. Use the separate ClientDesk, FollowDesk or ReviewDesk products when you need those existing workflows.

## Local preview
Requires Node.js 22.13+ and npm. Run npm ci. Copy .env.example to .dev.vars, keep GROWTHDESK_MODE=demo, and run npm run dev. Read the exact local address printed by the server. Demo writes are rejected. No production secrets are needed.

## Buyer deployment
Read docs/DEPLOYMENT.md before launch. Use a fresh production database. Set GROWTHDESK_MODE=production, a random GROWTHDESK_ADMIN_KEY of at least 32 characters, and the exact GROWTHDESK_ORIGIN. Missing or invalid configuration keeps staff access closed. The access model is one shared owner key, not individual staff accounts or roles.

## Checks
npm run lint
npm test
npm run build

The development HTTP regression script requires an isolated local test configuration; see tests/http-check.mjs. Never run it against a customer deployment.

Includes a single-organization commercial licence and source documentation. Installation, integrations, migration, hosting, domains and provider charges are separate. No resale or redistribution licence is included.
