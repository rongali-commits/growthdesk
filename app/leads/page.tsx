import { Filter, Mail, Phone, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { LeadStatusSelect } from '@/components/lead-status-select';
import { NewLeadDialog } from '@/components/new-lead-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listLeads } from '@/db/store';

export const dynamic = 'force-dynamic';
const stages = ['new', 'contacted', 'qualified', 'proposal', 'booked'];
const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export default async function LeadsPage() {
  const leads = await listLeads();
  return (
    <AppShell
      active="leads"
      eyebrow="Revenue pipeline"
      title="Every opportunity, clearly moving."
      subtitle="Capture demand, qualify the right customers, and keep the next action visible."
      actions={<NewLeadDialog />}
    >
      <div className="grid gap-3 md:grid-cols-5">
        {stages.map((stage) => {
          const items = leads.filter((lead) => lead.status === stage);
          return (
            <Card
              key={stage}
              className="border-0 ring-1 ring-foreground/[0.075]"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {stage}
                  </p>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <p className="mt-3 text-xl font-black">
                  {money(items.reduce((sum, item) => sum + item.value, 0))}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-4 border-0 ring-1 ring-foreground/[0.075]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            Opportunity list{' '}
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Filter className="size-3" />
              {leads.length} leads
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-xl bg-muted text-xs font-black">
                          {lead.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{lead.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="size-3" />
                            Active opportunity
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">{lead.service}</td>
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1.5 text-xs">
                        <Mail className="size-3" />
                        {lead.email}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        {lead.phone || 'Not provided'}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {lead.source}
                    </td>
                    <td className="px-5 py-4">
                      <LeadStatusSelect id={lead.id} value={lead.status} />
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-bold">
                      {money(lead.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
