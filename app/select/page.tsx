'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Salesperson } from '../types/types' 


export default function SelectPage() {
  // Use Salesperson[] instead of any[]
  const [salespeople, setSalespeople] = useState<Salesperson[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchSalespeople = async () => {
      const { data } = await supabase
        .from('sales')
        .select('id, salesperson_name, sales_count')

      setSalespeople(data || [])
    }
    fetchSalespeople()
  }, [])

  const handleSelect = (id: string) => {
    document.cookie = `salesperson_id=${id}; path=/; max-age=86400` // 24h session
    router.push('/qr')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Select Salesperson</h1>
      <div className="grid gap-4 w-full max-w-md">
        {salespeople.map((sp) => (
          <button 
            key={sp.id} 
            onClick={() => handleSelect(sp.id)}
            className="w-full px-6 py-4 bg-white rounded-lg shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <div className="text-lg font-medium text-black">{sp.salesperson_name}</div>
            <div className="text-sm text-gray-600">Sales: {sp.sales_count}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
