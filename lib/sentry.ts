// Sentry error monitoring utility (Slide 7: Seire ja monitooring)

export function captureException(error: any, contextInfo?: Record<string, any>) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  console.group('🛡️ [Sentry Monitoring Event]');
  console.error('Error Captured:', error);
  if (contextInfo) {
    console.info('Context / Tags:', contextInfo);
  }
  console.groupEnd();

  if (dsn && typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error);
  }
}

export function logResponseMetric(endpoint: string, durationMs: number) {
  const status = durationMs < 200 ? '🟢 Normal (<200ms)' : '🟡 Slow (>200ms)';
  console.log(`⏱️ [Latency Monitor] ${endpoint}: ${durationMs}ms - ${status}`);
}
