'use client';

import { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  value: string[];          // array of public image URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ value = [], onChange, maxImages = 8 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) { setError('Only image files are allowed.'); return; }
    if (value.length + arr.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed.`); return;
    }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      arr.forEach(f => fd.append('images', f));
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange([...value, ...data.urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [value, onChange, maxImages]);

  const removeImage = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Upload Zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragOver ? 'var(--brand)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--r-xl)',
          padding: '28px 16px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          background: dragOver
            ? 'rgba(124,109,250,0.07)'
            : 'var(--bg-input)',
          transition: 'all var(--t-fast)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle top gradient line on drag */}
        {dragOver && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'var(--grad-brand)',
          }} />
        )}

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--brand)', borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
            <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Uploading images…</span>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.5 }}>🖼️</div>
            <div style={{ color: 'var(--text-1)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              Drop images here or <span style={{ color: 'var(--brand-light)' }}>click to browse</span>
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: 12.5 }}>
              PNG, JPG, WEBP — up to {maxImages} images, max 10MB each
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="alert alert-error" style={{ padding: '10px 14px', fontSize: 13 }}>
          ❌ {error}
        </div>
      )}

      {/* Preview Grid */}
      {value.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 10,
        }}>
          {value.map((url, idx) => (
            <div
              key={url}
              style={{
                position: 'relative',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
                border: `1px solid ${idx === 0 ? 'var(--brand)' : 'var(--border-subtle)'}`,
                aspectRatio: '1',
                background: 'var(--bg-elevated)',
              }}
            >
              {/* Main image badge */}
              {idx === 0 && (
                <div style={{
                  position: 'absolute', top: 5, left: 5, zIndex: 2,
                  background: 'var(--brand)',
                  color: 'white', fontSize: 9, fontWeight: 700,
                  padding: '2px 6px', borderRadius: 4,
                  letterSpacing: '0.05em',
                }}>MAIN</div>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Product image ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeImage(idx); }}
                style={{
                  position: 'absolute', top: 4, right: 4, zIndex: 2,
                  width: 22, height: 22,
                  background: 'rgba(0,0,0,0.75)',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  lineHeight: 1,
                  transition: 'background var(--t-fast)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--danger)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}

          {/* Add more slot */}
          {value.length < maxImages && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--r-md)',
                border: '2px dashed var(--border-subtle)',
                background: 'var(--bg-input)',
                color: 'var(--text-3)',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--t-fast)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--brand-light)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)';
              }}
            >
              +
            </button>
          )}
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
        {value.length}/{maxImages} images added
        {value.length > 0 && ' · First image will be the main thumbnail'}
      </div>
    </div>
  );
}
