'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSaas } from '@/lib/store';
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Chrome,
  Github,
  Sparkles,
  X,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    loginAs,
  } = useSaas();

  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authMode === 'signup') {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          // Auto-signin attempt
          const autoLogin = await signInWithEmail(email, password);
          if (!autoLogin.error) {
            onClose();
          } else {
            setSuccessMsg('✅ Konto loodud! Võid nüüd sisse logida.');
            setAuthMode('signin');
          }
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Autentimise viga');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (provider: 'google' | 'github') => {
    loginAs(provider);
    onClose();
  };

  // createPortal renders directly into document.body, bypassing any parent backdrop-filter or sticky styling!
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge & Title */}
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Supabase Auth (Slide 6 & 8)
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5">
            {authMode === 'signin' ? 'Logi sisse' : 'Registreeru'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kasutajad salvestatakse Supabase <code>auth.users</code> baasi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-800/90 p-1 mb-4 border border-slate-700">
          <button
            type="button"
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
            Logi sisse
          </button>
          <button
            type="button"
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
            Registreeru
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-3 p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="oppur@ivkhk.ee"
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
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-1"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {authMode === 'signin' ? 'Logi sisse Supabase kaudu' : 'Loo konto Supabase baasi'}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-900 px-2 text-slate-500 font-mono">või OAuth 2.0</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => signInWithOAuth('google')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-medium py-2 px-3 rounded-xl text-xs transition-all shadow"
          >
            <Chrome className="w-3.5 h-3.5 text-red-500" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => signInWithOAuth('github')}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-3 rounded-xl text-xs transition-all border border-slate-700"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Quick Demo Login Option */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Kiirtest:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('google')}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-3 h-3" />
            <span>Demo-sisselogimine (1-klikk)</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
