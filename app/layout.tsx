import type { Metadata } from 'next';
import './globals.css';
import { SaasProvider } from '@/lib/store';
import { Cloud } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cloud SaaS - Autentimine ja Tellimused',
  description: 'Lihtne SaaS: Supabase Auth ja Stripe tellimused',
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
          {/* Clean minimal navbar */}
          <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <Cloud className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-100 tracking-tight text-base">
                  Cloud <span className="text-indigo-400">SaaS</span>
                </span>
              </Link>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Supabase + Stripe Active</span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 flex flex-col justify-center">{children}</main>

          {/* Minimal footer */}
          <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
            © 2026 Cloud SaaS • Supabase Auth & Stripe Billing
          </footer>
        </SaasProvider>
      </body>
    </html>
  );
}
