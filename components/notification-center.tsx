'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

export function NotificationCenter() {
  return <Popover>
    <PopoverTrigger render={<Button variant="outline" size="icon-lg" aria-label="Notifications" className="rounded-xl" />}>
      <Bell className="size-4" />
    </PopoverTrigger>
    <PopoverContent align="end" className="w-80 p-4">
      <PopoverHeader>
        <PopoverTitle>Notifications</PopoverTitle>
        <PopoverDescription>Three customer moments need attention.</PopoverDescription>
      </PopoverHeader>
      <div className="mt-2 space-y-2">
        {[
          ['New qualified lead', 'Olivia requested a move-out quote.'],
          ['Client approval', 'Lumen Dental is ready for final handoff.'],
          ['Follow-up reply', 'Sofia asked about the kitchen deep clean.'],
        ].map(([title, detail]) => <div key={title} className="rounded-xl bg-muted/60 p-3"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div>)}
      </div>
    </PopoverContent>
  </Popover>;
}
