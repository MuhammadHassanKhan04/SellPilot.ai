import { productDb, integrationDb } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  let total = 0, published = 0, drafts = 0;
  let recentProducts: ReturnType<typeof productDb.findAll> = [];
  let etsyConnected = false, amazonConnected = false;

  try {
    total     = productDb.count();
    published = productDb.countByStatus('published');
    drafts    = productDb.countByStatus('draft');
    recentProducts = productDb.findRecent(6);
    const etsy   = integrationDb.findByPlatform('etsy');
    const amazon = integrationDb.findByPlatform('amazon');
    etsyConnected   = !!(etsy?.isConnected);
    amazonConnected = !!(amazon?.isConnected);
  } catch {}

  const connected = (etsyConnected ? 1 : 0) + (amazonConnected ? 1 : 0);

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p className="page-subtitle">Your AI-powered selling command center</p>
        </div>
        <div className="header-actions">
          <Link href="/create" className="btn btn-primary">✨ New Listing</Link>
        </div>
      </div>

      <div className="page-content">

        {/* Hero Banner */}
        <div className="dashboard-hero">
          <div>
            <div className="hero-greeting">Welcome to SellPilot.ai 🪂</div>
            <div className="hero-sub">
              Create AI-optimized product listings and publish them to Etsy &amp; Amazon in seconds.
              {!etsyConnected && !amazonConnected && (
                <span> <Link href="/integrations" style={{ color: 'var(--brand-light)', fontWeight: 600 }}>Connect your accounts →</Link></span>
              )}
            </div>
          </div>
          <div className="hero-actions">
            <Link href="/create"   className="btn btn-primary btn-lg">✨ Create Listing</Link>
            <Link href="/publish"  className="btn btn-secondary">🚀 Publish Queue</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { icon: '📦', value: total,     label: 'Total Products' },
            { icon: '🚀', value: published, label: 'Published' },
            { icon: '✏️', value: drafts,    label: 'Drafts' },
            { icon: '🔗', value: connected, label: 'Connected Platforms', suffix: '/ 2' },
          ].map(({ icon, value, label, suffix }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon-wrap">{icon}</div>
              <div className="stat-value">
                {value}
                {suffix && <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-3)', marginLeft: 4 }}>{suffix}</span>}
              </div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Recent Products */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Recent Products</div>
            <Link href="/products" className="btn btn-ghost btn-sm">View All →</Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: '48px 20px' }}>
              <div className="empty-state-icon">📦</div>
              <h3>No products yet</h3>
              <p>Create your first AI-optimized listing for Etsy or Amazon in under 2 minutes.</p>
              <Link href="/create" className="btn btn-primary btn-lg">✨ Create First Listing</Link>
            </div>
          ) : (
            <div className="product-grid">
              {recentProducts.map((product) => {
                const tags = JSON.parse(product.tags || '[]') as string[];
                const images = JSON.parse(product.images || '[]') as string[];
                const mainImage = images[0] || null;

                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card-image">
                      {mainImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mainImage}
                          alt={product.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <span style={{ fontSize: 52, opacity: 0.35 }}>📦</span>
                      )}
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-title">{product.title}</div>
                      <div className="product-card-price">${product.price.toFixed(2)}</div>
                      <div className="product-card-tags">
                        {tags.slice(0, 3).map((t) => <span key={t} className="tag-pill">{t}</span>)}
                      </div>
                      <div className="product-card-footer">
                        <div className="platform-badges">
                          {product.etsyListingId   && <span className="platform-badge etsy">Etsy</span>}
                          {product.amazonListingId  && <span className="platform-badge amazon">Amazon</span>}
                          {!product.etsyListingId && !product.amazonListingId &&
                            <span className="platform-badge draft">Draft</span>}
                        </div>
                        <Link href={`/products/${product.id}`} className="btn btn-ghost btn-sm">Edit →</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
