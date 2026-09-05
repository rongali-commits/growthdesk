import { staffApi, readJson, failure } from '@/lib/access';
import { toggleAutomation } from '@/db/store';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await staffApi(request, true);
  if (denied) return denied;
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return failure('Invalid JSON request.', 400);
  if (typeof body.active !== 'boolean') return Response.json({ error: 'Active must be true or false.' }, { status: 400 });
  await toggleAutomation(id, body.active);
  return Response.json({ ok: true });
}
