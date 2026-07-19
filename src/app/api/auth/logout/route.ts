import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
