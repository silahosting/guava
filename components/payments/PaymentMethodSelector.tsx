'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Loader } from 'lucide-react'
import { NeoButton } from '@/components/ui/neo-button'
import type { QrisSettings } from '@/types'

interface PaymentMethodSelectorProps {
  onSelect: (method: 'orkut' | 'midtrans') => void
  disabled?: boolean
}

export function PaymentMethodSelector({ onSelect, disabled = false }: PaymentMethodSelectorProps) {
  const [qrisSettings, setQrisSettings] = useState<QrisSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState<'orkut' | 'midtrans' | null>(null)

  useEffect(() => {
    fetchPaymentSettings()
  }, [])

  async function fetchPaymentSettings() {
    try {
      const res = await fetch('/api/settings/payment-method')
      if (res.ok) {
        const data = await res.json()
        setQrisSettings(data.settings)
        setSelectedMethod(data.settings.provider)
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!qrisSettings) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
        <p className="text-sm">Metode pembayaran belum dikonfigurasi. Hubungi admin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5" />
        <h3 className="font-semibold">Pilih Metode Pembayaran</h3>
      </div>

      {qrisSettings.provider === 'orkut' && (
        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMethod === 'orkut'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => {
            setSelectedMethod('orkut')
            onSelect('orkut')
          }}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment-method"
              value="orkut"
              checked={selectedMethod === 'orkut'}
              onChange={() => {
                setSelectedMethod('orkut')
                onSelect('orkut')
              }}
              disabled={disabled}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <div>
              <p className="font-semibold text-sm">Orkut QRIS</p>
              <p className="text-xs text-muted-foreground">Pembayaran via QRIS Orkut</p>
            </div>
          </div>
        </div>
      )}

      {qrisSettings.provider === 'midtrans' && (
        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMethod === 'midtrans'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => {
            setSelectedMethod('midtrans')
            onSelect('midtrans')
          }}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment-method"
              value="midtrans"
              checked={selectedMethod === 'midtrans'}
              onChange={() => {
                setSelectedMethod('midtrans')
                onSelect('midtrans')
              }}
              disabled={disabled}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <div>
              <p className="font-semibold text-sm">Midtrans</p>
              <p className="text-xs text-muted-foreground">Pembayaran via Midtrans</p>
            </div>
          </div>
        </div>
      )}

      {qrisSettings.provider && (
        <p className="text-xs text-muted-foreground text-center py-2">
          {selectedMethod === 'orkut' && 'Anda akan menerima QR Code untuk melakukan pembayaran'}
          {selectedMethod === 'midtrans' && 'Anda akan diarahkan ke halaman pembayaran Midtrans'}
        </p>
      )}
    </div>
  )
}
