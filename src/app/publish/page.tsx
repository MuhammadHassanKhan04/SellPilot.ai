import { productDb } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PublishPage() {
  let drafts: ReturnType<typeof productDb.findAll> = [];
  try { drafts = productDb.findByStatus('draft'); } catch {}

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>🚀 Publish Center</h1>
          <p className="page-subtitle">{drafts.length} draft{drafts.length !== 1 ? 's' : ''} ready to publish</p>
        </div>
      </div>

      <div className="page-content">
        <div className="alert alert-info" style={{ marginBottom: 24 }}>
          <span>💡</span>
          <span>Select a product to open its detail page and choose which platform to publish it to.</span>
        </div>

        {drafts.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🚀</div>
              <h3>No drafts waiting</h3>
              <p>All your products have been published, or you haven&apos;t created any listings yet.</p>
              <Link href="/create" className="btn btn-primary btn-lg">✨ Create New Listing</Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Draft Products</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click a product to publish</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {drafts.map((product) => {
                const tags: string[] = JSON.parse(product.tags || '[]');
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)',
                      textDecoration: 'none', color: 'inherit', transition: 'all var(--t-fast)',
                    }}
                    className="nav-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: 28 }}>📦</div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: 15 }}>{product.title}</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          {tags.slice(0, 3).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: 'var(--ai)' }}>
                        ${product.price.toFixed(2)}
                      </div>
                      <span className="badge badge-draft">Draft</span>
                      <span style={{ color: 'var(--brand-light)', fontSize: 18 }}>→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
