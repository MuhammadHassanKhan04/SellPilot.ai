import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function FeaturesPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>
      
      {/* ── HEADER SECTION ─────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(32px, 5vw, 54px)',
          fontWeight: 900,
          color: 'var(--text-1)',
          marginBottom: 16,
          letterSpacing: '-1px',
        }}>
          Automated Listing Features
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16.5, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Everything you need to list products to Etsy &amp; Amazon 10x faster. Eliminate manual copy-pasting.
        </p>
      </div>

      {/* ── FEATURE DEEP DIVE SECTIONS (4-5 Sections) ───── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Section 1: AI Listings Generator */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-2xl)', padding: 32
        }} className="feature-grid-row">
          <div>
            <span style={{ fontSize: 32 }}>🤖</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: 'var(--text-1)', margin: '12px 0' }}>
              Advanced AI Optimization Engine
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 18 }}>
              Powered by Google Gemini models, the optimizer parses your raw description and extracts crucial details. It structures listings with rich details, generates up to 13 relevant SEO tags, and assigns appropriate category classification dynamically.
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 13.5, color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Automatic high-converting bullet point list builder</li>
              <li>Region and language matching rules</li>
              <li>Real-time listing SEO health scores</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--r-xl)', padding: 24, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--ai)', fontSize: 13, marginBottom: 12 }}>PROMPT GENERATOR SYSTEM</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--text-2)' }}>
              <div style={{ padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 6 }}>
                💡 <strong>Analyze:</strong> &ldquo;Slim canvas tote bag, organic cotton, yellow colour, beach bag.&rdquo;
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 6 }}>
                📝 <strong>Generated Title:</strong> Eco-Friendly Organic Cotton Canvas Tote Bag - Bright Yellow Beach Bag
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 6 }}>
                🏷️ <strong>Optimized Tags:</strong> tote bag, organic cotton, beach bag, summer tote, yellow canvas bag...
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Direct Multi-Platform Publish */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-2xl)', padding: 32
        }} className="feature-grid-row">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <div style={{ width: 140, padding: 16, background: 'rgba(241,100,30,0.06)', border: '1px solid var(--etsy)', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🛍️</div>
              <div style={{ fontWeight: 700, color: 'var(--etsy)' }}>Etsy API</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Creates Draft Listings</div>
            </div>
            <div style={{ width: 140, padding: 16, background: 'rgba(255,153,0,0.06)', border: '1px solid var(--amazon)', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
              <div style={{ fontWeight: 700, color: 'var(--amazon)' }}>Amazon SP-API</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Assigns SKU &amp; Price</div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 32 }}>🚀</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: 'var(--text-1)', margin: '12px 0' }}>
              One-Click Integration Sync
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 18 }}>
              No need to configure complex settings separately. Once you authenticate Etsy and Amazon in the settings hub, you can push optimized drafts to either or both shops simultaneously.
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 13.5, color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Direct background API payload push</li>
              <li>Custom Amazon SKU tracking logs</li>
              <li>Prevents active shop overrides</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Smart Image Management */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-2xl)', padding: 32
        }} className="feature-grid-row">
          <div>
            <span style={{ fontSize: 32 }}>🖼️</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: 'var(--text-1)', margin: '12px 0' }}>
              Smart Image Manager
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 18 }}>
              Add up to 8 high-resolution product photos. Drag-and-drop support makes sorting easy. The first image is automatically set as the main display listing picture. All files are stored safely in local server buckets.
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 13.5, color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Drag-and-drop multi-file upload zone</li>
              <li>Light-weight dynamic zoom image view</li>
              <li>Quick delete buttons</li>
            </ul>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, background: 'var(--bg-elevated)', padding: 18, borderRadius: 'var(--r-xl)', border: '1px solid var(--border-subtle)' }}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} style={{ aspectRatio: '1', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, position: 'relative' }}>
                {idx === 1 && <span style={{ position: 'absolute', top: 4, left: 4, background: 'var(--brand)', color: 'white', fontSize: 7, padding: '2px 4px', borderRadius: 2 }}>MAIN</span>}
                🖼️
              </div>
            ))}
            <div style={{ aspectRatio: '1', borderRadius: 'var(--r-md)', border: '2px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--text-3)' }}>+</div>
          </div>
        </div>

        {/* Section 4: Live Status Analytics */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-2xl)', padding: 32
        }} className="feature-grid-row">
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--r-xl)', padding: 20, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>INTEGRATION HEALTH</span>
              <span style={{ fontSize: 11, color: 'var(--success)' }}>ONLINE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Amazon SP-API Connection</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Etsy Oauth Session</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Google Gemini API</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>
              </div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 32 }}>📊</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: 'var(--text-1)', margin: '12px 0' }}>
              Connection Health Checks
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 18 }}>
              SellPilot continuously checks the connection state of connected marketplaces. You will see warning cards if tokens expire, ensuring you never run into failed publication actions.
            </p>
          </div>
        </div>

      </div>

      {/* ── CALL TO ACTION SECTION ────────────────────── */}
      <div style={{
        marginTop: 64, textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(124,109,250,0.1) 0%, transparent 100%)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--r-xl)',
        padding: '36px 20px',
      }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>
          Ready to Automate Your Listings?
        </h3>
        <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>
          Create your free account today and experience the speed.
        </p>
        <Link href="/signup" className="btn btn-primary btn-lg">✨ Signup Now</Link>
      </div>
    </div>
  );
}
