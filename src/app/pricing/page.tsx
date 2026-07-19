import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for small sellers starting their e-commerce journey.',
      features: [
        'Optimize up to 15 listings / month',
        'Connect 1 Etsy Shop',
        'Basic AI Title & Description generation',
        'Standard Image Uploads (up to 3 / product)',
        'Local SQLite Database Storage',
      ],
      btn: 'Get Started Free',
      href: '/signup',
      highlight: false,
    },
    {
      name: 'Growth Pilot',
      price: '$29',
      period: 'per month',
      desc: 'For active merchants looking to expand and automate scaling.',
      features: [
        'Unlimited AI Listing Optimizations',
        'Connect 3 Etsy Shops + 1 Amazon Store',
        'Advanced Gemini 2.0-Flash SEO Engine',
        'Full Image Uploads (up to 8 / product)',
        'SKU Tracking & Custom Bullet Points',
        'Priority Platform API Sync Support',
      ],
      btn: 'Start 14-Day Trial',
      href: '/signup',
      highlight: true,
    },
    {
      name: 'Professional Scale',
      price: '$79',
      period: 'per month',
      desc: 'For power sellers and agencies managing multiple listings.',
      features: [
        'Everything in Growth Pilot',
        'Unlimited Etsy & Amazon Shop Integrations',
        'Custom AI Optimization Prompts & Templates',
        'Team Member Accounts (up to 5 users)',
        'Dedicated API Support Channels',
        'CSV Batch Import & Export Tool',
      ],
      btn: 'Contact Sales',
      href: '/contact',
      highlight: false,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>
      
      {/* ── HEADER ─────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(32px, 5vw, 54px)',
          fontWeight: 900,
          color: 'var(--text-1)',
          marginBottom: 16,
          letterSpacing: '-1px',
        }}>
          Simple, Transparent Plans
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16.5, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Choose the right plan to accelerate your listing workflow. Save time and boost organic traffic.
        </p>
      </div>

      {/* ── PRICING GRID ────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
        alignItems: 'start',
      }}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${tier.highlight ? 'var(--brand)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--r-2xl)',
              padding: 32,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: tier.highlight ? 'var(--shadow-brand)' : 'none',
              transform: tier.highlight ? 'scale(1.02)' : 'none',
              zIndex: tier.highlight ? 10 : 1,
            }}
          >
            {/* Top highlight ribbon */}
            {tier.highlight && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'var(--grad-brand)', color: 'white',
                fontSize: 10, fontWeight: 700, padding: '4px 10px',
                borderRadius: 'var(--r-full)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                MOST POPULAR
              </div>
            )}

            <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>
              {tier.name}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24, minHeight: 40, lineHeight: 1.5 }}>
              {tier.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 28 }}>
              <span style={{ fontFamily: 'Outfit', fontSize: 44, fontWeight: 900, color: 'var(--text-1)' }}>
                {tier.price}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
                / {tier.period}
              </span>
            </div>

            <Link
              href={tier.href}
              className={`btn ${tier.highlight ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', marginBottom: 28, padding: '12px' }}
            >
              {tier.btn}
            </Link>

            <hr className="divider" style={{ margin: '20px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Features included:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tier.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.4 }}>
                    <span style={{ color: tier.highlight ? 'var(--brand-light)' : 'var(--ai)', fontWeight: 700 }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
