'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSaas } from '@/lib/store';
import TenantSwitcher from './TenantSwitcher';
import { Cloud, Shield, LogOut, Github, Chrome, CheckCircle2, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    loginAs,
    logout,
    currentTenant,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
  } = useSaas();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authMode === 'signup') {
        const { error, user } = await signUpWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Konto edukalt loodud Supabase baasis! Võid nüüd sisse logida.');
          setAuthMode('signin');
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setShowAuthModal(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Autentimise viga');
    } finally {
      setLoading(false);
    }
  };

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
                    <span className="truncate max-w-[130px]">Supabase: {currentUser.email}</span>
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

      {/* Real Supabase Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Supabase Auth (Slide 6 & 8)
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {authMode === 'signin' ? 'Logi sisse süsteemi' : 'Loo uus kasutajakonto'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Kasutajad ja sessioonid salvestatakse otse Supabase <code>auth.users</code> pilvebaasi.
            </p>

            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-800 p-1 mb-4">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Logi sisse (Sign In)
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Registreeru (Sign Up)
              </button>
            </div>

            {/* Error or Success message */}
            {errorMsg && (
              <div className="mb-4 p-2.5 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-2.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="õppur@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Parool</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Vähemalt 6 tähemärki"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {authMode === 'signin' ? 'Logi sisse Supabase kaudu' : 'Loo konto Supabase baasi'}
                </span>
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-900 px-2 text-slate-500">või kasuta OAuth 2.0</span>
              </div>
            </div>

            {/* Social OAuth */}
            <div className="space-y-2">
              <button
                onClick={() => signInWithOAuth('google')}
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-2 px-3 rounded-xl text-xs transition-all shadow"
              >
                <Chrome className="w-4 h-4 text-red-500" />
                <span>Google OAuth 2.0</span>
              </button>

              <button
                onClick={() => signInWithOAuth('github')}
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-all border border-slate-700"
              >
                <Github className="w-4 h-4" />
                <span>GitHub OAuth 2.0</span>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500">
                🔒 Supabase Authentication Dashboard: <br />
                Vaata registreeritud kasutajaid Supabase menüüs <strong>Authentication → Users</strong>
              </p>
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
