'use client'
import { useRouter } from 'next/navigation'
import useSalespeople from './hooks/useSalespeople'
import Header from './components/header'
import SalespersonCard from './components/SalespersonCard'

export default function SelectPage() {
  const { salespeople, loading } = useSalespeople()
  const router = useRouter()

  const handleSelect = (id: string) => {
    document.cookie = `salesperson_id=${id}; path=/; max-age=86400` // 24h session
    router.push('/qr')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#00113a]">
      Loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header title="🏠 Select Team Member" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salespeople.map((sp) => (
            <SalespersonCard
              key={sp.id}
              salesperson={sp}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </main>
    </div>
  )
}