import { NextResponse } from 'next/server';

// In-memory demo data with multi-tenancy separation
const DB_TASKS = [
  { id: '1', tenantId: 'tenant-baltic-tech', title: 'Ühenda Stripe Webhook', status: 'in_progress' },
  { id: '2', tenantId: 'tenant-baltic-tech', title: 'Seadista Sentry monitooring', status: 'done' },
  { id: '3', tenantId: 'tenant-tallinn-cafe', title: 'Osta kohvioad Brasiiliast', status: 'todo' },
  { id: '4', tenantId: 'tenant-nordic-saas', title: 'Treeni LLaMA mudelit', status: 'in_progress' },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId');

  if (!tenantId) {
    return NextResponse.json(
      {
        error: 'Multi-tenancy error: Missing tenant identification (x-tenant-id header or query param).',
        hint: 'In multi-tenant SaaS, every client request MUST be scoped to a tenant_id.',
      },
      { status: 400 }
    );
  }

  // Strictly filter records belonging only to this tenant!
  const tenantData = DB_TASKS.filter((task) => task.tenantId === tenantId);

  return NextResponse.json({
    tenantId,
    isolationType: 'Logical Row-Level Multi-Tenancy',
    totalRecordsForTenant: tenantData.length,
    data: tenantData,
  });
}
