import { productDb } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  let products: ReturnType<typeof productDb.findAll> = [];
  try { products = productDb.findAll(); } catch {}

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>📦 My Products</h1>
          <p className="page-subtitle">{products.length} product{products.length !== 1 ? 's' : ''} in your library</p>
        </div>
        <div className="header-actions">
          <Link href="/create" className="btn btn-primary">✨ New Listing</Link>
        </div>
      </div>

      <div className="page-content">
        {products.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No products yet</h3>
              <p>Create your first product listing using AI to optimize it instantly for Etsy and Amazon.</p>
              <Link href="/create" className="btn btn-primary btn-lg">✨ Create Your First Listing</Link>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const tags = JSON.parse(product.tags || '[]') as string[];
              const imageUrls = JSON.parse(product.images || '[]') as string[];
              const mainImage = imageUrls[0] || null;

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
                    <div className="product-card-title" title={product.title}>{product.title}</div>
                    <div className="product-card-price">${product.price.toFixed(2)}</div>
                    <div className="product-card-tags">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                      {tags.length > 3 && <span className="tag-pill">+{tags.length - 3}</span>}
                    </div>
                    <div className="product-card-footer">
                      <div className="platform-badges">
                        {product.etsyListingId   && <span className="platform-badge etsy">Etsy</span>}
                        {product.amazonListingId  && <span className="platform-badge amazon">Amazon</span>}
                        {!product.etsyListingId && !product.amazonListingId &&
                          <span className="platform-badge draft">Draft</span>}
                      </div>
                      <Link href={`/products/${product.id}`} className="btn btn-ghost btn-sm">Manage →</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
