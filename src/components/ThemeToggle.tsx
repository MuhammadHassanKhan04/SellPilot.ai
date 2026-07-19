'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Determine initial theme on client load
    const isLight = document.documentElement.classList.contains('light-theme');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('sellpilot-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('sellpilot-theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm"
      style={{
        width: 38,
        height: 38,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--r-full)',
        fontSize: 18,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-1)',
        transition: 'all var(--t-fast)',
      }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
      type="button"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
