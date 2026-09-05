// Shared-owner access, not a multi-user identity system. Rotate the access key
// to invalidate all sessions. Never include this key in browser bundles.
const encoder = new TextEncoder();
export const SESSION_SECONDS = 8 * 60 * 60;
export const SESSION_COOKIE = 'growthdesk_session';

export async function equalSecret(a: string, b: string): Promise<boolean> {
  const [left, right] = await Promise.all([a, b].map(value => crypto.subtle.digest('SHA-256', encoder.encode(value))));
  const bytes = new Uint8Array(left); const other = new Uint8Array(right);
  let diff = 0;
  for (let i = 0; i < bytes.length; i++) diff |= bytes[i] ^ other[i];
  return diff === 0;
}

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function createSession(secret: string, now = Date.now()) {
  const value = `${Math.floor(now / 1000) + SESSION_SECONDS}.${crypto.randomUUID()}`;
  return `${value}.${await signature(value, secret)}`;
}

export async function validSession(token: string, secret: string, now = Date.now()) {
  if (secret.length < 32 || !/^\d{10}\.[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(token)) return false;
  const [expires, nonce, mac] = token.split('.');
  const remaining = Number(expires) - Math.floor(now / 1000);
  if (remaining <= 0 || remaining > SESSION_SECONDS) return false;
  return equalSecret(mac, await signature(`${expires}.${nonce}`, secret));
}

export function sessionFromHeaders(headers: Headers) {
  return (headers.get('cookie') ?? '').split(';').map(item => item.trim()).find(item => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1) ?? '';
}
