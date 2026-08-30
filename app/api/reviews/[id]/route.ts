import { updateReviewStatus } from '@/db/store';

const allowed = new Set(['private', 'pending', 'published']);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { status?: string };
  if (!body.status || !allowed.has(body.status)) return Response.json({ error: 'Invalid review status.' }, { status: 400 });
  await updateReviewStatus(id, body.status);
  return Response.json({ ok: true });
}
