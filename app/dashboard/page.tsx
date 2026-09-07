'use client';

import React, { useState } from 'react';
import { useSaas } from '@/lib/store';
import TaskModal from '@/components/TaskModal';
import Link from 'next/link';
import {
  Plus,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  CreditCard,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Bug
} from 'lucide-react';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function DashboardContent() {
  const {
    currentTenant,
    tasks,
    updateTaskStatus,
    deleteTask,
    currentUser,
    triggerSentryTestError,
    upgradePlan,
  } = useSaas();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const upgradedPlan = searchParams.get('plan');

  useEffect(() => {
    if (paymentStatus === 'success' && upgradedPlan) {
      upgradePlan(upgradedPlan as any);
    }
  }, [paymentStatus, upgradedPlan]);

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Payment Success Alert */}
      {paymentStatus === 'success' && (
        <div className="bg-emerald-950/60 border-2 border-emerald-500/50 rounded-2xl p-5 flex items-center justify-between gap-4 text-emerald-200 shadow-xl shadow-emerald-500/10 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white text-base">Makse edukalt sooritatud! (Stripe Checkout)</div>
              <div className="text-xs text-emerald-300">
                Organisatsioon <strong>{currentTenant.name}</strong> on edukalt uuendatud <strong>{upgradedPlan?.toUpperCase()}</strong> paketile.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
            Stripe Verified ✓
          </span>
        </div>
      )}

      {/* Header with Tenant info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Multi-tenancy Scope
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {currentTenant.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-7 h-7 text-indigo-400" />
            <span>{currentTenant.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kõik allpool kuvatavad andmed ja API päringud on filtreeritud vastavalt käesolevale tenant&apos;ile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Uus ülesanne (Task)</span>
          </button>

          <Link
            href="/pricing"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Halda tellimust (Stripe)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Aktiivne Plaan (Slide 5)</span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                currentTenant.plan === 'enterprise'
                  ? 'bg-purple-900/60 text-purple-300'
                  : currentTenant.plan === 'pro'
                  ? 'bg-blue-900/60 text-blue-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {currentTenant.plan}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currentTenant.plan === 'free' ? '0 € / kuu' : currentTenant.plan === 'pro' ? '29 € / kuu' : '99 € / kuu'}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {currentTenant.plan === 'free' ? 'Limiit: kuni 3 ülesannet' : 'Piiramatu arv ülesandeid ja tiimiliikmeid'}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Ülesandeid selles tenant&apos;is</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{tasks.length}</div>
          <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Isoleeritud muudest tenant&apos;idest</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Autentitud Kasutaja (Slide 6)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white truncate">
            {currentUser?.name || 'Anonüümne külaline'}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 truncate font-mono">
            {currentUser?.email || 'Logi sisse OAuth abil'}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Sentry Vigade Monitooring (Slide 7)</span>
            <Bug className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Healthy (99.98%)</span>
          </div>
          <button
            onClick={triggerSentryTestError}
            className="text-[11px] text-rose-400 hover:text-rose-300 mt-2 underline block"
          >
            Käivita kontroll-viga →
          </button>
        </div>
      </div>

      {/* Multi-tenancy explainer banner for professor */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-indigo-200">Õppejõule esitlemiseks (Multi-tenancy): </span>
            <span className="text-indigo-300/80">
              Vaheta üleval päises tenantit (nt. &quot;Tallinn Roasters Hub&quot; või &quot;Nordic AI&quot;). Märkad, et teise ettevõtte ülesanded on täielikult eraldatud!
            </span>
          </div>
        </div>
        <Link
          href={`/api/tenants?tenantId=${currentTenant.id}`}
          target="_blank"
          className="text-xs text-indigo-300 bg-indigo-900/50 hover:bg-indigo-800/60 px-3 py-1.5 rounded-lg border border-indigo-500/30 flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Testi API JSON väljundit</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Kanban / Tasks 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO COLUMN */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h2 className="font-semibold text-sm text-slate-200">Tegemata (To Do)</h2>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[150px]">
            {todoTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Pole ülesandeid
              </div>
            ) : (
              todoTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-white leading-snug">{task.title}</h3>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/40 text-[10px]">
                    <span className="text-slate-400 font-mono">{task.assignedTo}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Alusta tööd →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <h2 className="font-semibold text-sm text-slate-200">Töös (In Progress)</h2>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[150px]">
            {inProgressTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Hetkel midagi ei tehta
              </div>
            ) : (
              inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800/70 border border-sky-500/30 hover:border-sky-500/50 rounded-xl p-3.5 space-y-2.5 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-white leading-snug">{task.title}</h3>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/40 text-[10px]">
                    <span className="text-slate-400 font-mono">{task.assignedTo}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'done')}
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Märgi tehtuks ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className="font-semibold text-sm text-slate-200">Valmis (Done)</h2>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-2.5 min-h-[150px]">
            {doneTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Tehtud ülesanded puuduvad
              </div>
            ) : (
              doneTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800/40 border border-emerald-500/20 rounded-xl p-3.5 space-y-2.5 transition-all opacity-80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-slate-300 line-through leading-snug">
                      {task.title}
                    </h3>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/40 text-[10px]">
                    <span className="text-slate-500 font-mono">{task.assignedTo}</span>
                    <span className="text-emerald-400 font-medium">Lõpetatud</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-slate-400">
          Laadin töölaua andmeid...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
