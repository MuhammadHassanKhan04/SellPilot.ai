import { NextResponse } from 'next/server';
import { integrationDb } from '@/lib/db';

export async function DELETE() {
  try {
    integrationDb.disconnect('amazon');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
