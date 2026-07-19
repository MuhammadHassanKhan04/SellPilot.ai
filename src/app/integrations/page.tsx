'use client';

import { useState, useEffect } from 'react';

type Platform = 'etsy' | 'amazon' | 'gemini';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
  };
  return { toasts, add };
}

function ToastList({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function IntegrationsPage() {
  const { toasts, add: toast } = useToast();

  // ── State ────────────────────────────────────────────────────────────────
  const [etsyConnected, setEtsyConnected] = useState(false);
  const [amazonConnected, setAmazonConnected] = useState(false);

  // Etsy fields
  const [etsyApiKey, setEtsyApiKey]       = useState('');
  const [etsyOauthToken, setEtsyOauthToken] = useState('');
  const [etsyShopId, setEtsyShopId]       = useState('');
  const [etsyLoading, setEtsyLoading]     = useState(false);

  // Amazon fields
  const [amzClientId,     setAmzClientId]     = useState('');
  const [amzClientSecret, setAmzClientSecret] = useState('');
  const [amzRefreshToken, setAmzRefreshToken] = useState('');
  const [amzSellerId,     setAmzSellerId]     = useState('');
  const [amzLoading,      setAmzLoading]      = useState(false);

  // Gemini
  const [geminiKey,     setGeminiKey]     = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    fetch('/api/integrations/status')
      .then(r => r.json())
      .then(d => { setEtsyConnected(d.etsy); setAmazonConnected(d.amazon); })
      .catch(() => {});
  }, []);

  // ── Etsy ─────────────────────────────────────────────────────────────────
  async function connectEtsy() {
    if (!etsyApiKey || !etsyOauthToken || !etsyShopId) {
      toast('Please fill in all three Etsy fields.', 'error'); return;
    }
    setEtsyLoading(true);
    try {
      const res = await fetch('/api/integrations/etsy/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: etsyApiKey, oauthToken: etsyOauthToken, shopId: etsyShopId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connection failed');
      setEtsyConnected(true);
      setEtsyApiKey(''); setEtsyOauthToken(''); setEtsyShopId('');
      toast('✅ Etsy account connected successfully!', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to connect Etsy', 'error');
    } finally { setEtsyLoading(false); }
  }

  async function disconnectEtsy() {
    await fetch('/api/integrations/etsy/disconnect', { method: 'DELETE' });
    setEtsyConnected(false);
    toast('Etsy account disconnected.', 'info');
  }

  // ── Amazon ────────────────────────────────────────────────────────────────
  async function connectAmazon() {
    if (!amzClientId || !amzClientSecret || !amzRefreshToken) {
      toast('Please fill in all three Amazon API fields.', 'error'); return;
    }
    setAmzLoading(true);
    try {
      const res = await fetch('/api/integrations/amazon/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: amzClientId,
          clientSecret: amzClientSecret,
          refreshToken: amzRefreshToken,
          sellerId: amzSellerId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connection failed');
      setAmazonConnected(true);
      setAmzClientId(''); setAmzClientSecret(''); setAmzRefreshToken(''); setAmzSellerId('');
      toast('✅ Amazon SP-API connected successfully!', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to connect Amazon', 'error');
    } finally { setAmzLoading(false); }
  }

  async function disconnectAmazon() {
    await fetch('/api/integrations/amazon/disconnect', { method: 'DELETE' });
    setAmazonConnected(false);
    toast('Amazon account disconnected.', 'info');
  }

  // ── Gemini ────────────────────────────────────────────────────────────────
  async function saveGeminiKey() {
    if (!geminiKey) { toast('Please enter your Gemini API key.', 'error'); return; }
    setGeminiLoading(true);
    try {
      const res = await fetch('/api/integrations/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: geminiKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeminiKey('');
      toast('✅ Gemini API key saved! Restart the server for it to take effect.', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed', 'error');
    } finally { setGeminiLoading(false); }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>🔌 Integrations</h1>
          <p className="page-subtitle">Connect your platforms to enable publishing</p>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── Etsy ──────────────────────────────────────────────────────── */}
        <div className="integration-card etsy-card">
          <div className="int-header">
            <div className="integration-logo etsy-logo">🛍️</div>
            <div className="int-info">
              <h3>Etsy</h3>
              <p>Handmade & vintage marketplace</p>
            </div>
            <div className="int-status">
              <div className={`status-pill ${etsyConnected ? 'connected' : 'disconnected'}`}>
                <div className="status-pill-dot" />
                {etsyConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>

          {etsyConnected ? (
            <div>
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                🎉 Your Etsy store is connected and ready to publish listings!
              </div>
              <button onClick={disconnectEtsy} className="btn btn-danger btn-sm">
                Disconnect Etsy
              </button>
            </div>
          ) : (
            <div>
              <div className="alert alert-info" style={{ marginBottom: 18 }}>
                <div>
                  <strong>How to get your Etsy credentials:</strong>
                  <ol style={{ marginTop: 8, paddingLeft: 18, fontSize: 12.5, color: 'inherit', opacity: 0.85, lineHeight: 1.7 }}>
                    <li>Go to <strong>etsy.com/developers</strong> → Create an App</li>
                    <li>Copy your <strong>Keystring</strong> (API Key) from the app page</li>
                    <li>Complete the OAuth flow to get an <strong>OAuth Access Token</strong></li>
                    <li>Your <strong>Shop ID</strong> is the number in your shop&apos;s URL</li>
                  </ol>
                </div>
              </div>
              <div className="credentials-grid">
                <div className="form-group">
                  <label className="form-label">API Keystring <span className="req">*</span></label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Your Etsy App Keystring"
                    value={etsyApiKey}
                    onChange={e => setEtsyApiKey(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">OAuth Access Token <span className="req">*</span></label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="OAuth 2.0 Access Token"
                    value={etsyOauthToken}
                    onChange={e => setEtsyOauthToken(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Shop ID <span className="req">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 12345678"
                    value={etsyShopId}
                    onChange={e => setEtsyShopId(e.target.value)}
                  />
                  <span className="form-hint">Found in your Etsy shop URL: etsy.com/shop/YourShopName (numeric ID from API)</span>
                </div>
                <div>
                  <button
                    onClick={connectEtsy}
                    disabled={etsyLoading}
                    className={`btn btn-etsy${etsyLoading ? ' btn-loading' : ''}`}
                  >
                    {etsyLoading ? '' : '🛍️ Connect Etsy'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Amazon ────────────────────────────────────────────────────── */}
        <div className="integration-card amazon-card">
          <div className="int-header">
            <div className="integration-logo amazon-logo">📦</div>
            <div className="int-info">
              <h3>Amazon</h3>
              <p>SP-API selling partner integration</p>
            </div>
            <div className="int-status">
              <div className={`status-pill ${amazonConnected ? 'connected' : 'disconnected'}`}>
                <div className="status-pill-dot" />
                {amazonConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>

          {amazonConnected ? (
            <div>
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                🎉 Your Amazon SP-API is connected! You can now publish listings to Amazon.
              </div>
              <button onClick={disconnectAmazon} className="btn btn-danger btn-sm">
                Disconnect Amazon
              </button>
            </div>
          ) : (
            <div>
              <div className="alert alert-info" style={{ marginBottom: 18 }}>
                <div>
                  <strong>How to get Amazon SP-API credentials:</strong>
                  <ol style={{ marginTop: 8, paddingLeft: 18, fontSize: 12.5, color: 'inherit', opacity: 0.85, lineHeight: 1.7 }}>
                    <li>Go to <strong>Seller Central → Apps & Services → Develop Apps</strong></li>
                    <li>Create an app and get <strong>Client ID</strong> &amp; <strong>Client Secret</strong></li>
                    <li>Authorize via the SP-API OAuth flow to get a <strong>Refresh Token</strong></li>
                    <li>Your <strong>Seller ID</strong> is in Seller Central → Account Info</li>
                  </ol>
                </div>
              </div>
              <div className="credentials-grid">
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label">Client ID (LWA) <span className="req">*</span></label>
                    <input type="password" className="form-input" placeholder="amzn1.application-oa2-client.xxx"
                      value={amzClientId} onChange={e => setAmzClientId(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Secret (LWA) <span className="req">*</span></label>
                    <input type="password" className="form-input" placeholder="••••••••••••••••"
                      value={amzClientSecret} onChange={e => setAmzClientSecret(e.target.value)} />
                  </div>
                </div>
                <div className="form-row cols-2">
                  <div className="form-group">
                    <label className="form-label">Refresh Token <span className="req">*</span></label>
                    <input type="password" className="form-input" placeholder="Atzr|IwEB..."
                      value={amzRefreshToken} onChange={e => setAmzRefreshToken(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Seller ID <span className="req">*</span></label>
                    <input type="text" className="form-input" placeholder="A1EXAMPLE123456"
                      value={amzSellerId} onChange={e => setAmzSellerId(e.target.value)} />
                  </div>
                </div>
                <div>
                  <button
                    onClick={connectAmazon}
                    disabled={amzLoading}
                    className={`btn btn-amazon${amzLoading ? ' btn-loading' : ''}`}
                  >
                    {amzLoading ? '' : '📦 Connect Amazon (Verifying…)'}
                  </button>
                  <span className="form-hint" style={{ marginLeft: 12 }}>
                    Credentials are verified with Amazon LWA before saving.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Gemini AI ─────────────────────────────────────────────────── */}
        <div className="integration-card ai-card">
          <div className="int-header">
            <div className="integration-logo ai-logo">🤖</div>
            <div className="int-info">
              <h3>Gemini AI</h3>
              <p>Powered by Google Gemini Pro</p>
            </div>
            <div className="int-status">
              <div className={`status-pill ${process.env.GEMINI_API_KEY ? 'connected' : 'disconnected'}`}>
                <div className="status-pill-dot" />
                {process.env.GEMINI_API_KEY ? 'Configured' : 'Not Configured'}
              </div>
            </div>
          </div>
          <div className="credentials-grid">
            <div className="form-group">
              <label className="form-label">Gemini API Key</label>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
              />
              <span className="form-hint">
                Get your free API key at{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                  aistudio.google.com
                </a>{' '}
                — Gemini Pro is free to use with generous limits.
              </span>
            </div>
            <div>
              <button
                onClick={saveGeminiKey}
                disabled={geminiLoading}
                className={`btn btn-ai${geminiLoading ? ' btn-loading' : ''}`}
              >
                {geminiLoading ? '' : '🤖 Save AI Key'}
              </button>
            </div>
          </div>
        </div>

      </div>

      <ToastList toasts={toasts} />
    </>
  );
}
