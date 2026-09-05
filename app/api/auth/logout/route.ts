import { accessConfig, failure } from '@/lib/access';
import { SESSION_COOKIE } from '@/lib/auth-core';

export async function POST(request: Request) {
  const config = accessConfig();
  if (request.headers.get('origin') !== config.origin) return failure('Request origin is not allowed.', 403);
  return new Response(null, { status: 303, headers: { Location: '/login', 'Cache-Control': 'no-store', 'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${config.origin.startsWith('https:') ? '; Secure' : ''}` } });
}
