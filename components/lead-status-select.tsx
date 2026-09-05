'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LeadStatusSelect({ id, value }: { id: string; value: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  async function update(next: string) {
    setSaving(true); setError('');
    try {
      const response = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: next }) });
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Could not save the stage.');
      }
      setStatus(next); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save the stage.'); }
    finally { setSaving(false); }
  }
  return <div><select aria-label="Opportunity stage" disabled={saving} value={status} onChange={(event) => void update(event.target.value)} className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold capitalize outline-none focus:ring-2 focus:ring-ring/30">{['new', 'contacted', 'qualified', 'proposal', 'booked', 'won', 'lost'].map((option) => <option key={option} value={option}>{option}</option>)}</select>{error ? <p role="alert" className="mt-1 text-xs text-destructive">{error}</p> : null}</div>;
}
