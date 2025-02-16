'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export interface QrCodeCardProps {
  qr_code_id: string
  id: string
  label: string
  url: string
  initialVisible?: boolean
}

export default function QrCodeCard({
  qr_code_id,
  label,
  url,
  initialVisible = true,
}: QrCodeCardProps) {
  const [visible, setVisible] = useState(initialVisible)
  // Create unique IDs for both the outer card and the content
  const cardContainerId = `card-${qr_code_id}`
  const contentId = `qr-code-content-${qr_code_id}`

  return (
    <div
      id={cardContainerId}
      // Apply a shadow only when visible; otherwise remove it so the “empty” card doesn’t look like a full card.
      className={`bg-white rounded-xl transition-shadow ${
        visible ? 'shadow-lg hover:shadow-xl' : 'shadow-none'
      }`}
    >
      <div className="bg-[#00113a] rounded-t-xl p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{label}</h2>
          <button
            onClick={() => setVisible(!visible)}
            // Point to the unique content container
            aria-controls={contentId}
            aria-expanded={visible}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
          >
            {visible ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      {visible && (
        <div id={contentId} className="p-6">
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
