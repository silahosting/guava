# Dashboard Admin Terpisah - Setup Pembayaran

## Perubahan yang Dibuat

### 1. Admin Dashboard untuk Payment Gateway (`/admin/settings`)
- **Lokasi**: `/app/admin/layout.tsx` dan `/app/admin/settings/page.tsx`
- **Fitur**:
  - ✅ Interface terpisah untuk konfigurasi payment gateway
  - ✅ Pilihan provider: Orkut QRIS atau Midtrans
  - ✅ Form untuk input credentials Orkut (Username, API Key, Token, Merchant ID, QRIS Code)
  - ✅ Form untuk input credentials Midtrans (Client Key, Server Key, Merchant ID)
  - ✅ Indikator status payment gateway aktif
  - ✅ Hanya admin yang bisa akses dan mengubah konfigurasi

### 2. User Settings - Pembersihan
- **Lokasi**: `/app/(dashboard)/dashboard/settings/page.tsx`
- **Perubahan**:
  - ❌ Dihapus: Form konfigurasi Orkut QRIS
  - ❌ Dihapus: Form konfigurasi Midtrans
  - ✅ Ditambah: Info card bahwa payment gateway dikelola oleh admin
  - ✅ User tetap punya akses ke pengaturan Bot (Telegram Bot Token, Owner ID)

### 3. Sidebar Navigation Update
- **Lokasi**: `/components/dashboard/Sidebar.tsx`
- **Perubahan**:
  - ✅ Tambahan menu item: "Pembayaran" dengan icon CreditCard
  - ✅ Link ke `/admin/settings`
  - ✅ Tersedia di semua user (admin bisa akses payment config)

### 4. Payment Method Selector Component
- **Lokasi**: `/components/payments/PaymentMethodSelector.tsx`
- **Fitur**:
  - ✅ Component untuk user memilih metode pembayaran saat checkout
  - ✅ Menampilkan provider yang aktif dari admin settings
  - ✅ Radio button selection dengan UI yang clean
  - ✅ Fetch active payment method dari API

### 5. API Endpoint Enhancement
- **Lokasi**: `/app/api/settings/payment-method/route.ts`
- **Perubahan**:
  - ✅ Tambah GET endpoint untuk fetch active payment method
  - ✅ User bisa lihat provider mana yang aktif (Orkut atau Midtrans)
  - ✅ Response hanya berisi provider dan status, tidak sensitive data

### 6. Middleware Update
- **Lokasi**: `/middleware.ts`
- **Perubahan**:
  - ✅ Tambah `/admin/:path*` ke protected routes
  - ✅ Semua route admin terlindungi dengan auth

## Workflow Penggunaan

### Admin Setup Payment Gateway
1. Admin pergi ke `/admin/settings`
2. Pilih provider: Orkut QRIS atau Midtrans
3. Input credentials sesuai provider
4. Simpan konfigurasi
5. Status menunjukkan "Payment Gateway Aktif"

### User Memilih Metode Pembayaran
1. User di halaman checkout/order
2. Melihat `<PaymentMethodSelector>`
3. Komponen fetch active payment method dari API
4. User memilih dari provider yang aktif (hanya 1 provider aktif)
5. Kirim pilihan ke API untuk proses pembayaran

## File yang Diubah/Ditambah

### Ditambah:
- `/app/admin/layout.tsx` - Admin dashboard layout
- `/app/admin/settings/page.tsx` - Payment gateway configuration
- `/components/payments/PaymentMethodSelector.tsx` - User payment method selector

### Diubah:
- `/app/(dashboard)/dashboard/settings/page.tsx` - Remove payment config, add info card
- `/components/dashboard/Sidebar.tsx` - Add admin payment link
- `/middleware.ts` - Add admin routes protection
- `/app/api/settings/payment-method/route.ts` - Add GET endpoint

## Keamanan

✅ Admin credentials hanya disimpan dan diakses di server
✅ User hanya bisa memilih dari provider yang sudah dikonfigurasi
✅ Sensitive data (Server Key, API Key) tidak pernah terkirim ke client
✅ Admin routes terlindungi middleware
✅ Server-side validation untuk semua input

## Integrasi dengan Sistem Pembayaran

Untuk mengintegrasikan dengan halaman checkout/order:
\`\`\`tsx
import { PaymentMethodSelector } from '@/components/payments/PaymentMethodSelector'

export default function CheckoutPage() {
  const handlePaymentMethodSelect = (method: 'orkut' | 'midtrans') => {
    // Proses pembayaran dengan method yang dipilih
    console.log('Selected payment method:', method)
  }

  return (
    <div>
      <PaymentMethodSelector onSelect={handlePaymentMethodSelect} />
    </div>
  )
}
\`\`\`
