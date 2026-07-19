'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter all required fields.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      router.refresh();
      window.location.href = '/dashboard'; // redirect to tool
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '85vh', padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', padding: '36px 28px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="SellPilot.ai Logo"
            style={{ height: 48, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }}
          />
          <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: 'var(--text-1)' }}>
            Create Account
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
            Get started with SellPilot.ai and optimize your listings today.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 18, fontSize: 13 }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Farhan Khan"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="name@domain.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="form-row cols-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••"
                value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary btn-lg${loading ? ' btn-loading' : ''}`}
            style={{ width: '100%', marginTop: 12 }}
          >
            {loading ? '' : '✨ Create Free Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: 24,
          fontSize: 13, color: 'var(--text-3)',
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand-light)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
