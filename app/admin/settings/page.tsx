'use client'

import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, AlertCircle, CheckCircle, Save, CreditCard } from 'lucide-react'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
import { NeoBadge } from '@/components/ui/neo-badge'
import { NeoCard } from '@/components/ui/neo-card'
import { getQrisSettings } from '@/actions/qris.actions'
import type { QrisSettings } from '@/types'

export default function AdminPaymentSettingsPage() {
  const [qrisSettings, setQrisSettings] = useState<QrisSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingQris, setSavingQris] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [paymentProvider, setPaymentProvider] = useState<'orkut' | 'midtrans'>('orkut')
  
  const [showMidtransServerKey, setShowMidtransServerKey] = useState(false)
  const [midtransFormData, setMidtransFormData] = useState({
    clientKey: '',
    serverKey: '',
    merchantId: '',
  })
  
  const [qrisFormData, setQrisFormData] = useState({
    username: '',
    apiKey: '',
    token: '',
    merchantId: '',
    codeQr: '',
  })
  const [showQrisToken, setShowQrisToken] = useState(false)
  const [showQrisApiKey, setShowQrisApiKey] = useState(false)

  useEffect(() => {
    fetchQrisSettings()
  }, [])

  async function fetchQrisSettings() {
    try {
      const qrisData = await getQrisSettings('admin')
      if (qrisData) {
        setQrisSettings(qrisData)
        setPaymentProvider(qrisData.provider || 'orkut')
        
        if (qrisData.provider === 'midtrans') {
          setMidtransFormData({
            clientKey: '', // Don't show for security
            serverKey: '', // Don't show for security
            merchantId: qrisData.midtransMerchantId || '',
          })
        } else {
          setQrisFormData({
            username: qrisData.username || '',
            apiKey: '', // Don't show for security
            token: '', // Don't show for security
            merchantId: qrisData.merchantId || '',
            codeQr: '', // Don't show full QR for security
          })
        }
      }
    } catch (error) {
      console.error('Error fetching QRIS settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitOrkutSettings(e: React.FormEvent) {
    e.preventDefault()
    setSavingQris(true)
    setMessage(null)

    try {
      if (!qrisFormData.username || !qrisFormData.apiKey || !qrisFormData.token || !qrisFormData.merchantId || !qrisFormData.codeQr) {
        setMessage({ type: 'error', text: 'Semua field Orkut QRIS harus diisi' })
        setSavingQris(false)
        return
      }

      const result = await fetch('/api/settings/payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'orkut',
          username: qrisFormData.username,
          apiKey: qrisFormData.apiKey,
          token: qrisFormData.token,
          merchantId: qrisFormData.merchantId,
          codeQr: qrisFormData.codeQr,
        }),
      })

      const data = await result.json()

      if (result.ok) {
        setMessage({ type: 'success', text: 'Pengaturan Orkut QRIS berhasil disimpan!' })
        setQrisFormData({ ...qrisFormData, apiKey: '', token: '', codeQr: '' })
        fetchQrisSettings()
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan pengaturan' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan: ' + String(error) })
    } finally {
      setSavingQris(false)
    }
  }

  async function handleSubmitMidtransSettings(e: React.FormEvent) {
    e.preventDefault()
    setSavingQris(true)
    setMessage(null)

    try {
      if (!midtransFormData.clientKey || !midtransFormData.serverKey || !midtransFormData.merchantId) {
        setMessage({ type: 'error', text: 'Semua field Midtrans harus diisi' })
        setSavingQris(false)
        return
      }

      const response = await fetch('/api/settings/payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'midtrans',
          midtransClientKey: midtransFormData.clientKey,
          midtransServerKey: midtransFormData.serverKey,
          midtransMerchantId: midtransFormData.merchantId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pengaturan Midtrans berhasil disimpan!' })
        setMidtransFormData({ ...midtransFormData, clientKey: '', serverKey: '' })
        fetchQrisSettings()
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan pengaturan' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan: ' + String(error) })
    } finally {
      setSavingQris(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 bg-primary/20 rounded-xl animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-primary animate-ping" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Pembayaran</h1>
        <p className="text-muted-foreground text-sm">Konfigurasi payment gateway untuk sistem pembayaran</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-success/10 text-success border border-success/20' 
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      {qrisSettings && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="font-semibold text-sm">Payment Gateway Aktif</p>
              <p className="text-xs text-muted-foreground mt-1">
                Provider: <span className="font-mono font-bold text-success">{qrisSettings.provider?.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Provider Selection */}
      <NeoCard className="p-5">
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Pilih Payment Gateway</h3>
              <p className="text-sm text-muted-foreground">
                Pilih provider pembayaran untuk menerima pembayaran
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row mb-6">
          <button
            type="button"
            onClick={() => setPaymentProvider('orkut')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              paymentProvider === 'orkut'
                ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10'
                : 'border-border hover:border-primary/50 hover:bg-card/50'
            }`}
          >
            <p className="font-semibold text-sm">Orkut QRIS</p>
            <p className="text-xs text-muted-foreground">Provider Orkut</p>
          </button>
          <button
            type="button"
            onClick={() => setPaymentProvider('midtrans')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              paymentProvider === 'midtrans'
                ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10'
                : 'border-border hover:border-primary/50 hover:bg-card/50'
            }`}
          >
            <p className="font-semibold text-sm">Midtrans</p>
            <p className="text-xs text-muted-foreground">Payment Gateway Midtrans</p>
          </button>
        </div>
      </NeoCard>

      {/* Orkut Configuration */}
      {paymentProvider === 'orkut' && (
        <NeoCard className="p-5">
          <h3 className="font-semibold mb-4">Konfigurasi Orkut QRIS</h3>
          
          <form onSubmit={handleSubmitOrkutSettings}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Username</label>
                <NeoInput
                  placeholder="username"
                  value={qrisFormData.username}
                  onChange={(e) => setQrisFormData({ ...qrisFormData, username: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="relative">
                  <NeoInput
                    type="password"
                    placeholder="••••••••"
                    value={qrisFormData.apiKey}
                    onChange={(e) => setQrisFormData({ ...qrisFormData, apiKey: e.target.value })}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQrisApiKey(!showQrisApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showQrisApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Token</label>
                <div className="relative">
                  <NeoInput
                    type={showQrisToken ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={qrisFormData.token}
                    onChange={(e) => setQrisFormData({ ...qrisFormData, token: e.target.value })}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQrisToken(!showQrisToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showQrisToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Merchant ID</label>
                <NeoInput
                  placeholder="merchant_id"
                  value={qrisFormData.merchantId}
                  onChange={(e) => setQrisFormData({ ...qrisFormData, merchantId: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">QRIS Code String</label>
                <NeoInput
                  placeholder="QRIS code string"
                  value={qrisFormData.codeQr}
                  onChange={(e) => setQrisFormData({ ...qrisFormData, codeQr: e.target.value })}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">Kode QRIS statis dari Orkut</p>
              </div>

              <NeoButton type="submit" disabled={savingQris} className="w-full">
                <Save className="w-4 h-4" />
                {savingQris ? 'Menyimpan...' : 'Simpan Pengaturan Orkut'}
              </NeoButton>
            </div>
          </form>
        </NeoCard>
      )}

      {/* Midtrans Configuration */}
      {paymentProvider === 'midtrans' && (
        <NeoCard className="p-5">
          <h3 className="font-semibold mb-4">Konfigurasi Midtrans</h3>
          
          <form onSubmit={handleSubmitMidtransSettings}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Client Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <NeoInput
                    type="password"
                    placeholder="••••••••"
                    value={midtransFormData.clientKey}
                    onChange={(e) => setMidtransFormData({ ...midtransFormData, clientKey: e.target.value })}
                    className="pl-10 pr-11"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Server Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <NeoInput
                    type={showMidtransServerKey ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={midtransFormData.serverKey}
                    onChange={(e) => setMidtransFormData({ ...midtransFormData, serverKey: e.target.value })}
                    className="pl-10 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMidtransServerKey(!showMidtransServerKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showMidtransServerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Merchant ID</label>
                <NeoInput
                  placeholder="merchant_id"
                  value={midtransFormData.merchantId}
                  onChange={(e) => setMidtransFormData({ ...midtransFormData, merchantId: e.target.value })}
                />
              </div>

              <NeoButton type="submit" disabled={savingQris} className="w-full">
                <Save className="w-4 h-4" />
                {savingQris ? 'Menyimpan...' : 'Simpan Pengaturan Midtrans'}
              </NeoButton>
            </div>
          </form>
        </NeoCard>
      )}

      {/* Info Card */}
      <NeoCard className="p-4 bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Note:</span> Pengaturan payment gateway hanya bisa diubah oleh admin. User akan memilih metode pembayaran saat proses checkout.
        </p>
      </NeoCard>
    </div>
  )
}
