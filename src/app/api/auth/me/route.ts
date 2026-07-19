import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { userDb } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = userDb.findById(session.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
