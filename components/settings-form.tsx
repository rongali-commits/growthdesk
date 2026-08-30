'use client';

import { SubmitEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [saved, setSaved] = useState(false);
  async function submit(event: SubmitEvent<HTMLFormElement>) { event.preventDefault(); setSaved(false); const body = Object.fromEntries(new FormData(event.currentTarget)); await fetch('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); setSaved(true); }
  return <form onSubmit={submit} className="grid gap-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-1.5"><Label htmlFor="business_name">Business name</Label><Input id="business_name" name="business_name" defaultValue={settings.business_name} required /></div>
      <div className="grid gap-1.5"><Label htmlFor="support_email">Support email</Label><Input id="support_email" name="support_email" type="email" defaultValue={settings.support_email} required /></div>
      <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="booking_url">Booking link</Label><Input id="booking_url" name="booking_url" type="url" defaultValue={settings.booking_url} required /></div>
      <div className="grid gap-1.5"><Label htmlFor="brand_color">Brand color</Label><div className="flex gap-2"><Input className="w-14 p-1" id="brand_color_picker" type="color" defaultValue={settings.brand_color} onChange={(event) => { const field = document.getElementById('brand_color') as HTMLInputElement | null; if (field) field.value = event.target.value; }} /><Input id="brand_color" name="brand_color" defaultValue={settings.brand_color} required /></div></div>
    </div>
    <div className="flex items-center gap-3"><Button type="submit">Save workspace</Button>{saved ? <span className="text-sm font-medium text-[#4d7418]">Changes saved</span> : null}</div>
  </form>;
}
