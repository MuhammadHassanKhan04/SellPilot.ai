'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface ConnectionStatus { etsy: boolean; amazon: boolean; }

const NAV = [
  {
    group: 'Overview',
    items: [
      { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    ],
  },
  {
    group: 'Products',
    items: [
      { href: '/products', icon: '📦', label: 'My Products' },
      { href: '/create',   icon: '✨', label: 'Create Listing' },
      { href: '/publish',  icon: '🚀', label: 'Publish Center' },
    ],
  },
  {
    group: 'Settings',
    items: [
      { href: '/integrations', icon: '🔌', label: 'Integrations' },
      { href: '/settings',     icon: '⚙️', label: 'Settings' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<ConnectionStatus>({ etsy: false, amazon: false });

  useEffect(() => {
    fetch('/api/integrations/status')
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.refresh();
        window.location.href = '/login';
      }
    } catch {}
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link href="/dashboard" className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="SellPilot.ai Logo"
          style={{ height: 38, objectFit: 'contain', display: 'block' }}
        />
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <div className="nav-group-label">{group}</div>
            {items.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-item${pathname === href ? ' active' : ''}`}
              >
                <div className="nav-item-icon">{icon}</div>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Connection Status & Logout Footer */}
      <div className="sidebar-footer">
        <div className={`connection-chip etsy-chip`}>
          <div className={`chip-dot ${status.etsy ? 'on' : 'off'}`} />
          <span className="chip-label" style={{ color: '#f1641e', fontWeight: 600, fontSize: 12 }}>Etsy</span>
          <span className="chip-status">{status.etsy ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className={`connection-chip amazon-chip`}>
          <div className={`chip-dot ${status.amazon ? 'on' : 'off'}`} />
          <span className="chip-label" style={{ color: '#ff9900', fontWeight: 600, fontSize: 12 }}>Amazon</span>
          <span className="chip-status">{status.amazon ? 'Connected' : 'Disconnected'}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ flex: 1, marginTop: 0 }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

