import { toggleAutomation } from '@/db/store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { active?: boolean };
  if (typeof body.active !== 'boolean') return Response.json({ error: 'Active must be true or false.' }, { status: 400 });
  await toggleAutomation(id, body.active);
  return Response.json({ ok: true });
}
