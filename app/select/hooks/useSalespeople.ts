'use client'
import { useEffect, useState } from 'react'
import { Salesperson } from '../../types/types'
import { supabase } from '../../utils/supabaseClient'

export default function useSalespeople() {
  const [salespeople, setSalespeople] = useState<Salesperson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalespeople = async () => {
      const { data } = await supabase
        .from('sales')
        .select('id, salesperson_name, sales_count')
      setSalespeople(data || [])
      setLoading(false)
    }

    fetchSalespeople()
  }, [])

  return { salespeople, loading }
}