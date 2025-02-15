'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export interface QrCodeCardProps {
  id:string
  label: string
  url: string
  initialVisible?: boolean
}

export default function QrCodeCard({ label, url, initialVisible = true }: QrCodeCardProps) {
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