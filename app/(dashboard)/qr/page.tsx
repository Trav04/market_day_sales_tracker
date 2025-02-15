'use client'
import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'

export default function QRPage() {
  const [salesperson, setSalesperson] = useState<any>(null)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const spId = Cookies.get('salesperson_id')
    if (!spId) window.location.href = '/select'

    const fetchData = async () => {
      const { data } = await supabase
        .from('sales')
        .select('*')
        .eq('id', spId)
        .single()
      setSalesperson(data)
    }
    
    fetchData()
  }, [])

  if (!salesperson) return <div>Loading...</div>

  return (
    <div>
      <h1>{salesperson.salesperson_name}'s QR Code</h1>
      <QRCodeCanvas value={`${process.env.NEXT_PUBLIC_SITE_URL}/checkout/${salesperson.id}`} />
      <p>Total Sales: {salesperson.sales_count}</p>
    </div>
  )
}