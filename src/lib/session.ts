import crypto from 'crypto';
import { cookies } from 'next/headers';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || 'sellpilot-fallback-secret-key-2026').digest();
// 16 bytes IV
const IV = Buffer.alloc(16, 0); // stable static IV for simplicity of session cookies

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: number;
}

/**
 * Encrypt a session payload to an encrypted token string.
 */
export function encryptSession(payload: SessionPayload): string {
  const text = JSON.stringify(payload);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypt an encrypted token string back to the session payload.
 */
export function decryptSession(token: string): SessionPayload | null {
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
    let decrypted = decipher.update(token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const payload = JSON.parse(decrypted) as SessionPayload;
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session user info from cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sellpilot_session')?.value;
    if (!token) return null;
    return decryptSession(token);
  } catch {
    return null;
  }
}

/**
 * Save session to cookies.
 */
export async function setSession(userId: string, email: string) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = encryptSession({ userId, email, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set('sellpilot_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });
}

/**
 * Clear session cookie.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('sellpilot_session');
}
