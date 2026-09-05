import { accessConfig } from '@/lib/access';
import { Link } from '@/components/plain-link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const config = accessConfig();
  return <main className="grid min-h-screen place-items-center bg-background p-6">
    <section className="w-full max-w-md rounded-2xl border bg-card p-8">
      <p className="font-bold">GrowthDesk</p>
      <h1 className="mt-5 text-3xl font-bold">Staff sign-in</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Enter the private access key supplied by your workspace owner. Sessions expire after eight hours.</p>
      {config.demo ? <p className="mt-5"><Link href="/" className="underline">Open the read-only demonstration</Link></p> : !config.configured ? <p role="alert" className="mt-5">The owner must configure staff access before this workspace can open.</p> :
        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-semibold" htmlFor="access-key">Private access key</label>
          <input className="h-12 w-full rounded-lg border p-3" id="access-key" name="key" type="password" autoComplete="current-password" required maxLength={256} />
          <button className="h-12 w-full rounded-lg bg-primary font-bold text-primary-foreground" type="submit">Sign in</button>
        </form>}
      <Link href="/site" className="mt-6 inline-block text-sm underline">Customer website</Link>
    </section>
  </main>;
}
