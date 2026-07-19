export default function SettingsPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>⚙️ Settings</h1>
          <p className="page-subtitle">App preferences and configuration</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">🤖 About SellPillot.ai</div>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>
            SellPillot.ai is your all-in-one AI-powered e-commerce product listing tool.
            Connect your Etsy and Amazon seller accounts, enter your raw product details,
            and let AI craft optimized, SEO-rich listings instantly. Publish to both platforms in a single click.
          </p>
          <hr className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Version', value: '1.0.0' },
              { label: 'Framework', value: 'Next.js 16' },
              { label: 'AI Engine', value: 'Gemini 1.5' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: 'var(--brand-light)' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">📚 Getting Started Guide</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '1️⃣', title: 'Connect Your Accounts', desc: 'Go to Integrations and add your Etsy API keys and Amazon SP-API credentials.' },
              { icon: '2️⃣', title: 'Add Your Gemini API Key', desc: 'In Integrations > AI Configuration, add your Google Gemini API key.' },
              { icon: '3️⃣', title: 'Create a Listing', desc: 'Click "Create Listing", describe your product in plain language, and let AI optimize it.' },
              { icon: '4️⃣', title: 'Publish', desc: 'Review the AI-generated listing, select platforms, and hit Publish.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
