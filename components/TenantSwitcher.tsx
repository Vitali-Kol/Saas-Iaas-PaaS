'use client';

import React, { useState } from 'react';
import { useSaas } from '@/lib/store';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';

export default function TenantSwitcher() {
  const { tenants, currentTenant, setCurrentTenantId, addTenant } = useSaas();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    addTenant(newTenantName.trim());
    setNewTenantName('');
    setIsAdding(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all text-sm font-medium text-slate-200"
      >
        <Building2 className="w-4 h-4 text-indigo-400" />
        <span className="max-w-[140px] truncate">{currentTenant.name}</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
            currentTenant.plan === 'enterprise'
              ? 'bg-purple-900/60 text-purple-300 border border-purple-600/50'
              : currentTenant.plan === 'pro'
              ? 'bg-blue-900/60 text-blue-300 border border-blue-600/50'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {currentTenant.plan}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-2 text-slate-200">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Multi-tenancy: Vali Tenant
            </div>

            <div className="space-y-1">
              {tenants.map((t) => {
                const isSelected = t.id === currentTenant.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTenantId(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-sm transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-[11px] text-slate-400">ID: {t.id}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 ml-2 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 mt-2 border-t border-slate-800">
              {isAdding ? (
                <form onSubmit={handleCreate} className="p-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Uue ettevõtte nimi..."
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <div className="flex gap-1 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-2 py-1 text-xs rounded text-slate-400 hover:text-white"
                    >
                      Loobu
                    </button>
                    <button
                      type="submit"
                      className="px-2 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      Lisa Tenant
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-indigo-400 hover:bg-indigo-950/40 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Loo uus organisatsioon</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
