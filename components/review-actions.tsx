'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ReviewActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  async function update(next: string) { await fetch(`/api/reviews/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: next }) }); router.refresh(); }
  if (status === 'published') return <Button size="sm" variant="outline" onClick={() => update('private')}>Unpublish</Button>;
  return <div className="flex gap-2"><Button size="sm" onClick={() => update('published')}>Publish</Button>{status !== 'private' ? <Button size="sm" variant="outline" onClick={() => update('private')}>Keep private</Button> : null}</div>;
}
