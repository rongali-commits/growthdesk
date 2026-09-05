'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export function AutomationSwitch({ id, active }: { id: string; active: boolean }) {
  const router = useRouter(); const [checked, setChecked] = useState(active);
  const [error, setError] = useState('');
  return <div><Switch checked={checked} onCheckedChange={async (next) => {
    setError('');
    try {
      const response = await fetch(`/api/automations/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: next }) });
      if (!response.ok) { const result = await response.json() as {error?: string}; setError(result.error ?? 'Could not save.'); return; }
      setChecked(next); router.refresh();
    } catch { setError('Connection failed. Change was not saved.'); }
  }} aria-label={checked ? 'Disable workflow configuration' : 'Enable workflow configuration'} />{error ? <p role="alert" className="max-w-60 text-xs text-destructive">{error}</p> : null}</div>;
}
