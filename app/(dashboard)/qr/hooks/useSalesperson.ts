'use client'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Salesperson } from '../../../types/types'
import { supabase } from '../utils/supabaseClient'

export default function useSalesperson() {
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesperson = async () => {
      const spId = Cookies.get('salesperson_id')
      if (!spId) {
        window.location.href = '/select'
        return
      }

      const { data } = await supabase
        .from('sales')
        .select('*')
        .eq('id', spId)
        .single()

      if (data) setSalesperson(data)
      setLoading(false)
    }

    fetchSalesperson()
  }, [])

  return { salesperson, loading }
}