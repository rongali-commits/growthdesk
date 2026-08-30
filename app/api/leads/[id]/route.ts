import { updateLeadStatus } from '@/db/store';

const allowed = new Set(['new', 'contacted', 'qualified', 'proposal', 'booked', 'won', 'lost']);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { status?: string };
  if (!body.status || !allowed.has(body.status)) return Response.json({ error: 'Invalid status.' }, { status: 400 });
  await updateLeadStatus(id, body.status);
  return Response.json({ ok: true });
}
