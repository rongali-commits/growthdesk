import { accessConfig, failure, readBoundedText } from '@/lib/access';
import { createSession, equalSecret, SESSION_COOKIE, SESSION_SECONDS } from '@/lib/auth-core';
import { allowRequest } from '@/db/store';

export async function POST(request: Request) {
  const config = accessConfig();
  if (config.demo || !config.configured) return failure('Staff access is unavailable.', 503);
  if (request.headers.get('origin') !== config.origin) return failure('Request origin is not allowed.', 403);
  if (!await allowRequest(`login:${request.headers.get('cf-connecting-ip') ?? 'shared'}`, 10, 900)) return failure('Too many attempts. Try again in 15 minutes.', 429);
  if (Number(request.headers.get('content-length') ?? 0) > 2048) return failure('Invalid sign-in request.', 400);
  const raw = await readBoundedText(request, 2048);
  if (raw === null) return failure('Invalid sign-in request.', 400);
  const key = new URLSearchParams(raw).get('key') ?? '';
  if (!await equalSecret(key, config.secret)) return new Response('Incorrect access key. Return to /login and try again.', { status: 401, headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } });
  const token = await createSession(config.secret);
  return new Response(null, { status: 303, headers: { Location: '/', 'Cache-Control': 'no-store', 'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}${config.origin.startsWith('https:') ? '; Secure' : ''}` } });
}
