import { staffApi, readJson, failure } from '@/lib/access';
import { updateReviewStatus } from '@/db/store';

const allowed = new Set(['private', 'pending', 'published']);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await staffApi(request, true);
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return failure('Invalid JSON request.', 400);
  if (typeof body.status !== 'string' || !allowed.has(body.status)) return Response.json({ error: 'Invalid review status.' }, { status: 400 });
  await updateReviewStatus(id, body.status);
  return Response.json({ ok: true });
}
