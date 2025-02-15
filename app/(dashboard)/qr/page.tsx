'use client'
import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { createClient } from '@supabase/supabase-js'
import { Salesperson } from '../../types/types'
import Cookies from 'js-cookie'



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

  if (!salesperson) return <div>Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">
        {salesperson.salesperson_name}&apos;s QR Code
      </h1>
      <QRCodeCanvas
        value={`${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/${salesperson.id}`}
        size={256}
        className="mb-4"
      />
      <p className="text-xl">
        Total Sales: {salesperson.sales_count}
      </p>
    </div>
  )
}