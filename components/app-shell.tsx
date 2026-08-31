import { BriefcaseBusiness, Inbox, LayoutDashboard, LineChart, Search, Settings, Sparkles, Star, UsersRound, WandSparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { NewLeadDialog } from '@/components/new-lead-dialog';
import { NotificationCenter } from '@/components/notification-center';
import { Link } from '@/components/plain-link';

const items = [
  ['dashboard', 'Command center', '/', LayoutDashboard],
  ['inbox', 'Inbox', '/inbox', Inbox],
  ['leads', 'Leads', '/leads', UsersRound],
  ['automations', 'Automations', '/automations', WandSparkles],
  ['clients', 'Client delivery', '/clients', BriefcaseBusiness],
  ['reviews', 'Reviews', '/reviews', Star],
] as const;

export function AppShell({ active, eyebrow, title, subtitle, actions, children }: { active: string; eyebrow: string; title: string; subtitle: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground lg:pl-[252px]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">GD</span>
          <span><span className="block font-heading text-[17px] font-bold tracking-[-0.035em]">GrowthDesk</span><span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Business OS</span></span>
        </Link>
        <Link href="/site" className="mt-7 flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/55 p-2.5 hover:bg-sidebar-accent">
          <span className="grid size-8 place-items-center rounded-lg bg-[#e9f6ff] text-xs font-bold text-[#245277]">N</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">Northstar Services</span><span className="block text-xs text-muted-foreground">Open customer site</span></span>
        </Link>
        <nav className="mt-6 space-y-1">
          {items.map(([id, label, href, Icon]) => <Link key={id} href={href} className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium ${active === id ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}><Icon className="size-[17px]" strokeWidth={1.8} />{label}</Link>)}
        </nav>
        <div className="mt-auto space-y-1">
          <Link href="/reports" className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium ${active === 'reports' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent'}`}><LineChart className="size-[17px]" />Reports</Link>
          <Link href="/settings" className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium ${active === 'settings' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent'}`}><Settings className="size-[17px]" />Settings</Link>
          <div className="mt-3 rounded-2xl bg-[#15251f] p-4 text-white">
            <div className="flex items-center justify-between"><span className="grid size-8 place-items-center rounded-lg bg-primary text-[#102019]"><Sparkles className="size-4" /></span><Badge className="bg-white/10 text-white">LIVE</Badge></div>
            <p className="mt-3 text-sm font-semibold">Revenue engine is on</p><p className="mt-1 text-xs leading-5 text-white/58">Every customer handoff is connected.</p>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-border/70 bg-background/88 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <Link href="/" className="grid size-9 place-items-center rounded-xl bg-primary text-xs font-black text-primary-foreground lg:hidden">GD</Link>
        <div className="hidden h-9 w-[min(36vw,380px)] items-center gap-2.5 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground md:flex"><Search className="size-4" /><span>Search customers, projects, conversations...</span></div>
        <div className="ml-auto flex items-center gap-2"><NotificationCenter />{actions ?? <NewLeadDialog />}<span className="ml-1 grid size-9 place-items-center rounded-xl bg-[#f3d9c7] text-xs font-bold text-[#70452d]">MC</span></div>
      </header>
      <section className="mx-auto w-full max-w-[1540px] px-4 py-7 pb-24 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-7"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><span className="size-2 rounded-full bg-primary shadow-[0_0_0_5px_rgba(184,255,78,0.16)]" />{eyebrow}</div><h1 className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] font-bold leading-[0.96] tracking-[-0.055em]">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p></div>
        {children}
      </section>
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-border bg-card/96 p-2 shadow-xl backdrop-blur lg:hidden">
        {items.slice(0, 5).map(([id, label, href, Icon]) => <Link key={id} href={href} aria-label={label} className={`grid size-10 place-items-center rounded-xl ${active === id ? 'bg-sidebar-primary text-white' : 'text-muted-foreground'}`}><Icon className="size-4" /></Link>)}
      </nav>
    </main>
  );
}
