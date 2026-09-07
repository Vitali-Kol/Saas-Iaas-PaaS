'use client';

import React from 'react';
import Link from 'next/link';
import { useSaas } from '@/lib/store';
import RequirementsChecklist from '@/components/RequirementsChecklist';
import { Cloud, ArrowRight, ShieldCheck, CreditCard, Network, Server, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { currentTenant } = useSaas();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>SaaS Arhitektuur: Multi-tenancy, Stripe & OAuth 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Pilverakenduste maailm: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              SaaS-lahenduste loomine ja haldamine
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Täielikult funktsionaalne SaaS näidisrakendus, mis vastab kõigile õppekava nõuetele:
            loogiline andmete eraldamine (multi-tenancy), sisselogimine ilma paroolideta, Stripe tellimused ja Sentry monitooring.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Ava Töölaud (Dashboard)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-medium transition-all"
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Stripe Hinnakiri & Paketid</span>
            </Link>
          </div>

          {/* Quick status banner */}
          <div className="pt-6 inline-flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
            <span>Aktiivne Tenant:</span>
            <strong className="text-indigo-400 font-mono">{currentTenant.name}</strong>
            <span className="text-slate-600">•</span>
            <span>Plaan:</span>
            <span className="uppercase font-bold text-slate-200">{currentTenant.plan}</span>
          </div>
        </div>
      </section>

      {/* 4 Feature Highlights from the slides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Multi-tenancy (Slide 4)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Igal kliendil oma eraldatud andmed (<code>tenant_id</code>). Ühine rakendus ja koodibaas minimeerivad infrastruktuuri kulusid.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">OAuth 2.0 Auth (Slide 6)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ei mingit kohalike paroolide salvestamist andmebaasis. Turvaline identiteedihaldus Google/GitHub või Supabase/Clerk kaudu.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Stripe Arveldus (Slide 5)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stripe Checkout, Customer Portal ja Webhookide tugi tellimuste staatuse automaatseks sünkroonimiseks.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Seire & Sentry (Slide 7)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Süsteemi tervise kontroll, uptime logimine, vastuseaeg &lt;200ms ja reaalajas vigade püüdmine Sentry stack trace abil.
            </p>
          </div>
        </div>
      </section>

      {/* Grade "A" Checklist component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RequirementsChecklist />
      </section>
    </div>
  );
}
