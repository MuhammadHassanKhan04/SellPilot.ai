'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSubmitted(true);
  };

  const faqs = [
    { q: 'How does the Etsy integration work?', a: 'SellPilot utilizes secure OAuth 2.0. You authorize our tool once, and we get access to create drafts on your shop. We never run active listings overrules without your choice.' },
    { q: 'Is the Amazon SP-API connection secure?', a: 'Yes, absolutely. We authenticate using your LWA credentials directly against Selling Partner API endpoints. All tokens are encrypted and cached safely.' },
    { q: 'Can I use my own Gemini API Key?', a: 'Yes, that is the best part! Under Integrations > AI Configuration, you can add your own key from Google AI Studio. This gives you direct control without any extra monthly platform fees.' },
    { q: 'What happens when I publish a listing?', a: 'The listing is sent directly as a draft to your store. This allows you to log into Seller Central or Etsy Shop Manager to review photos, delivery options, and make final manual edits before pushing it live.' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>
      
      {/* ── HEADER ─────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 54 }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(32px, 5vw, 54px)',
          fontWeight: 900,
          color: 'var(--text-1)',
          marginBottom: 16,
          letterSpacing: '-1px',
        }}>
          Get in Touch
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16.5, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Have questions about connecting your marketplace stores or API keys? Our support team is here to assist.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginBottom: 64 }} className="contact-grid">
        {/* ── LEFT: FORM ────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">✉️ Send a Message</div>
          </div>

          {submitted ? (
            <div className="alert alert-success" style={{ padding: '24px', textAlign: 'center', display: 'block' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <h3>Thank You!</h3>
              <p style={{ marginTop: 6, fontSize: 13.5 }}>We received your message and will respond within 12-24 hours.</p>
              <button onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }} className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-row cols-2">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text" required className="form-input" placeholder="e.g. Farhan"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email" required className="form-input" placeholder="e.g. name@domain.com"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text" className="form-input" placeholder="e.g. SP-API Connection Issue"
                  value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  required className="form-textarea" placeholder="How can we help you?"
                  style={{ minHeight: 140 }}
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="submit" className="btn btn-primary btn-lg">🚀 Send Inquiry</button>
              </div>
            </form>
          )}
        </div>

        {/* ── RIGHT: HELP INFO ──────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>
              📍 Support Office
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
              SellPilot.ai Technologies LLC <br />
              DHA Phase 6, Karachi, Pakistan <br />
              Email: <strong>support@sellpilot.ai</strong>
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>
              ⚡ Fast Assistance
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
              For rapid support related to active Amazon listings, make sure to attach your SKU and Marketplace ID in your ticket.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ACCORDION SECTIONS (4-5 Sections) ───────── */}
      <div className="card" style={{ maxWidth: 880, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 20, textAlign: 'center' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-md)',
                background: 'var(--bg-elevated)',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  width: '100%', padding: '16px', background: 'none', border: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textAlign: 'left', cursor: 'pointer', color: 'var(--text-1)',
                  fontWeight: 600, fontSize: 14.5,
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: 18, color: 'var(--brand-light)' }}>
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div style={{
                  padding: '0 16px 16px', fontSize: 13.5,
                  color: 'var(--text-2)', lineHeight: 1.6,
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: 12,
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
