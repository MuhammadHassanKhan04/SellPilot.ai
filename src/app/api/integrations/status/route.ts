import { NextResponse } from 'next/server';
import { integrationDb } from '@/lib/db';

export async function GET() {
  try {
    const etsy = integrationDb.findByPlatform('etsy');
    const amazon = integrationDb.findByPlatform('amazon');
    const gemini = integrationDb.findByPlatform('gemini');
    return NextResponse.json({
      etsy: !!(etsy?.isConnected),
      amazon: !!(amazon?.isConnected),
      gemini: !!(gemini?.isConnected || process.env.GEMINI_API_KEY),
    });
  } catch {
    return NextResponse.json({ etsy: false, amazon: false, gemini: false });
  }
}
