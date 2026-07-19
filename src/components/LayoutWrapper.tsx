'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Paths that require the dashboard tool layout (sidebar)
  const isToolPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/publish') ||
    pathname.startsWith('/integrations') ||
    pathname.startsWith('/settings');

  if (isToolPath) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    );
  }

  // Public Landing Website Layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Public Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7, 7, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        {/* Logo (only image, no text name next to it) */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="SellPilot.ai Logo"
            style={{ height: 32, objectFit: 'contain', display: 'block' }}
          />
        </Link>

        {/* Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="public-nav">
          <Link href="/" className={pathname === '/' ? 'active-link' : 'inactive-link'}>Home</Link>
          <Link href="/features" className={pathname === '/features' ? 'active-link' : 'inactive-link'}>Features</Link>
          <Link href="/pricing" className={pathname === '/pricing' ? 'active-link' : 'inactive-link'}>Pricing</Link>
          <Link href="/contact" className={pathname === '/contact' ? 'active-link' : 'inactive-link'}>Contact</Link>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </header>

      {/* Public Pages Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Public Footer */}
      <footer style={{
        background: 'rgba(5, 5, 20, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 24px 24px',
        color: 'var(--text-2)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32, marginBottom: 36,
        }}>
          {/* Logo Column */}
          <div>
            <div style={{ marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="SellPilot.ai Logo"
                style={{ height: 32, objectFit: 'contain', display: 'block' }}
              />
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.6 }}>
              AI-powered product listings builder and automated one-click publisher for Amazon and Etsy.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
              <Link href="/features" style={{ color: 'inherit' }}>Features</Link>
              <Link href="/pricing" style={{ color: 'inherit' }}>Pricing Plans</Link>
              <Link href="/login" style={{ color: 'inherit' }}>Sign In</Link>
              <Link href="/signup" style={{ color: 'inherit' }}>Register</Link>
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h4 style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
              <Link href="/contact" style={{ color: 'inherit' }}>Contact Support</Link>
              <Link href="#" style={{ color: 'inherit' }}>Terms of Service</Link>
              <Link href="#" style={{ color: 'inherit' }}>Privacy Policy</Link>
              <Link href="#" style={{ color: 'inherit' }}>Developer API</Link>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: 1200, margin: '0 auto',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 24, textAlign: 'center',
          fontSize: 12.5, color: 'var(--text-3)',
        }}>
          &copy; {new Date().getFullYear()} SellPilot.ai. All rights reserved. Made for professional sellers.
        </div>
      </footer>

      {/* Styled utilities for public navigation links */}
      <style jsx global>{`
        .public-nav a {
          color: var(--text-2);
          font-size: 14px;
          font-weight: 500;
          transition: color var(--t-fast);
        }
        .public-nav a:hover,
        .public-nav a.active-link {
          color: var(--brand-light);
        }
        @media (max-width: 768px) {
          .public-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
