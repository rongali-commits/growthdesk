import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionFromHeaders, validSession } from './auth-core';

export function accessConfig() {
  const values = env as unknown as Record<string, unknown>;
  const mode = values.GROWTHDESK_MODE;
  const demo = mode === 'demo';
  const secret = typeof values.GROWTHDESK_ADMIN_KEY === 'string' ? values.GROWTHDESK_ADMIN_KEY : '';
  const origin = typeof values.GROWTHDESK_ORIGIN === 'string' ? values.GROWTHDESK_ORIGIN : '';
  const configured = demo || (mode === 'production' && secret.length >= 32 && /^https?:\/\/[^/]+$/.test(origin));
  return { demo, secret, origin, configured };
}

export function failure(error: string, status: number) {
  return Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function staffApi(request: Request, write = false) {
  const config = accessConfig();
  if (!config.configured) return failure('Staff access is not configured.', 503);
  if (config.demo) return write ? failure('This is a read-only demonstration. Changes are not saved.', 403) : null;
  if (!await validSession(sessionFromHeaders(request.headers), config.secret)) return failure('Sign in to continue.', 401);
  if (write && request.headers.get('origin') !== config.origin) return failure('Request origin is not allowed.', 403);
  return null;
}

export async function requireStaffPage() {
  const config = accessConfig();
  if (config.demo) return;
  if (!config.configured || !await validSession(sessionFromHeaders(await headers()), config.secret)) redirect('/login');
}

export async function readBoundedText(request: Request, limit = 8192) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const buffer = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(buffer);
}

export async function readJson(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return null;
  try {
    const raw = await readBoundedText(request);
    if (raw === null) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch { return null; }
}
