import { ArrowRight, Bot, CalendarCheck2, MessageSquareText, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { AutomationSwitch } from '@/components/automation-switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listAutomations } from '@/db/store';

export const dynamic = 'force-dynamic';
const icons = [Bot, MessageSquareText, CalendarCheck2, Sparkles];

export default async function AutomationsPage() {
  const automations = await listAutomations();
  return <AppShell active="automations" eyebrow="Lifecycle automations" title="Follow-up that feels personal." subtitle="Keep every customer moving without asking your team to remember every message and handoff.">
    <div className="grid gap-4 xl:grid-cols-2">{automations.map((automation, index) => { const Icon = icons[index % icons.length]; return <Card key={automation.id} className="border-0 ring-1 ring-foreground/[0.075]"><CardHeader><div className="mb-3 flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-[#15251f] text-primary"><Icon className="size-5" /></span><AutomationSwitch id={automation.id} active={Boolean(automation.active)} /></div><CardTitle>{automation.name}</CardTitle><CardDescription>{automation.description}</CardDescription></CardHeader><CardContent><div className="grid grid-cols-3 gap-2"><div className="rounded-xl bg-muted/60 p-3"><p className="text-xl font-black">{automation.runs}</p><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Runs</p></div><div className="rounded-xl bg-muted/60 p-3"><p className="text-xl font-black">{automation.conversion}%</p><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Conversion</p></div><div className="rounded-xl bg-muted/60 p-3"><p className="text-sm font-bold">{automation.active ? 'Running' : 'Paused'}</p><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Status</p></div></div><div className="mt-4 flex items-center gap-2 text-xs"><Badge variant="outline">Trigger</Badge><span className="text-muted-foreground">{automation.trigger}</span></div></CardContent></Card>})}</div>
    <Card className="mt-4 border-0 bg-[#15251f] text-white ring-1 ring-black/5"><CardHeader><CardTitle>Connected customer journey</CardTitle><CardDescription className="text-white/55">Each stage starts the next one with full customer context.</CardDescription></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-4">{[['Ask', 'Approved answer'], ['Capture', 'Qualified lead'], ['Deliver', 'Client portal'], ['Delight', 'Review request']].map(([title, detail], index) => <div key={title} className="relative rounded-xl border border-white/10 bg-white/5 p-4"><p className="font-bold text-primary">0{index + 1}</p><p className="mt-4 font-semibold">{title}</p><p className="mt-1 text-xs text-white/50">{detail}</p>{index < 3 ? <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden size-7 rounded-full bg-[#15251f] p-1 text-primary md:block" /> : null}</div>)}</div></CardContent></Card>
  </AppShell>;
}
