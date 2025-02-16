'use client'
import useSalesperson from './hooks/useSalesperson'
import Header from './components/Header'
import QrCodeCard, { QrCodeCardProps } from './components/QrCodeCard'

export default function QrCode() {
  const { salesperson, loading } = useSalesperson()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#00113a]">
      Loading...
    </div>
  )
const qrCodes: QrCodeCardProps[] = [
    {
      qr_code_id: `2025Membership`,
      id: salesperson!.id,
      label: `UQIES $2 Membership`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/${salesperson!.id}`,
      initialVisible: true // Starts expanded
    },
    {
      qr_code_id: `1`,
      id: salesperson!.id,
      label: `SIC Hackathon`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/premium/${salesperson!.id}`,
      initialVisible: false // Starts collapsed
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header salesperson={salesperson!} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <QrCodeCard 
              key={qr.qr_code_id}
              {...qr}
              // Each card maintains its own state independently
            />
          ))}
        </div>
      </main>
    </div>
  )
}