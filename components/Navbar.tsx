'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSaas } from '@/lib/store';
import TenantSwitcher from './TenantSwitcher';
import AuthModal from './AuthModal';
import {
  Cloud,
  Shield,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useSaas();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
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

            {/* Navigation Links */}
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

            {/* User Auth Section (Slide 6: Supabase Auth / OAuth 2.0) */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full bg-slate-700 border border-indigo-500/50"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[140px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="truncate max-w-[130px]">{currentUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
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
                  <span>Supabase Auth / OAuth</span>
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
      </nav>

      {/* Render AuthModal via React Portal directly into body */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
