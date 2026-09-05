'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ReviewActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function update(next: string) {
    setSaving(true); setError('');
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: next }) });
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Could not update this review.');
      }
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update this review.'); }
    finally { setSaving(false); }
  }
  return <div><div className="flex gap-2">{status === 'published' ? <Button size="sm" disabled={saving} variant="outline" onClick={() => update('private')}>Unpublish</Button> : <><Button size="sm" disabled={saving} onClick={() => update('published')}>Publish</Button>{status !== 'private' ? <Button size="sm" disabled={saving} variant="outline" onClick={() => update('private')}>Keep private</Button> : null}</>}</div>{error ? <p role="alert" className="mt-1 text-xs text-destructive">{error}</p> : null}</div>;
}
