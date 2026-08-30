import { getSettings, saveSettings } from '@/db/store';

const allowed = new Set(['business_name', 'support_email', 'booking_url', 'brand_color']);

export async function GET() { return Response.json(await getSettings()); }

export async function PUT(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const clean = Object.fromEntries(Object.entries(body).filter(([key, value]) => allowed.has(key) && typeof value === 'string').map(([key, value]) => [key, String(value).trim()]));
  if (!clean.business_name || !clean.support_email || !clean.booking_url) return Response.json({ error: 'Complete all required fields.' }, { status: 400 });
  await saveSettings(clean);
  return Response.json({ ok: true });
}
