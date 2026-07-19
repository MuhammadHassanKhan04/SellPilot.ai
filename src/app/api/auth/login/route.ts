import { NextResponse } from 'next/server';
import { userDb } from '@/lib/db';
import { setSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = userDb.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify password hash
    const inputHash = userDb.hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Set cookie session
    await setSession(user.id, user.email);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
