'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  tags: string;
  category: string;
  images: string;
  status: string;
  etsyListingId: string | null;
  amazonListingId: string | null;
  rawInput: string | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct]   = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishPlatform, setPublishPlatform] = useState({ etsy: false, amazon: false });
  const [form, setForm]     = useState<Partial<Product>>({});
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    const res = await fetch(`/api/products/${params.id}`);
    if (!res.ok) { router.push('/products'); return; }
    const data = await res.json();
    setProduct(data);
    setForm(data);
    setImages(JSON.parse(data.images || '[]'));
  }, [params.id, router]);

  useEffect(() => { loadProduct(); }, [loadProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tags = typeof form.tags === 'string'
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags, images: JSON.stringify(images) }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setProduct(data);
      setForm(data);
      setImages(JSON.parse(data.images || '[]'));
      setIsEditing(false);
      setMessage({ text: '✅ Product saved!', type: 'success' });
    } catch {
      setMessage({ text: '❌ Failed to save changes.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!publishPlatform.etsy && !publishPlatform.amazon) {
      setMessage({ text: '⚠️ Select at least one platform first.', type: 'warning' });
      return;
    }
    setIsPublishing(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`/api/products/${params.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishPlatform),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Publish failed');
      setMessage({ text: data.message || '✅ Published!', type: data.errors?.length ? 'warning' : 'success' });
      loadProduct();
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : '❌ Unknown error', type: 'error' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setIsDeleting(true);
    await fetch(`/api/products/${params.id}`, { method: 'DELETE' });
    router.push('/products');
  };

  if (!product) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>⏳</div>
          <div style={{ color: 'var(--text-2)' }}>Loading product…</div>
        </div>
      </div>
    );
  }

  const tags: string[] = JSON.parse(product.tags || '[]');

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="modal-overlay"
          onClick={() => setLightbox(null)}
          style={{ cursor: 'zoom-out' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Product image"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1 style={{ fontSize: 17, maxWidth: 460, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.title}
          </h1>
          <p className="page-subtitle">Product Details &amp; Publishing</p>
        </div>
        <div className="header-actions">
          {isEditing ? (
            <>
              <button className="btn btn-ghost" onClick={() => { setIsEditing(false); setForm(product); setImages(JSON.parse(product.images || '[]')); }} type="button">
                Cancel
              </button>
              <button
                className={`btn btn-primary${isSaving ? ' btn-loading' : ''}`}
                onClick={handleSave}
                disabled={isSaving}
                type="button"
              >
                {!isSaving && '💾'} Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn btn-danger btn-sm${isDeleting ? ' btn-loading' : ''}`}
                onClick={handleDelete}
                disabled={isDeleting}
                type="button"
              >
                {!isDeleting && '🗑️'} Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)} type="button">
                ✏️ Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-content">
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : message.type === 'warning' ? 'warning' : 'error'}`} style={{ marginBottom: 20, whiteSpace: 'pre-line' }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* ── Left: Details ──────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Images */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🖼️ Product Images</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{images.length}/8 images</div>
              </div>

              {isEditing ? (
                <ImageUploader value={images} onChange={setImages} maxImages={8} />
              ) : images.length > 0 ? (
                <div>
                  {/* Main big image */}
                  <div
                    style={{
                      width: '100%', aspectRatio: '16/9',
                      borderRadius: 'var(--r-lg)',
                      overflow: 'hidden',
                      background: 'var(--bg-elevated)',
                      marginBottom: 10,
                      cursor: 'zoom-in',
                      border: '1px solid var(--border-subtle)',
                    }}
                    onClick={() => setLightbox(images[0])}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {images.slice(1).map((url, i) => (
                        <div
                          key={url}
                          onClick={() => setLightbox(url)}
                          style={{
                            width: 72, height: 72,
                            borderRadius: 'var(--r-md)',
                            overflow: 'hidden',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'zoom-in',
                            flexShrink: 0,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`image ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>
                    Click any image to zoom · <button
                      type="button" onClick={() => setIsEditing(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-light)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', padding: 0 }}
                    >Edit images</button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.4 }}>🖼️</div>
                  <div style={{ fontSize: 13, marginBottom: 12 }}>No images yet</div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                    + Add Images
                  </button>
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="card">
              <div className="form-section">
                <div className="form-section-title">📝 Listing Details</div>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Title</label>
                  {isEditing
                    ? <input name="title" className="form-input" value={form.title || ''} onChange={handleChange} />
                    : <div style={{ color: 'var(--text-1)', fontSize: 15, fontWeight: 600 }}>{product.title}</div>
                  }
                </div>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Description</label>
                  {isEditing
                    ? <textarea name="description" className="form-textarea" style={{ minHeight: 180 }} value={form.description || ''} onChange={handleChange} />
                    : <div style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{product.description || <em style={{ color: 'var(--text-3)' }}>No description</em>}</div>
                  }
                </div>
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  {isEditing
                    ? <input name="tags" className="form-input" value={typeof form.tags === 'string' ? form.tags : tags.join(', ')} onChange={handleChange} />
                    : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                        {tags.length === 0 && <span style={{ color: 'var(--text-3)', fontSize: 14 }}>No tags</span>}
                      </div>
                  }
                </div>
              </div>

              <hr className="divider" />

              <div className="form-section">
                <div className="form-section-title">💰 Pricing &amp; Inventory</div>
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label">Price (USD)</label>
                    {isEditing
                      ? <input name="price" type="number" className="form-input" value={form.price || ''} onChange={handleChange} />
                      : <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ai)', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>${product.price.toFixed(2)}</div>
                    }
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    {isEditing
                      ? <input name="quantity" type="number" className="form-input" value={form.quantity || ''} onChange={handleChange} />
                      : <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>{product.quantity}</div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Publish Panel ────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Status */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>📊 Publish Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '🛍️', label: 'Etsy', id: product.etsyListingId, idLabel: 'Listing ID' },
                  { icon: '📦', label: 'Amazon', id: product.amazonListingId, idLabel: 'SKU' },
                ].map(({ icon, label, id, idLabel }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${id ? 'rgba(0,201,138,0.2)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--r-md)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                      {icon} {label}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {id
                        ? <><span className="badge badge-published">✓ Live</span>
                            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{idLabel}: {id}</div></>
                        : <span className="badge badge-draft">Draft</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>🚀 Publish To</div>
              <div className="publish-selector" style={{ gridTemplateColumns: '1fr' }}>
                {[
                  { key: 'etsy' as const, icon: '🛍️', label: 'Etsy', meta: product.etsyListingId ? `ID: ${product.etsyListingId}` : 'Not published' },
                  { key: 'amazon' as const, icon: '📦', label: 'Amazon', meta: product.amazonListingId ? `SKU: ${product.amazonListingId}` : 'Not published' },
                ].map(({ key, icon, label, meta }) => (
                  <div
                    key={key}
                    className={`publish-option${publishPlatform[key] ? ` sel-${key}` : ''}`}
                    onClick={() => setPublishPlatform(p => ({ ...p, [key]: !p[key] }))}
                  >
                    <div className="publish-option-icon">{icon}</div>
                    <div>
                      <div className="publish-option-name">{label}</div>
                      <div className="publish-option-meta">{meta}</div>
                    </div>
                    <div className="publish-check">{publishPlatform[key] && '✓'}</div>
                  </div>
                ))}
              </div>

              <button
                className={`btn btn-primary btn-lg${isPublishing ? ' btn-loading' : ''}`}
                style={{ width: '100%', marginTop: 12 }}
                onClick={handlePublish}
                disabled={isPublishing}
                type="button"
              >
                {!isPublishing && '🚀'} Publish Now
              </button>
              <div className="form-hint" style={{ textAlign: 'center', marginTop: 10 }}>
                Connect accounts in{' '}
                <a href="/integrations" style={{ color: 'var(--brand-light)' }}>Integrations</a>{' '}
                before publishing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
