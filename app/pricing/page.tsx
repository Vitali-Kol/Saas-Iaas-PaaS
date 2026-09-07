'use client';

import React, { useState } from 'react';
import { useSaas } from '@/lib/store';
import { Check, Zap, Shield, Sparkles, CreditCard, ArrowRight, RefreshCw } from 'lucide-react';
import { TenantPlan } from '@/lib/types';
import Link from 'next/link';

export default function PricingPage() {
  const { currentTenant, upgradePlan } = useSaas();
  const [loadingPlan, setLoadingPlan] = useState<TenantPlan | null>(null);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);

  const handleCheckout = async (plan: TenantPlan) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          tenantId: currentTenant.id,
          returnUrl: window.location.origin,
        }),
      });

      const data = await res.json();
      if (data.url) {
        if (data.mode === 'mock') {
          // Instantly simulate successful upgrade for class demo
          upgradePlan(plan);
          alert(`🎉 Stripe Checkout Simulatsioon: Makse edukas! Organisatsioon "${currentTenant.name}" on nüüd ${plan.toUpperCase()} plaanil.`);
        } else {
          // Redirect to real Stripe Checkout
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error(err);
      alert('Viga checkout algatamisel');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSimulateWebhook = async () => {
    setWebhookMessage('Saadan Stripe webhook päringut serverisse...');
    try {
      const res = await fetch('/api/stripe/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: { object: { client_reference_id: currentTenant.id, amount_total: 2900 } },
        }),
      });
      const data = await res.json();
      setWebhookMessage(`✅ Webhook edukalt töödeldud! Vastus: ${JSON.stringify(data.message || data.received)}`);
    } catch (e: any) {
      setWebhookMessage(`❌ Viga webhookis: ${e.message}`);
    }
  };

  const plans = [
    {
      id: 'free' as TenantPlan,
      name: 'Free (Algajad)',
      price: '0 €',
      period: 'igavesti',
      description: 'Baasfunktsioonid väikeettevõtetele või katsetamiseks.',
      features: [
        'Kuni 3 ülesannet tenant kohta',
        '1 administraatori konto',
        'Multi-tenancy andmete eraldus',
        'Ühiskasutatav infrastruktuur',
      ],
      cta: 'Praegune plaan',
      highlighted: false,
    },
    {
      id: 'pro' as TenantPlan,
      name: 'Pro (Populaarseim)',
      price: '29 €',
      period: 'kuus',
      description: 'Kiiresti kasvavatele tiimidele ja professionaalidele.',
      features: [
        'Piiramatu arv ülesandeid',
        'Kuni 20 tiimiliiget',
        'Stripe Customer Portal haldus',
        'Sentry prioriteetne veajälgimine',
        'Garanteeritud 99.9% uptime SLA',
      ],
      cta: 'Telli Pro (Stripe Checkout)',
      highlighted: true,
    },
    {
      id: 'enterprise' as TenantPlan,
      name: 'Enterprise',
      price: '99 €',
      period: 'kuus',
      description: 'Suurtele organisatsioonidele spetsiaalsete nõuetega.',
      features: [
        'Piiramatu arv tenante ja kasutajaid',
        'Pühendatud andmebaasi eksemplar',
        'Eraldiseisev OAuth 2.0 SSO pakkuja',
        '24/7 telefonitugi & Sentry reaalajas logid',
        'Kohandatud arvelduslepingud',
      ],
      cta: 'Vali Enterprise',
      highlighted: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span>Slide 5: Hinnastamine ja arveldus SaaS rakenduses</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Paindlikud paketid igale ettevõttele
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Valitud tenant: <strong className="text-indigo-400 font-mono">{currentTenant.name}</strong>.
          Kõik maksed ja arveldused seotakse konkreetse <code>tenant_id</code>-ga.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const isCurrent = currentTenant.plan === p.id;
          return (
            <div
              key={p.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                p.highlighted
                  ? 'bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105'
                  : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {p.highlighted && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3 h-3" />
                    <span>Soovitatav</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{p.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-400">/ {p.period}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800 mb-8">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Pakett sisaldab:
                  </div>
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl text-xs font-semibold bg-slate-800 text-slate-400 cursor-default border border-slate-700"
                  >
                    Hetkel aktiivne pakett
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckout(p.id)}
                    disabled={loadingPlan !== null}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all shadow-lg ${
                      p.highlighted
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{loadingPlan === p.id ? 'Töötlemine...' : p.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stripe Webhook Testing Section for students/professors */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Stripe Webhooks Demopaneel (Slide 5: Punkt 3)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Webhookid võimaldavad serveril automaatselt reageerida maksete toimumisele või tühistamisele.
              Klikka allolevat nuppu, et saata testpäring otse <code>/api/stripe/webhook</code> otspunktile.
            </p>
          </div>

          <button
            onClick={handleSimulateWebhook}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-medium transition-colors flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Saada Stripe Webhook Päring</span>
          </button>
        </div>

        {webhookMessage && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
            {webhookMessage}
          </div>
        )}
      </div>
    </div>
  );
}
