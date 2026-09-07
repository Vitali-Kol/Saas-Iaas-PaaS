'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSaas } from '@/lib/store';
import {
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Chrome,
  Github,
  CreditCard,
  Check,
  ArrowRight,
  LogOut,
  Building2,
  Sparkles,
} from 'lucide-react';
import { TenantPlan } from '@/lib/types';

function CleanSaaS() {
  const {
    currentUser,
    currentTenant,
    setCurrentTenantId,
    tenants,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    logout,
    upgradePlan,
  } = useSaas();

  // Auth form state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Stripe checkout state
  const [checkoutLoading, setCheckoutLoading] = useState<TenantPlan | null>(null);

  // Check URL params for Stripe return
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const upgradedPlan = searchParams.get('plan');

  useEffect(() => {
    if (paymentStatus === 'success' && upgradedPlan) {
      upgradePlan(upgradedPlan as any);
    }
  }, [paymentStatus, upgradedPlan]);

  // Handle email auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setAuthError(error.message);
        } else {
          // Attempt auto sign-in
          const autoIn = await signInWithEmail(email, password);
          if (autoIn.error) {
            setAuthSuccess('✅ Konto edukalt loodud! Võid nüüd sisse logida.');
            setAuthMode('signin');
          }
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setAuthError(error.message);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Viga autentimisel');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Stripe Checkout
  const handleCheckout = async (plan: TenantPlan) => {
    setCheckoutLoading(plan);
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
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert('Viga Stripe makse algatamisel: ' + err.message);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const plans = [
    {
      id: 'free' as TenantPlan,
      name: 'Free (Tasuta)',
      price: '0 €',
      period: 'kuus',
      desc: 'Baasfunktsioonid katsetamiseks',
      features: ['Kuni 3 projekti', '1 kasutaja', 'Multi-tenant andmete eraldatus'],
      cta: 'Praegune plaan',
      highlight: false,
    },
    {
      id: 'pro' as TenantPlan,
      name: 'Pro (Populaarne)',
      price: '29 €',
      period: 'kuus',
      desc: 'Täielik ligipääs ja piiramatu maht',
      features: [
        'Piiramatu arv projekte',
        'Stripe Customer Portal',
        'Sentry veamonitooring',
        'Prioriteetne tugi',
      ],
      cta: 'Telli Pro (Stripe Checkout)',
      highlight: true,
    },
    {
      id: 'enterprise' as TenantPlan,
      name: 'Enterprise',
      price: '99 €',
      period: 'kuus',
      desc: 'Suurtele ettevõtetele ja tiimidele',
      features: [
        'Kõik Pro funktsioonid',
        'Pühendatud andmebaas',
        '24/7 telefonitugi',
        'Kohandatud arveldus',
      ],
      cta: 'Telli Enterprise',
      highlight: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Stripe Payment Success Banner */}
      {paymentStatus === 'success' && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500/50 text-emerald-200 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-sm sm:text-base">
                Makse edukalt sooritatud! (Stripe Verified ✓)
              </div>
              <div className="text-xs text-emerald-300">
                Sinu pakett on edukalt uuendatud <strong>{upgradedPlan?.toUpperCase()}</strong> tasemele.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Aktiivne
          </span>
        </div>
      )}

      {/* TOP BAR: Tenant Selector & User Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8">
        {/* Multi-tenancy selector */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-400">Ettevõte:</span>
          <select
            value={currentTenant.id}
            onChange={(e) => setCurrentTenantId(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:border-indigo-500"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.plan.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* User state */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300">
                Logitud sisse: <strong className="text-white font-mono">{currentUser.email}</strong>
              </span>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logi välja</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Pole sisse logitud</span>
          )}
        </div>
      </div>

      {/* IF NOT LOGGED IN: SIMPLE CLEAN AUTHENTICATION CARD */}
      {!currentUser ? (
        <div className="max-w-md mx-auto my-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                Supabase Autentimine
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">
                {authMode === 'signin' ? 'Logi sisse' : 'Loo uus konto'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Juurdepääs SaaS platvormile ja tellimustele
              </p>
            </div>

            {/* Sign in / Sign up tabs */}
            <div className="flex rounded-xl bg-slate-800/80 p-1 mb-5 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Logi sisse
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Registreeru
              </button>
            </div>

            {/* Alerts */}
            {authError && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="näiteks: oppur@ivkhk.ee"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Parool</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Vähemalt 6 sümbolit"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-2"
              >
                {authLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {authMode === 'signin' ? 'Logi sisse Supabase kaudu' : 'Loo konto (Registreeru)'}
                </span>
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-mono">või kasuta OAuth 2.0</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => signInWithOAuth('google')}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-medium py-2.5 px-3 rounded-xl text-xs transition-all shadow"
              >
                <Chrome className="w-3.5 h-3.5 text-red-500" />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => signInWithOAuth('github')}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-3 rounded-xl text-xs transition-all border border-slate-700"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* IF LOGGED IN: SIMPLE CLEAN SUBSCRIPTION PURCHASING SECTION */
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Vali sobiv tellimus
            </h1>
            <p className="text-sm text-slate-400">
              Praegune ettevõte: <strong className="text-indigo-300">{currentTenant.name}</strong> • Hetke plaan:{' '}
              <strong className="text-white uppercase">{currentTenant.plan}</strong>
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((p) => {
              const isCurrent = currentTenant.plan === p.id;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                    p.highlight
                      ? 'bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:scale-105'
                      : 'bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  <div>
                    {p.highlight && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3 h-3" />
                        Soovitatav
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">{p.desc}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        {p.price}
                      </span>
                      <span className="text-xs text-slate-400">/ {p.period}</span>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-800 mb-6">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-slate-800 text-slate-400 border border-slate-700 cursor-default">
                        ✓ Hetkel aktiivne
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckout(p.id)}
                        disabled={checkoutLoading !== null}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all shadow ${
                          p.highlight
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>
                          {checkoutLoading === p.id ? 'Avame Stripe...' : p.cta}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Laadin...</div>}>
      <CleanSaaS />
    </Suspense>
  );
}
