'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSaas } from '@/lib/store';
import TenantSwitcher from './TenantSwitcher';
import { Cloud, Sparkles, Shield, LogOut, Github, Chrome, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const { currentUser, loginAs, logout, currentTenant } = useSaas();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Multi-tenant switcher */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                  CloudFlow <span className="text-xs text-indigo-400 font-mono">SaaS</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-mono">Multi-Tenant Platform</span>
              </div>
            </Link>

            <div className="hidden md:block h-6 w-px bg-slate-800" />
            <div className="hidden md:block">
              <TenantSwitcher />
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
              Töölaud (Dashboard)
            </Link>
            <Link href="/pricing" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <span>Hinnakiri (Stripe)</span>
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded border border-indigo-500/20">
                Stripe
              </span>
            </Link>
            <Link href="/#requirements" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hinne &quot;A&quot; Nõuded</span>
            </Link>
          </div>

          {/* User Auth Section (Slide 6: OAuth 2.0 / Clerk / Supabase) */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full bg-slate-700 border border-indigo-500/50"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    OAuth: {currentUser.provider}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Logi välja"
                  className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-400 transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
              >
                <Shield className="w-4 h-4" />
                <span>Logi sisse (OAuth)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile tenant switcher bar */}
      <div className="md:hidden border-t border-slate-800 px-4 py-2 bg-slate-950/50 flex justify-between items-center">
        <TenantSwitcher />
        <Link href="/pricing" className="text-xs text-indigo-400">
          Stripe Hinnad →
        </Link>
      </div>

      {/* Auth Modal for Slide 6 Demo */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Kasutaja Autentimine (Slide 6)</h3>
            <p className="text-xs text-slate-400 mb-6">
              Vastavalt projekti nõuetele kasutatakse OAuth 2.0 / OpenID Connect protokolli ilma kohalike paroolideta.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  loginAs('google');
                  setShowAuthModal(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-all shadow"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span>Jätka Google kontoga</span>
              </button>

              <button
                onClick={() => {
                  loginAs('github');
                  setShowAuthModal(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all border border-slate-700"
              >
                <Github className="w-5 h-5" />
                <span>Jätka GitHub kontoga</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500">
                Toetab: Supabase Auth / Clerk / NextAuth.js
              </span>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
