import type { Metadata } from 'next';
import { accessConfig } from '@/lib/access';
export const dynamic = 'force-dynamic';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GrowthDesk | Client operations source foundation',
  description:
    'A developer foundation for lead capture and client operations. Provider integrations and delivery features require implementation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {accessConfig().demo ? <div className="relative z-50 bg-[#15251f] px-4 py-2 text-center text-sm text-white">Fictional demonstration. No real appointments, messages, payments or submissions.</div> : null}
        {children}
      </body>
    </html>
  );
}
