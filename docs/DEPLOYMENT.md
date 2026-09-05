# Deployment

## Railway

The repository includes a `Dockerfile` and `railway.json`.

1. Create a Railway project from the repository.
2. Use the included Dockerfile builder.
3. Attach persistent storage for the Wrangler runtime directory if using local D1 persistence.
4. Set `GROWTHDESK_MODE=production`, `GROWTHDESK_ADMIN_KEY` to a randomly generated secret of at least 32 characters, and `GROWTHDESK_ORIGIN` to the exact HTTPS origin without a trailing slash. Mount persistent storage at `/app/runtime`. The startup adapter passes only these three variables to the Worker runtime.
5. Confirm that `/health` returns a successful response.
6. Test database persistence across a redeploy before launch.

The container listens on the `PORT` value supplied by Railway. Open `/login` to obtain an eight-hour signed owner session. Sign-out clears the browser cookie; rotating the access key invalidates every session. Missing or invalid configuration fails closed.

For a local fictional demonstration, copy `.env.example` to `.dev.vars`, keep `GROWTHDESK_MODE=demo`, then run `npm ci` and `npm run dev` with Node.js 22 or later. Demo mode rejects writes.

Use separate databases and volumes for demonstrations and production. Never switch a database containing real records into demo mode, which intentionally allows public reading. Create a fresh buyer-owned deployment instead of converting the seller showcase. Production starts without fictional leads.

Replace all Northstar/Sunny example prices, services, images and contact copy before accepting enquiries. The assistant uses keyword-based FAQ rules. Most CRM modules are previews; read PRODUCT-SCOPE.md before launch.

## Cloudflare-compatible deployment

The application uses a D1 binding named `DB`. Create a fresh database and bind it as `DB`; first-run setup creates the tables. Set the same three environment variables in the Worker environment. Sites deployments use the Sites build and publishing workflow.

Do not copy the original Noerong project identifier from a seller deployment. Create a new project and database in the buyer's account.

## Production checklist

- Buyer owns the deployment account and domain
- Staff authentication and authorization are enabled
- External API secrets exist only in environment variables
- Sample content is replaced or removed
- HTTPS is active
- Database persistence and backups are verified
- Public forms have abuse protection and rate limiting appropriate to expected traffic
- Privacy policy and consent text match the buyer's jurisdiction

Basic rate limits use the Cloudflare client IP when available, otherwise a shared bucket. Adapt these controls to the deployment proxy and expected traffic. Public enquiries require the configured same origin.

Run `npm run lint`, `npm test` and `npm run build`. The HTTP regression harness uses a fixed test-only key and local origin; run it only against an isolated development database. Before handoff, test owner sign-in, failed sign-in, consent, enquiry capture, stage changes, settings, logout, persistence after redeploy, backup and restoration. Keep runtime data, `.dev.vars` and exports outside source control.
