import { ensureDatabase } from '@/db/store';

export async function GET() {
  await ensureDatabase();
  return Response.json({ status: 'ok', product: 'GrowthDesk' });
}
