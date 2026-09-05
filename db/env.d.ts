declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    GROWTHDESK_MODE?: string;
    GROWTHDESK_ADMIN_KEY?: string;
    GROWTHDESK_ORIGIN?: string;
  }
}
