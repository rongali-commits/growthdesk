import { requireStaffPage } from '@/lib/access';
import { Bot, Building2, CalendarClock, Palette, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { SettingsForm } from '@/components/settings-form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/db/store';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireStaffPage();
  const settings = await getSettings();
  return <AppShell active="settings" eyebrow="Workspace settings" title="Make GrowthDesk unmistakably yours." subtitle="Configure the brand, communication, booking, and approved knowledge used across the customer journey.">
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]"><Card className="border-0 ring-1 ring-foreground/[0.075]"><CardHeader><CardTitle>Business identity</CardTitle><CardDescription>Used across the assistant, emails, portals, and review pages.</CardDescription></CardHeader><CardContent><SettingsForm settings={settings} /></CardContent></Card><div className="space-y-4"><Card className="border-0 bg-[#15251f] text-white ring-1 ring-black/5"><CardHeader><CardTitle>Workspace health</CardTitle><CardDescription className="text-white/52">Production readiness</CardDescription></CardHeader><CardContent className="space-y-3">{[[Building2, 'Brand configured'], [CalendarClock, 'Booking connected'], [Bot, 'Approved answers active'], [ShieldCheck, 'Private feedback enabled']].map(([Icon, label]) => { const Item = Icon as typeof Building2; return <div key={String(label)} className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><Item className="size-4 text-primary" /><span className="text-sm">{String(label)}</span><Badge className="ml-auto bg-primary/15 text-primary">Ready</Badge></div>})}</CardContent></Card><Card className="border-0 ring-1 ring-foreground/[0.075]"><CardContent className="p-5"><Palette className="size-5 text-[#628d28]" /><p className="mt-3 font-bold">Consistent everywhere</p><p className="mt-1 text-sm leading-6 text-muted-foreground">A single update changes how every customer touchpoint appears.</p></CardContent></Card></div></div>
  </AppShell>;
}
