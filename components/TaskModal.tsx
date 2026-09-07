'use client';

import React, { useState } from 'react';
import { useSaas } from '@/lib/store';
import { PlusCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { addTask, currentTenant, tasks } = useSaas();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!isOpen) return null;

  const isFreePlanLimitReached = currentTenant.plan === 'free' && tasks.length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), description.trim(), priority);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <h3 className="text-lg font-bold text-white mb-1">Lisa uus ülesanne (Task)</h3>
        <p className="text-xs text-slate-400 mb-4">
          Organisatsioon:{' '}
          <strong className="text-indigo-300 font-mono">{currentTenant.name}</strong> (Tenant ID:{' '}
          <code className="text-slate-300">{currentTenant.id}</code>)
        </p>

        {isFreePlanLimitReached ? (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 text-xs text-amber-200 space-y-3 mb-4">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Tasuta plaani limiit täis (3/3 ülesannet)</span>
            </div>
            <p>
              Vastavalt SaaS ärimudelile (Slide 5: Freemium & Tiered Pricing) on piiramatu arvu
              ülesannete jaoks vaja uuendada Pro plaanile.
            </p>
            <Link
              href="/pricing"
              onClick={onClose}
              className="inline-block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors shadow"
            >
              Uuenda Pro plaanile (Stripe) →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pealkiri</label>
              <input
                type="text"
                required
                placeholder="nt. Seadista CI/CD GitHub Actions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kirjeldus</label>
              <textarea
                rows={3}
                placeholder="Ülesande detailid ja meeskonnaliikme roll..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Prioriteet</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Madal (Low)</option>
                <option value="medium">Keskmine (Medium)</option>
                <option value="high">Kõrge (High)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white"
              >
                Loobu
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-lg shadow-indigo-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Salvesta ülesanne</span>
              </button>
            </div>
          </form>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
