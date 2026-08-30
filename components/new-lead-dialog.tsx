'use client';

import { SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NewLeadDialog({ source = 'Manual' }: { source?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...data, source, value: Number(data.value || 0) }) });
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Could not save this lead.' })) as { error?: string };
      setError(body.error ?? 'Could not save this lead.');
      setSaving(false);
      return;
    }
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="rounded-xl px-4 font-semibold" />}>
        <Plus data-icon="inline-start" /> New lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Add a new opportunity</DialogTitle>
            <DialogDescription>Capture the customer and service details. GrowthDesk starts the follow-up workflow immediately.</DialogDescription>
          </DialogHeader>
          <div className="my-5 grid gap-4">
            <div className="grid gap-1.5"><Label htmlFor="lead-name">Name</Label><Input id="lead-name" name="name" placeholder="Customer name" required /></div>
            <div className="grid gap-1.5"><Label htmlFor="lead-email">Email</Label><Input id="lead-email" name="email" type="email" placeholder="name@company.com" required /></div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              <div className="grid gap-1.5"><Label htmlFor="lead-phone">Phone</Label><Input id="lead-phone" name="phone" placeholder="+1 555 000 0000" /></div>
              <div className="grid gap-1.5"><Label htmlFor="lead-value">Est. value</Label><Input id="lead-value" name="value" type="number" min="0" placeholder="1200" /></div>
            </div>
            <div className="grid gap-1.5"><Label htmlFor="lead-service">Service</Label><Input id="lead-service" name="service" placeholder="What are they interested in?" required /></div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <DialogFooter><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create lead'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
