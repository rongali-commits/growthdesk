import { ArrowRight, Bot, BriefcaseBusiness, CalendarCheck2, CircleDollarSign, Clock3, MessageSquareText, Sparkles, Star } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from '@/components/plain-link';
import { listAutomations, listLeads, listProjects, listReviews } from '@/db/store';

export const dynamic = 'force-dynamic';

function money(value: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }

export default async function Home() {
  const [leads, projects, reviews, automations] = await Promise.all([listLeads(), listProjects(), listReviews(), listAutomations()]);
  const openPipeline = leads.filter((lead) => !['won', 'lost'].includes(lead.status)).reduce((sum, lead) => sum + lead.value, 0);
  const booked = leads.filter((lead) => ['booked', 'won'].includes(lead.status)).length;
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const metrics = [
    ['Open pipeline', money(openPipeline), `${leads.length} active opportunities`, CircleDollarSign],
    ['Booked customers', String(booked), 'Qualified leads moving to delivery', CalendarCheck2],
    ['Average first reply', '48 sec', 'Assistant and lead routing are on', Clock3],
    ['Review rating', rating.toFixed(1), `${reviews.filter((review) => review.status === 'published').length} approved testimonials`, Star],
  ] as const;

  return <AppShell active="dashboard" eyebrow="Live operating system" title="Good morning, Maya." subtitle="From first hello to five-star follow-up, every customer journey is moving in one place.">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value, detail, Icon]) => <Card key={label} className="border-0 bg-card ring-1 ring-foreground/[0.075]"><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle><CardAction><span className="grid size-9 place-items-center rounded-xl bg-muted"><Icon className="size-[17px]" /></span></CardAction></CardHeader><CardContent><span className="font-heading text-3xl font-bold tracking-[-0.05em]">{value}</span><p className="mt-2 text-xs text-muted-foreground">{detail}</p></CardContent></Card>)}
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.72fr)]">
      <Card className="border-0 bg-card ring-1 ring-foreground/[0.075]"><CardHeader className="border-b border-border/70"><CardTitle>Live opportunities</CardTitle><CardDescription>The next action that keeps each sale progressing.</CardDescription><CardAction><Button render={<Link href="/leads" />} variant="outline">View pipeline <ArrowRight data-icon="inline-end" /></Button></CardAction></CardHeader><CardContent className="px-0"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead><tr className="border-b text-[11px] uppercase tracking-[0.09em] text-muted-foreground"><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Service</th><th className="px-4 py-3 text-right">Value</th></tr></thead><tbody>{leads.slice(0, 5).map((lead) => <tr key={lead.id} className="border-b border-border/60 last:border-0"><td className="px-4 py-4"><p className="text-sm font-semibold">{lead.name}</p><p className="text-xs text-muted-foreground">{lead.source}</p></td><td className="px-4 py-4"><Badge variant="outline" className="capitalize">{lead.status}</Badge></td><td className="px-4 py-4 text-sm">{lead.service}</td><td className="px-4 py-4 text-right text-sm font-bold">{money(lead.value)}</td></tr>)}</tbody></table></div></CardContent></Card>
      <Card className="border-0 bg-[#14241e] text-white ring-1 ring-black/5"><CardHeader><CardTitle>Automation health</CardTitle><CardDescription className="text-white/52">Systems working across the customer journey.</CardDescription><CardAction><Badge className="bg-primary/15 text-primary">{automations.filter((item) => item.active).length} active</Badge></CardAction></CardHeader><CardContent className="space-y-2.5">{automations.map((automation, index) => { const Icon = index % 2 ? MessageSquareText : Bot; return <div key={automation.id} className="rounded-2xl border border-white/8 bg-white/[0.045] p-3.5"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 text-primary"><Icon className="size-4" /></span><div><div className="flex items-center gap-2"><p className="text-sm font-semibold">{automation.name}</p><span className={`size-1.5 rounded-full ${automation.active ? 'bg-primary' : 'bg-white/25'}`} /></div><p className="mt-1 text-xs leading-5 text-white/50">{automation.description}</p><p className="mt-2 text-[11px] text-white/72">{automation.runs} runs · {automation.conversion}% conversion</p></div></div></div>})}<Button render={<Link href="/automations" />} className="w-full border border-white/10 bg-white/8 text-white hover:bg-white/14">Manage automations</Button></CardContent></Card>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Card className="border-0 bg-card ring-1 ring-foreground/[0.075]"><CardHeader><CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="size-4 text-[#628d28]" />Client delivery</CardTitle><CardDescription>Projects that need attention before the customer asks.</CardDescription></CardHeader><CardContent className="space-y-5">{projects.map((project) => <div key={project.id}><div className="flex justify-between text-sm"><span className="font-semibold">{project.project}</span><span className="text-muted-foreground">{project.progress}%</span></div><Progress value={project.progress} className="mt-2 h-1.5" /><div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{project.next_action}</span><span>{project.deliverables} deliverables</span></div></div>)}</CardContent></Card>
      <Card className="border-0 bg-card ring-1 ring-foreground/[0.075]"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-[#628d28]" />Customer journey</CardTitle><CardDescription>One connected path from visitor to advocate.</CardDescription></CardHeader><CardContent><div className="grid grid-cols-4 gap-2">{[['Capture', leads.length], ['Follow up', leads.filter((lead) => lead.status !== 'new').length], ['Deliver', projects.length], ['Delight', reviews.length]].map(([label, value], index) => <div key={String(label)} className="relative rounded-xl bg-muted/55 p-3 text-center"><p className="text-xl font-black">{value}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>{index < 3 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 size-4 -translate-y-1/2 rounded-full bg-card text-muted-foreground" /> : null}</div>)}</div><Button render={<Link href="/site" />} variant="outline" className="mt-5 w-full">Open customer experience <ArrowRight data-icon="inline-end" /></Button></CardContent></Card>
    </div>
  </AppShell>;
}
