# GrowthDesk 1.1: scope and readiness

GrowthDesk is a developer foundation for one business. It is not a finished all-in-one CRM. The public demonstration contains fictional records and rejects writes.

Working features: owner sign-in, server-side staff access checks, signed eight-hour sessions, same-origin write protection, validated public enquiries, manual leads, stage changes and stored business settings. Basic persistent rate limits and a honeypot protect enquiries.

Preview-only areas: inbox delivery, automation execution, client/project creation, portal approvals, file downloads, payments, feedback submission and provider synchronization. These require additional development. Automation toggles save configuration only. Report charts are illustrative. The website assistant uses sample keyword-based FAQ rules, not an AI model.

## What GrowthDesk provides

GrowthDesk provides a connected application foundation for the customer lifecycle of a service business.

### Lead capture

The public customer experience can create structured lead records. Staff can add leads manually and move them through defined opportunity stages.

### Customer inbox

The inbox presents conversations beside the relevant customer and opportunity context. It is ready to be connected to buyer-owned email, SMS, or messaging providers.

### Automations

The automation area models triggers, actions, activity, and conversion. Provider-specific delivery must be connected to the buyer's own messaging and scheduling accounts.

### Client delivery

Fictional projects illustrate progress, next actions, invoice status, deliverable counts and tokenized portal routes. Customer project creation, file delivery, payments and approvals are not implemented.

### Feedback

The review data model supports pending, private and published moderation states. Public feedback collection is not implemented.

### Reporting

Counts and lead values derive from stored records. Estimated pipeline value is not revenue. Illustrative charts are labelled; response time and message delivery are not tracked.

### White-label settings

Business name, support email, booking link, and brand color are stored centrally and can be extended with additional settings.

## Included in the source product

- Application source code
- Database schema and automatic first-run setup
- Fictional sample records
- Responsive layouts and reusable UI components
- Dockerfile and Railway configuration
- Setup, customization, deployment, and handoff documentation
- Single-organization commercial license

## Not included in the source product

- Managed hosting or a domain name
- Authentication provider accounts
- Email, SMS, payment, calendar, storage, or AI provider accounts
- Custom integrations or data migrations
- Installation or customization labor
- A resale or redistribution license

## Important production step

Follow DEPLOYMENT.md to configure single-owner access and a fresh persistent production database. The included shared-key access is intended for one trusted operator. Separate user accounts, team roles and per-user session revocation require an identity provider and additional server authorization. Production starts without fictional leads. Never enable demo mode against a database containing real records because demo mode permits public reading.
