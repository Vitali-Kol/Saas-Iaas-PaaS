import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const team = process.env.TEAM_NAME || 'Tundmatu tiim (Viga!)';

  return NextResponse.json({
    meeskond: team,
    status: team === 'Tundmatu tiim (Viga!)' ? 'viga' : 'ok',
    timestamp: new Date().toISOString()
  });
}
