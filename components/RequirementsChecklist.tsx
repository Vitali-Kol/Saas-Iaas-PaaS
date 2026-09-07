'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, CreditCard, Network, CloudUpload, Users } from 'lucide-react';

export default function RequirementsChecklist() {
  const criteria = [
    {
      id: 'team',
      icon: Users,
      title: '1. Meeskonnatöö (Teamwork)',
      desc: 'SaaS rakenduse planeerimine, rollide jaotus, GitHub commits ja Pull Requestid.',
      status: 'Ready / Git repo',
      badge: 'Git CI/CD',
    },
    {
      id: 'auth',
      icon: ShieldCheck,
      title: '2. Identiteedihaldus (OAuth 2.0 / OpenID)',
      desc: 'Turvaline sisselogimine ilma oma paroolide salvestamiseta (Google & GitHub OAuth, Supabase / Clerk toetus).',
      status: 'Implemented',
      badge: 'OAuth 2.0',
    },
    {
      id: 'billing',
      icon: CreditCard,
      title: '3. Arveldusteenus (Stripe Billing)',
      desc: 'Freemium vs Tiered pricing, Stripe Checkout integratsioon, kliendiportaal ja Webhooks arvelduse uuendamiseks.',
      status: 'Implemented',
      badge: 'Stripe API',
    },
    {
      id: 'multitenancy',
      icon: Network,
      title: '4. Multi-tenancy (Andmete eraldamine)',
      desc: 'Igal kliendil unikaalne tenant_id. Andmed on rangelt isoleeritud, ühine koodibaas.',
      status: 'Active',
      badge: 'tenant_id Scoped',
    },
    {
      id: 'deploy',
      icon: CloudUpload,
      title: '5. Deploy ja Monitooring (Sentry & Cloud)',
      desc: 'Rakenduse paigaldus Vercel / Render / Railway pilve, uptime ja latentsuse jälgimine (<200ms), Sentry stack trace.',
      status: 'Cloud Ready',
      badge: 'Sentry / Render',
    },
  ];

  return (
    <div id="requirements" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Hinne &quot;A&quot; Vastavus
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
            Projekti Nõuete Kontroll-leht (Slide 8)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Kõik 5 peamist nõuet aine läbimiseks maksimaalsele tulemusele on implementeeritud.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {item.badge}
                </span>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
