import { staffApi, readJson, failure } from '@/lib/access';
import { getSettings, saveSettings } from '@/db/store';

const allowed = new Set(['business_name', 'support_email', 'booking_url', 'brand_color']);

export async function GET() { return Response.json(await getSettings()); }

export async function PUT(request: Request) {
  const denied = await staffApi(request, true);
  if (denied) return denied;
  const body = await readJson(request);
  if (!body) return failure('Invalid JSON request.', 400);
  const clean = Object.fromEntries(Object.entries(body).filter(([key, value]) => allowed.has(key) && typeof value === 'string').map(([key, value]) => [key, String(value).trim()]));
  if (!clean.business_name || !clean.support_email || !clean.booking_url) return Response.json({ error: 'Complete all required fields.' }, { status: 400 });
  if (Object.values(clean).some(value => value.length > 300) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.support_email) || !clean.booking_url.startsWith('https://') || !/^#[0-9a-fA-F]{6}$/.test(clean.brand_color ?? '')) return failure('Use a valid email, HTTPS booking URL, and six-digit hex color.', 400);
  await saveSettings(clean);
  return Response.json({ ok: true });
}
