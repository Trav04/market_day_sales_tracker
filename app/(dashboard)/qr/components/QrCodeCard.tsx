'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export interface QrCodeCardProps {
  qr_code_id: string
  id: string
  label: string
  sublabel: string
  url: string
  initialVisible?: boolean
}

export default function QrCodeCard({
  qr_code_id,
  label,
  sublabel,
  url,
  initialVisible = true,
}: QrCodeCardProps) {
  const [visible, setVisible] = useState(initialVisible)
  const [copied, setCopied] = useState(false) // State for tracking copy status

  // Create unique IDs for both the outer card and the content
  const cardContainerId = `card-${qr_code_id}`
  const contentId = `qr-code-content-${qr_code_id}`

  // Function to copy the URL to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

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
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">{label}</h2>
            <span className="text-sm text-white font-normal">{sublabel}</span>
          </div>
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
          <div className="flex flex-col gap-4">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeCanvas
                value={url}
                size={256}
                bgColor="#ffffff"
                fgColor="#00113a"
                className="rounded-lg"
              />
            </div>
            {/* Copy to Clipboard Button */}
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm font-medium text-[#00113a] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}