'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export function AutomationSwitch({ id, active }: { id: string; active: boolean }) {
  const router = useRouter(); const [checked, setChecked] = useState(active);
  return <Switch checked={checked} onCheckedChange={async (next) => { setChecked(next); await fetch(`/api/automations/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: next }) }); router.refresh(); }} aria-label={checked ? 'Disable automation' : 'Enable automation'} />;
}
