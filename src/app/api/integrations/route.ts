import { NextResponse } from 'next/server';
import { integrationDb } from '@/lib/db';

export async function GET() {
  try {
    const integrations = integrationDb.findAll();
    return NextResponse.json(integrations);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
