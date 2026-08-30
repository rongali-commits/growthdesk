'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LeadStatusSelect({ id, value }: { id: string; value: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  return <select aria-label="Opportunity stage" value={status} onChange={async (event) => { const next = event.target.value; setStatus(next); await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: next }) }); router.refresh(); }} className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold capitalize outline-none focus:ring-2 focus:ring-ring/30">{['new', 'contacted', 'qualified', 'proposal', 'booked', 'won', 'lost'].map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}
