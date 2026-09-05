# Setup and customization

## 1. Install the project

```bash
npm ci
# Copy .env.example to .dev.vars for the read-only fictional demo.
npm run dev
```

## 2. Replace the fictional sample data

Fictional records are created in `db/store.ts` only in explicit demo mode. Use a fresh production database and configure the production mode, owner key and exact origin in DEPLOYMENT.md. Never enable demo mode on customer data.

## 3. Configure the business identity

The Settings screen stores:

- Business name
- Support email
- Booking URL
- Primary brand color

The starter customer site and client portal contain additional example brand copy in `app/site/page.tsx`, `app/portal/[token]/page.tsx`, and shared components. Replace those examples with the buyer's approved copy and identity.

## 4. Configure opportunity stages

The default stages are:

- New
- Contacted
- Qualified
- Proposal
- Booked
- Won
- Lost

Update the allowed stage list in the lead API and interface together if the business uses a different process.

## 5. Configure owner access

The foundation includes server-side protection for one owner using a signed session and deployment access key. Follow DEPLOYMENT.md. Do not share the key with a team. Add individual accounts, server authorization and revocation before offering multi-user access. Public enquiry capture has a separate validated route.

## 6. Connect external providers

The interface and data model provide starting points for separately scoped integrations. Automation toggles currently save configuration only. Portal previews do not host files or process payments. Typical additions include:

- Email or SMS delivery for follow-up
- Calendar booking
- Payment and invoice status synchronization
- File storage
- AI-assisted replies using approved business knowledge

Store all provider secrets in deployment environment variables. Never commit them to the repository.

## 7. Verify before launch

- Run lint and build checks
- Test every public form
- Test role permissions for every staff route and API
- Replace all sample names, addresses, links, and metrics
- Confirm privacy, retention, and consent requirements for the buyer's location
- Test backups and database recovery
