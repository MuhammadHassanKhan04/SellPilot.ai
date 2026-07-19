'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.'); return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      router.refresh();
      window.location.href = callbackUrl; // redirect
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, width: '100%', padding: '36px 28px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="SellPilot.ai Logo"
          style={{ height: 48, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }}
        />
        <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: 'var(--text-1)' }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
          Log in to manage your e-commerce seller pilot tool.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 18, fontSize: 13 }}>
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            required
            className="form-input"
            placeholder="name@domain.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            required
            className="form-input"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary btn-lg${loading ? ' btn-loading' : ''}`}
          style={{ width: '100%', marginTop: 8 }}
        >
          {loading ? '' : '🔑 Sign In'}
        </button>
      </form>

      <div style={{
        textAlign: 'center', marginTop: 24,
        fontSize: 13, color: 'var(--text-3)',
      }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--brand-light)', fontWeight: 600 }}>
          Sign Up Free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: 24,
    }}>
      <Suspense fallback={
        <div className="card" style={{ maxWidth: 420, width: '100%', padding: '36px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, opacity: 0.4 }}>⏳</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 8 }}>Loading session details…</div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
