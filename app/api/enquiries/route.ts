import { createLead, allowRequest } from '@/db/store';
import { accessConfig, failure, readJson } from '@/lib/access';
import { cleanLead } from '@/lib/lead-input';

export async function POST(request: Request) {
  const config = accessConfig();
  if (config.demo) return failure('Sample demonstration only. No enquiry is sent or saved.', 403);
  if (!config.configured) return failure('Enquiry capture is not configured.', 503);
  if (request.headers.get('origin') !== config.origin) return failure('Request origin is not allowed.', 403);
  if (!await allowRequest(`enquiry:${request.headers.get('cf-connecting-ip') ?? 'shared'}`, 10, 60)) return failure('Please wait a minute before trying again.', 429);
  const body = await readJson(request);
  const lead = cleanLead(body, true);
  if (!lead || body?.consent !== true || body?.website) return failure('Complete the required contact fields and consent.', 400);
  await createLead(lead);
  return Response.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
