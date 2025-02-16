'use client'
import useSalesperson from './hooks/useSalesperson'
import Header from './components/Header'
import QrCodeCard, { QrCodeCardProps } from './components/QrCodeCard'
import Link from 'next/link' // Import the Link component

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
      sublabel: `Scan to become a UQIES member!`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/${salesperson!.id}`,
      initialVisible: true // Starts expanded
    },
    {
      qr_code_id: `SICHackathon`,
      id: salesperson!.id,
      label: `SIC Hackathon`,
      sublabel: `Use coupon MARKETDAY $10 OFF`,
      url: `https://lu.ma/mhds7ghc`,
      initialVisible: false // Starts collapsed
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header salesperson={salesperson!} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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

      {/* Persistent Back Button */}
      <div className="sticky bottom-0 left-0 bg-white border-t border-gray-200 p-4">
        <Link 
          href="/select" // Redirects to app/select/page.tsx
          className="px-6 py-2 text-sm font-medium text-white bg-[#00113a] hover:bg-[#00113a]/90 rounded-lg transition-colors"
        >
          ⬅ Back
        </Link>
      </div>
    </div>
  )
}