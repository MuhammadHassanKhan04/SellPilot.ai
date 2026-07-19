import { NextResponse } from 'next/server';
import { userDb } from '@/lib/db';
import { setSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // Check if email already registered
    const existing = userDb.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered. Please login.' }, { status: 400 });
    }

    // Create user
    const user = userDb.create({ name, email, passwordRaw: password });

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
