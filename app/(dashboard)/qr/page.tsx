'use client'
import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { createClient } from '@supabase/supabase-js'
import { Salesperson } from '../../types/types'
import Cookies from 'js-cookie'

interface QrCodeCardProps {
  label: string
  url: string
  initialVisible?: boolean
}

function QrCodeCard({ label, url, initialVisible = true }: QrCodeCardProps) {
  const [visible, setVisible] = useState(initialVisible)

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="bg-[#00113a] rounded-t-xl p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{label}</h2>
          <button
            onClick={() => setVisible(!visible)}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
          >
            {visible ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      {visible && (
        <div className="p-6">
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeCanvas 
              value={url} 
              size={256}
              bgColor="#ffffff"
              fgColor="#00113a"
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function QrCode() {
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const spId = Cookies.get('salesperson_id')
    if (!spId) window.location.href = '/select'

    const fetchSalesperson = async () => {
      const { data } = await supabase
        .from('sales')
        .select('*')
        .eq('id', spId)
        .single()

      if (data) setSalesperson(data)
    }

    fetchSalesperson()
  }, [])

  if (!salesperson) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#00113a]">
      Loading...
    </div>
  )

  const qrCodes = [
    {
      id: salesperson.id,
      label: `${salesperson.salesperson_name}'s QR Code`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/${salesperson.id}`,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#00113a] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            {salesperson.salesperson_name}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              Sales Count: {salesperson.sales_count}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <QrCodeCard key={qr.id} label={qr.label} url={qr.url} />
          ))}
        </div>
      </main>
    </div>
  )
}