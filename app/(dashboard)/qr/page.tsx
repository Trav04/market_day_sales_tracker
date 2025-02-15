'use client'
import { useEffect, useState, useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { createClient } from '@supabase/supabase-js'
import { Salesperson } from '../../types/types' 
import Cookies from 'js-cookie'

export default function QRPage() {
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null)
  
  // Memoize the Supabase client to avoid recreating it on every render.
  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  useEffect(() => {
    const spId = Cookies.get('salesperson_id')
    if (!spId) {
      window.location.href = '/select'
      return
    }

    const fetchData = async () => {
      const { data } = await supabase
        .from('sales')
        .select('*')
        .eq('id', spId)
        .single()

      if (data) {
        setSalesperson(data)
      }
    }
    
    fetchData()
  }, [supabase])

  if (!salesperson) return <div>Loading...</div>

  return (
    <div>
    <h1>{salesperson.salesperson_name}&apos;s QR Code</h1>
      <QRCodeCanvas 
        value={`${process.env.NEXT_PUBLIC_SITE_URL!}/checkout/${salesperson.id}`} 
      />
      <p>Total Sales: {salesperson.sales_count}</p>
    </div>
  )
}
