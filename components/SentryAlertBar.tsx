'use client';

import React, { useState } from 'react';
import { useSaas } from '@/lib/store';
import { Activity, AlertTriangle, Bug, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';

export default function SentryAlertBar() {
  const { sentryErrors, triggerSentryTestError } = useSaas();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-950/80 border-b border-slate-800 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200">Süsteem: Töökorras (99.95% Uptime)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Response: <strong className="text-cyan-300">42ms</strong> (&lt;200ms nõue)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Monitooring: Sentry / Better Stack</span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerSentryTestError}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors font-medium text-[11px]"
            title="Slide 7 nõue: Vigade kinnipüüdmine ja Sentry stack trace testimine"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Käivita Sentry Test Error</span>
          </button>

          {sentryErrors.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{sentryErrors.length} viga püüti kinni</span>
              {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Errors Tray */}
      {isOpen && sentryErrors.length > 0 && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800">
          <div className="bg-slate-900 rounded p-3 text-[11px] font-mono text-rose-300 space-y-1.5 max-h-32 overflow-y-auto">
            <div className="text-slate-400 font-sans font-semibold mb-1">
              Sentry Error Stream (Reaalajas logi):
            </div>
            {sentryErrors.map((err, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 select-none">›</span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
