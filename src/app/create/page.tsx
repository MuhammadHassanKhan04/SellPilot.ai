'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

interface AIResult {
  title: string;
  description: string;
  tags: string[];
  category: string;
  seoScore: number;
  improvements: string[];
  seoKeywords: string[];
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    rawInput: '',
    title: '',
    description: '',
    price: '',
    quantity: '1',
    tags: '',
    category: '',
    platform: 'both' as 'etsy' | 'amazon' | 'both',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOptimize = async () => {
    if (!form.rawInput.trim()) { setError('Please enter your product details first.'); return; }
    setError('');
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput: form.rawInput, platform: form.platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Optimization failed');
      setAiResult(data);
      setForm((prev) => ({
        ...prev,
        title: data.title,
        description: data.description,
        tags: data.tags.join(', '),
        category: data.category,
      }));
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.price) { setError('Title and price are required.'); return; }
    setError('');
    setIsSaving(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity, 10),
          tags,
          category: form.category,
          rawInput: form.rawInput,
          images: JSON.stringify(images),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      router.push(`/products/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const triggerCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Step indicator
  const steps = [
    { n: 1, label: 'Describe', icon: '📝' },
    { n: 2, label: 'Review & Publish', icon: '🚀' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>✨ Create New Listing</h1>
          <p className="page-subtitle">AI-powered product listing in 2 simple steps</p>
        </div>
        <div className="header-actions">
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className={`step-dot ${step === s.n ? 'active' : step > s.n ? 'done' : 'inactive'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                {i < steps.length - 1 && <div className={`step-line ${step > s.n ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 18, whiteSpace: 'pre-line' }}>
            <span>❌</span> {error}
          </div>
        )}

        {/* ── STEP 1: Describe ────────────────────────────────────── */}
        {step === 1 && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">📝 Step 1 — Describe Your Product</div>
            </div>

            <div className="ai-banner">
              <div>
                <h3>🤖 AI-Powered Optimization</h3>
                <p>Just describe your product in plain words — materials, size, use cases, price, audience. AI will craft a perfect SEO listing for Etsy &amp; Amazon.</p>
              </div>
              <span style={{ fontSize: 48, flexShrink: 0 }}>🧠</span>
            </div>

            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label" htmlFor="rawInput">
                Product Details <span className="req">*</span>
              </label>
              <textarea
                id="rawInput" name="rawInput"
                className="form-textarea"
                style={{ minHeight: 180 }}
                placeholder="e.g. Handmade leather wallet, brown genuine leather, 6 card slots, cash pocket, slim design. Size 11x9cm. Made in Pakistan. Great gift for men. Price $35."
                value={form.rawInput}
                onChange={handleChange}
              />
              <div className="form-hint">More detail = better AI result. Mention materials, dimensions, use cases, target audience.</div>
            </div>

            {/* Images in Step 1 */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label">
                🖼️ Product Images
                <span style={{ marginLeft: 6, fontSize: 11.5, fontWeight: 400, color: 'var(--text-3)' }}>(optional — add now or after)</span>
              </label>
              <ImageUploader value={images} onChange={setImages} maxImages={8} />
            </div>

            <div className="form-row cols-2" style={{ marginBottom: 8 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="platform">Target Platform</label>
                <select id="platform" name="platform" className="form-select" value={form.platform} onChange={handleChange}>
                  <option value="both">Both (Etsy + Amazon)</option>
                  <option value="etsy">Etsy Only</option>
                  <option value="amazon">Amazon Only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (USD) <span className="req">*</span></label>
                <input
                  id="price" name="price" type="number"
                  className="form-input" placeholder="35.00"
                  min="0" step="0.01"
                  value={form.price} onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)} type="button">
                Skip AI (manual)
              </button>
              <button
                className={`btn btn-ai btn-lg${isOptimizing ? ' btn-loading' : ''}`}
                onClick={handleOptimize}
                disabled={isOptimizing}
                type="button"
              >
                {!isOptimizing && '🤖'} Analyze &amp; Optimize with AI
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Review & Save ───────────────────────────────── */}
        {step === 2 && (
          <>
            {/* AI Result Banner with Copyable Hooks */}
            {aiResult && (
              <div className="ai-results" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div className="card-title">🤖 AI Optimization Complete</div>
                  <div className="ai-score-badge">
                    ⭐ SEO Score: {aiResult.seoScore}/100
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>📝 Improvements Made:</h4>
                    <ul className="improvements-list" style={{ margin: 0 }}>
                      {aiResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                  </div>

                  {aiResult.seoKeywords && aiResult.seoKeywords.length > 0 && (
                    <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ai)', margin: 0 }}>🔑 High-Ranking SEO Hooks:</h4>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 8px', fontSize: 11 }}
                          onClick={() => triggerCopy(aiResult.seoKeywords.join(', '), 'hooks')}
                        >
                          {copiedField === 'hooks' ? '✓ Copied' : '📋 Copy All Hooks'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {aiResult.seoKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            style={{
                              fontSize: 12, padding: '3px 8px',
                              background: 'rgba(0, 212, 170, 0.08)',
                              border: '1px solid rgba(0, 212, 170, 0.2)',
                              color: 'var(--ai)', borderRadius: 'var(--r-full)',
                              cursor: 'pointer'
                            }}
                            title="Click to copy this hook"
                            onClick={() => triggerCopy(keyword, keyword)}
                          >
                            {keyword} {copiedField === keyword ? '✓' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <div className="card-title">📋 Step 2 — Review &amp; Edit</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)} type="button">← Back</button>
              </div>

              {/* Images */}
              <div className="form-section">
                <div className="form-section-title">🖼️ Product Images</div>
                <ImageUploader value={images} onChange={setImages} maxImages={8} />
              </div>

              {/* Listing details */}
              <div className="form-section">
                <div className="form-section-title">📝 Listing Details</div>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="form-label" htmlFor="title" style={{ margin: 0 }}>Title <span className="req">*</span></label>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px', fontSize: 11 }}
                      onClick={() => triggerCopy(form.title, 'title')}
                    >
                      {copiedField === 'title' ? '✓ Copied' : '📋 Copy Title'}
                    </button>
                  </div>
                  <input
                    id="title" name="title" type="text"
                    className="form-input" placeholder="Product title"
                    value={form.title} onChange={handleChange} maxLength={200}
                  />
                  <div className="char-count">{form.title.length}/200</div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="form-label" htmlFor="description" style={{ margin: 0 }}>Description</label>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px', fontSize: 11 }}
                      onClick={() => triggerCopy(form.description, 'description')}
                    >
                      {copiedField === 'description' ? '✓ Copied' : '📋 Copy Description'}
                    </button>
                  </div>
                  <textarea
                    id="description" name="description"
                    className="form-textarea" style={{ minHeight: 200 }}
                    placeholder="Product description..."
                    value={form.description} onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="form-label" htmlFor="tags" style={{ margin: 0 }}>Tags (comma separated)</label>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px', fontSize: 11 }}
                      onClick={() => triggerCopy(form.tags, 'tags')}
                    >
                      {copiedField === 'tags' ? '✓ Copied' : '📋 Copy Tags'}
                    </button>
                  </div>
                  <input
                    id="tags" name="tags" type="text"
                    className="form-input"
                    placeholder="handmade, leather, wallet, gift for men..."
                    value={form.tags} onChange={handleChange}
                  />
                  <div className="form-hint">Etsy allows up to 13 tags. These are your main SEO keywords.</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="form-section">
                <div className="form-section-title">💰 Pricing &amp; Inventory</div>
                <div className="form-row cols-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="price2">Price (USD) <span className="req">*</span></label>
                    <input
                      id="price2" name="price" type="number"
                      className="form-input" placeholder="35.00"
                      min="0" step="0.01"
                      value={form.price} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="quantity">Quantity</label>
                    <input
                      id="quantity" name="quantity" type="number"
                      className="form-input" placeholder="1"
                      min="1" value={form.quantity} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Category</label>
                    <input
                      id="category" name="category" type="text"
                      className="form-input" placeholder="e.g. Accessories"
                      value={form.category} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)} type="button">
                  ← Re-Optimize
                </button>
                <button
                  id="save-product-btn"
                  className={`btn btn-primary btn-lg${isSaving ? ' btn-loading' : ''}`}
                  onClick={handleSave}
                  disabled={isSaving}
                  type="button"
                >
                  {!isSaving && '💾'} Save Product
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
