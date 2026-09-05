import { createLead, listLeads } from '@/db/store';
import { staffApi, readJson, failure } from '@/lib/access';
import { cleanLead } from '@/lib/lead-input';

export async function GET(request: Request) {
  const denied = await staffApi(request);
  if (denied) return denied;
  return Response.json(await listLeads(), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const denied = await staffApi(request, true);
  if (denied) return denied;
  const lead = cleanLead(await readJson(request));
  if (!lead) return failure('Enter a name, valid email, service, and a finite nonnegative value.', 400);
  return Response.json(await createLead(lead), { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
