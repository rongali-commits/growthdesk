'use client';

import { ArrowRight } from 'lucide-react';

import { Link } from '@/components/plain-link';
import { Button } from '@/components/ui/button';

function openQuote() {
  window.dispatchEvent(new Event('growthdesk:open-quote'));
}

export function HeaderQuoteButton() {
  return (
    <Button
      onClick={openQuote}
      className="ml-auto rounded-full bg-[#15392f] px-5 text-white md:ml-4"
    >
      Get a quote
    </Button>
  );
}

export function HeroActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button
        onClick={openQuote}
        className="h-12 rounded-full bg-[#15392f] px-6 text-white"
      >
        Get my free quote <ArrowRight className="size-4" />
      </Button>
      <Button
        render={<Link href="#services" />}
        variant="outline"
        className="h-12 rounded-full border-[#15392f]/20 bg-transparent px-6"
      >
        Explore services
      </Button>
    </div>
  );
}
