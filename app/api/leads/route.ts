import { createLead, listLeads } from '@/db/store';

export async function GET() {
  return Response.json(await listLeads());
}

export async function POST(request: Request) {
  const body = await request.json() as { name?: string; email?: string; phone?: string; service?: string; value?: number; source?: string };
  if (!body.name?.trim() || !body.email?.includes('@') || !body.service?.trim()) return Response.json({ error: 'Name, a valid email, and service are required.' }, { status: 400 });
  const lead = await createLead({ name: body.name.trim(), email: body.email.trim(), phone: body.phone?.trim(), service: body.service.trim(), value: Math.max(0, Number(body.value || 0)), source: body.source });
  return Response.json(lead, { status: 201 });
}
