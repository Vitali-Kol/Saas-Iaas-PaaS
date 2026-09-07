import type { Metadata } from 'next';
import './globals.css';
import { SaasProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import SentryAlertBar from '@/components/SentryAlertBar';

export const metadata: Metadata = {
  title: 'CloudFlow SaaS - Multi-Tenant Platform',
  description: 'Pilverakenduste maailm: SaaS-lahenduste loomine ja haldamine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <SaasProvider>
          <SentryAlertBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500 bg-slate-950">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                © 2026 <strong>CloudFlow SaaS</strong> — Õppetöö projekt hinne &quot;A&quot; nõuetele (OAuth, Stripe, Multi-tenancy, Sentry).
              </div>
              <div className="flex gap-4 font-mono text-[11px] text-slate-400">
                <span>Deploy: Render / Vercel</span>
                <span>Auth: Clerk / Supabase</span>
                <span>Billing: Stripe API</span>
              </div>
            </div>
          </footer>
        </SaasProvider>
      </body>
    </html>
  );
}
