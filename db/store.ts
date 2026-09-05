import { env } from 'cloudflare:workers';
import { accessConfig } from '@/lib/access';

export type Lead = { id: string; name: string; email: string; phone: string; service: string; source: string; status: string; value: number; created_at: string };
export type Conversation = { id: string; lead_id: string; name: string; subject: string; preview: string; channel: string; intent: string; unread: number; created_at: string };
export type Project = { id: string; token: string; client: string; project: string; progress: number; status: string; next_action: string; invoice_status: string; value: number; deliverables: number };
export type Review = { id: string; customer: string; service: string; rating: number; quote: string; status: string; created_at: string };
export type Automation = { id: string; name: string; trigger: string; description: string; runs: number; conversion: number; active: number };

let ready: Promise<void> | undefined;

function database() {
  if (!env.DB) throw new Error('GrowthDesk database binding is unavailable.');
  return env.DB;
}

async function rows<T>(sql: string, ...values: unknown[]): Promise<T[]> {
  const result = await database().prepare(sql).bind(...values).all<T>();
  return result.results ?? [];
}

async function setup() {
  const db = database();
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '', service TEXT NOT NULL, source TEXT NOT NULL, status TEXT NOT NULL, value INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)"),
    db.prepare('CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, name TEXT NOT NULL, subject TEXT NOT NULL, preview TEXT NOT NULL, channel TEXT NOT NULL, intent TEXT NOT NULL, unread INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, token TEXT NOT NULL UNIQUE, client TEXT NOT NULL, project TEXT NOT NULL, progress INTEGER NOT NULL, status TEXT NOT NULL, next_action TEXT NOT NULL, invoice_status TEXT NOT NULL, value INTEGER NOT NULL, deliverables INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, customer TEXT NOT NULL, service TEXT NOT NULL, rating INTEGER NOT NULL, quote TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS automations (id TEXT PRIMARY KEY, name TEXT NOT NULL, trigger TEXT NOT NULL, description TEXT NOT NULL, runs INTEGER NOT NULL DEFAULT 0, conversion INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1)'),
    db.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)'),
  ]);

  if (!accessConfig().demo) {
    await db.batch([
      db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('business_name', 'Your business'),
      db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('support_email', 'team@example.com'),
      db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('booking_url', 'https://example.com'),
      db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('brand_color', '#b8ff4e'),
    ]);
    return;
  }
  const count = await db.prepare('SELECT COUNT(*) AS total FROM leads').first<{ total: number }>();
  if ((count?.total ?? 0) > 0) return;

  const now = new Date().toISOString();
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('lead-sofia', 'Sofia Green', 'sofia@greenhome.co', '+1 415 555 0194', 'Deep clean package', 'Website assistant', 'qualified', 780, now),
    db.prepare('INSERT OR IGNORE INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('lead-aarav', 'Aarav Patel', 'aarav@lumenworks.co', '+1 312 555 0138', 'Office care plan', 'Referral', 'booked', 2400, now),
    db.prepare('INSERT OR IGNORE INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('lead-olivia', 'Olivia Chen', 'olivia@harborview.co', '+1 206 555 0141', 'Move-out service', 'Website assistant', 'new', 460, now),
    db.prepare('INSERT OR IGNORE INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('lead-ethan', 'Ethan Brooks', 'ethan@riverside.co', '+1 646 555 0122', 'Quarterly maintenance', 'Google', 'contacted', 3200, now),
    db.prepare('INSERT OR IGNORE INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('lead-lena', 'Lena Ortiz', 'lena@asterlane.co', '+1 512 555 0105', 'Workspace refresh', 'LinkedIn', 'proposal', 6800, now),
    db.prepare('INSERT OR IGNORE INTO conversations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('conv-olivia', 'lead-olivia', 'Olivia Chen', 'Move-out cleaning availability', 'We are handing over the keys next Friday. Can your team help before then?', 'Website', 'High intent', 1, now),
    db.prepare('INSERT OR IGNORE INTO conversations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('conv-sofia', 'lead-sofia', 'Sofia Green', 'Quote details', 'The plan looks good. Could you confirm what is included in the kitchen deep clean?', 'Email', 'Quote question', 1, now),
    db.prepare('INSERT OR IGNORE INTO conversations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('conv-jordan', 'lead-aarav', 'Jordan Miles', 'Commercial plan', 'Please send the monthly option for our two-floor office.', 'Website', 'Pricing', 0, now),
    db.prepare('INSERT OR IGNORE INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('project-riverside', 'riverside-portal', 'Ethan Brooks', 'Riverside Offices', 72, 'In progress', 'Approve onboarding plan', 'Due in 5 days', 9200, 2),
    db.prepare('INSERT OR IGNORE INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('project-harborview', 'harborview-portal', 'Olivia Chen', 'Harborview Residence', 46, 'In progress', 'Review room checklist', 'Reminder due', 4600, 1),
    db.prepare('INSERT OR IGNORE INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind('project-lumen', 'lumen-portal', 'Aarav Patel', 'Lumen Dental', 88, 'Client review', 'Approve final handoff', 'Paid', 7800, 4),
    db.prepare('INSERT OR IGNORE INTO reviews VALUES (?, ?, ?, ?, ?, ?, ?)').bind('review-amanda', 'Amanda Foster', 'Office care plan', 5, 'The entire experience felt organized from the first message to the final walkthrough.', 'published', now),
    db.prepare('INSERT OR IGNORE INTO reviews VALUES (?, ?, ?, ?, ?, ?, ?)').bind('review-marcus', 'Marcus Hall', 'Deep clean package', 5, 'Fast communication, a clear portal, and an excellent result. Exactly what we needed.', 'pending', now),
    db.prepare('INSERT OR IGNORE INTO reviews VALUES (?, ?, ?, ?, ?, ?, ?)').bind('review-nina', 'Nina Shah', 'Workspace refresh', 3, 'The work was good, but we would have appreciated an earlier arrival update.', 'private', now),
    db.prepare('INSERT OR IGNORE INTO automations VALUES (?, ?, ?, ?, ?, ?, ?)').bind('auto-assistant', 'Website assistant', 'Visitor asks a question', 'Answers approved questions, qualifies intent, and creates a lead.', 142, 31, 1),
    db.prepare('INSERT OR IGNORE INTO automations VALUES (?, ?, ?, ?, ?, ?, ?)').bind('auto-followup', 'Lead follow-up', 'New lead captured', 'Sends a four-touch sequence and routes replies into the shared inbox.', 96, 44, 1),
    db.prepare('INSERT OR IGNORE INTO automations VALUES (?, ?, ?, ?, ?, ?, ?)').bind('auto-kickoff', 'Client kickoff', 'Proposal accepted', 'Creates the client portal, checklist, and first project update.', 27, 78, 1),
    db.prepare('INSERT OR IGNORE INTO automations VALUES (?, ?, ?, ?, ?, ?, ?)').bind('auto-review', 'Review recovery', 'Project completed', 'Requests feedback, routes concerns privately, and publishes approved praise.', 61, 54, 1),
    db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('business_name', 'Northstar Services'),
    db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('support_email', 'hello@northstarservices.co'),
    db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('booking_url', 'https://cal.com/northstar/consultation'),
    db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?)').bind('brand_color', '#b8ff4e'),
  ]);
}

export async function ensureDatabase() { ready ??= setup().catch(error => { ready = undefined; throw error; }); return ready; }
export async function listLeads() { await ensureDatabase(); return rows<Lead>('SELECT * FROM leads ORDER BY created_at DESC'); }
export async function listConversations() { await ensureDatabase(); return rows<Conversation>('SELECT * FROM conversations ORDER BY unread DESC, created_at DESC'); }
export async function listProjects() { await ensureDatabase(); return rows<Project>('SELECT * FROM projects ORDER BY progress DESC'); }
export async function listReviews() { await ensureDatabase(); return rows<Review>('SELECT * FROM reviews ORDER BY created_at DESC'); }
export async function listAutomations() { await ensureDatabase(); return rows<Automation>('SELECT * FROM automations ORDER BY id'); }
export async function getProjectByToken(token: string) { await ensureDatabase(); return database().prepare('SELECT * FROM projects WHERE token = ?').bind(token).first<Project>(); }

export async function createLead(input: { name: string; email: string; phone?: string; service: string; value?: number; source?: string }) {
  await ensureDatabase();
  const lead: Lead = { id: crypto.randomUUID(), name: input.name, email: input.email, phone: input.phone ?? '', service: input.service, source: input.source ?? 'Manual', status: 'new', value: input.value ?? 0, created_at: new Date().toISOString() };
  await database().prepare('INSERT INTO leads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(lead.id, lead.name, lead.email, lead.phone, lead.service, lead.source, lead.status, lead.value, lead.created_at).run();
  return lead;
}

export async function updateLeadStatus(id: string, status: string) { await ensureDatabase(); return database().prepare('UPDATE leads SET status = ? WHERE id = ?').bind(status, id).run(); }
export async function updateReviewStatus(id: string, status: string) { await ensureDatabase(); return database().prepare('UPDATE reviews SET status = ? WHERE id = ?').bind(status, id).run(); }
export async function toggleAutomation(id: string, active: boolean) { await ensureDatabase(); return database().prepare('UPDATE automations SET active = ? WHERE id = ?').bind(active ? 1 : 0, id).run(); }
export async function getSettings() { await ensureDatabase(); const data = await rows<{ key: string; value: string }>('SELECT * FROM settings'); return Object.fromEntries(data.map((item) => [item.key, item.value])); }
export async function saveSettings(input: Record<string, string>) { await ensureDatabase(); for (const [key, value] of Object.entries(input)) await database().prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(key, value).run(); }

// Persistent fixed windows, including a conservative fallback for unknown proxies.
export async function allowRequest(key: string, limit: number, seconds: number) {
  const db = database(); const now = Math.floor(Date.now() / 1000);
  await db.prepare('CREATE TABLE IF NOT EXISTS request_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)').run();
  await db.prepare('DELETE FROM request_limits WHERE expires < ?').bind(now).run();
  const row = await db.prepare('INSERT OR IGNORE INTO request_limits VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count').bind(key, now + seconds).first<{ count: number }>();
  return (row?.count ?? limit + 1) <= limit;
}
