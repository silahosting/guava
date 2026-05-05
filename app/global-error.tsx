'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Global error:', error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#0a0a0a', color: '#fafafa', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
          <div style={{ maxWidth: '420px', width: '100%', padding: '2rem', borderRadius: '16px', border: '1px solid #262626', backgroundColor: '#171717', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <span style={{ fontSize: '28px' }}>!</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>Terjadi Kesalahan</h2>
            <p style={{ fontSize: '14px', color: '#a3a3a3', margin: '0 0 24px', lineHeight: 1.5 }}>
              Aplikasi mengalami error yang tidak terduga. Silakan coba muat ulang halaman.
            </p>
            {error?.digest && (
              <p style={{ fontSize: '11px', color: '#737373', fontFamily: 'monospace', margin: '0 0 16px' }}>
                ID: {error.digest}
              </p>
            )}
            <button
              onClick={() => reset()}
              style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #404040', backgroundColor: '#fafafa', color: '#0a0a0a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
