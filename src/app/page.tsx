import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LandingHomePage() {
  return (
    <div>
      {/* ── SECTION 1: HERO HEADER ──────────────────────── */}
      <section style={{
        padding: '80px 24px 100px',
        maxWidth: 1200, margin: '0 auto',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative',
      }}>
        {/* Glow behind hero */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'var(--brand-glow)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: -1
        }} />

        <div className="badge badge-draft" style={{ marginBottom: 20, background: 'rgba(124, 109, 250, 0.1)', borderColor: 'var(--border-default)', color: 'var(--brand-light)' }}>
          🚀 Introducing SellPilot.ai v1.0.0
        </div>

        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(40px, 6vw, 68px)',
          fontWeight: 900,
          lineHeight: 1.1,
          color: 'var(--text-1)',
          letterSpacing: '-1.5px',
          maxWidth: 900,
          marginBottom: 20,
        }}>
          Sell Smarter. List Faster. <br />
          <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Powered by AI
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 19px)',
          color: 'var(--text-2)',
          maxWidth: 680,
          lineHeight: 1.6,
          marginBottom: 36,
        }}>
          The ultimate seller pilot tool. Connect your Etsy and Amazon accounts, describe your product in plain words, and let our AI publish optimized, SEO-rich listings in seconds.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="btn btn-primary btn-lg">✨ Get Started Free</Link>
          <Link href="/features" className="btn btn-secondary btn-lg">Explore Features</Link>
        </div>

        {/* Product mock preview */}
        <div style={{
          marginTop: 64, width: '100%', maxWidth: 940,
          background: 'rgba(10, 10, 30, 0.6)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-2xl)',
          padding: 16,
          boxShadow: 'var(--shadow-brand-xl)',
        }}>
          <div style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--r-xl)',
            padding: '24px 20px',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4f6e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbe4d' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00c98a' }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>SellPilot AI Optimizer Panel</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
              {/* input mock */}
              <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--r-md)', padding: 14, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600, marginBottom: 6 }}>RAW PRODUCT DESCRIPTION</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                  &ldquo;Genuine leather brown passport cover, fits standard passports, holds credit cards, hand stitched, slim design. Cost is 24 dollars.&rdquo;
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 12, paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="btn btn-ai btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>Optimize with AI</div>
                </div>
              </div>

              {/* output mock */}
              <div style={{ background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 168, 255, 0.05) 100%)', borderRadius: 'var(--r-md)', padding: 14, border: '1px solid rgba(0, 212, 170, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--ai)', fontWeight: 700 }}>AI OPTIMIZED FOR SEO</div>
                  <div style={{ fontSize: 10.5, color: 'var(--success)', background: 'rgba(0, 201, 138, 0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>SEO SCORE: 98/100</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 700, marginBottom: 4 }}>
                  Handmade Leather Passport Holder - Slim RFID Brown Passport Wallet
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-2)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                  Crafted from premium full-grain leather, this minimalist brown passport cover keeps your travel essentials secure and stylish. Features 4 slots for credit cards and a slim pocket...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: INTEGRATIONS SHOWCASE ───────────── */}
      <section style={{
        padding: '48px 24px',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.01)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 24 }}>
            Direct Sync Integrations for High-Volume Sellers
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.8 }}>
              <span style={{ fontSize: 32 }}>🛍️</span>
              <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--etsy)' }}>Etsy Shop API</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.8 }}>
              <span style={{ fontSize: 32 }}>📦</span>
              <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--amazon)' }}>Amazon SP-API</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.8 }}>
              <span style={{ fontSize: 32 }}>🤖</span>
              <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--ai)' }}>Google Gemini</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: AI FEATURE HIGHLIGHTS ───────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, color: 'var(--text-1)', marginBottom: 8 }}>
            Built to Eliminate Listing Friction
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
            Stop copying and pasting titles, tags, and images manually. SellPilot does it all automatically.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { icon: '🤖', title: 'AI-Powered SEO Optimizer', desc: 'Analyzes products and creates optimized titles, keyword-rich structured listings, and high-converting product categories.' },
            { icon: '🚀', title: '1-Click Multi-Publishing', desc: 'Syncs products directly to Etsy (as draft listings) and Amazon SP-API (with unique SKUs) simultaneously.' },
            { icon: '🖼️', title: 'Smart Image Uploads', desc: 'Store up to 8 images per product. Re-order and set the main listing thumbnail with drag-and-drop preview.' },
            { icon: '🔑', title: 'Secure API Credentials', desc: 'OAuth and SP-API tokens are parsed and handled directly on your local system with instant DB validation.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 36, width: 50, height: 50, borderRadius: 'var(--r-lg)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: LIVE STATS COUNTER ──────────────── */}
      <section style={{
        padding: '64px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(124, 109, 250, 0.03) 100%)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          {[
            { value: '1.2M+', label: 'Products Optimized' },
            { value: '1-Click', label: 'Etsy & Amazon Publish' },
            { value: '98%', label: 'SEO Success Score' },
            { value: '15 Min', label: 'Saved Per Listing' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'Outfit', fontSize: 44, fontWeight: 900,
                background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '-1px', marginBottom: 4
              }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: CUSTOMER TESTIMONIALS ────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, color: 'var(--text-1)' }}>
            Loved by E-commerce Sellers
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {[
            { quote: 'I list around 30 handmade leather items per week. Doing this manually took 6-7 hours. With SellPilot, I do it all in under an hour. The AI-generated tags are fantastic.', author: 'Farhan K.', role: 'Etsy Seller, Leathercraft' },
            { quote: 'Integrating the Amazon SP-API was always a nightmare. SellPilot.ai made it so easy. The live credential test is a lifesaver. Highly recommend it to high volume brands.', author: 'Zainab A.', role: 'FBA Private Label Owner' },
          ].map(({ quote, author, role }) => (
            <div key={author} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>
                &ldquo;{quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {author[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)' }}>{author}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: CALL TO ACTION (CTA) ────────────── */}
      <section style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 109, 250, 0.15) 0%, rgba(0, 212, 170, 0.05) 100%)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-2xl)',
          padding: '48px 32px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>
            Start Optimizing Your Listings Today
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15.5, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Set up your account in under 2 minutes. Free access. No credit card required.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">✨ Launch Your Free Account</Link>
        </div>
      </section>
    </div>
  );
}
