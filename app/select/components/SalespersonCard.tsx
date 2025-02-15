'use client'
import { Salesperson } from '../../types/types'

interface SalespersonCardProps {
  salesperson: Salesperson
  onSelect: (id: string) => void
}

export default function SalespersonCard({ salesperson, onSelect }: SalespersonCardProps) {
  return (
    <button
      onClick={() => onSelect(salesperson.id)}
      className="text-left bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow focus:outline-none w-full"
    >
      <div className="bg-[#00113a] rounded-t-xl p-4">
        <h2 className="text-lg font-semibold text-white">
          {salesperson.salesperson_name}
        </h2>
      </div>
      <div className="p-6">
        <div className="text-sm font-medium text-gray-600">
          Sales Count: {salesperson.sales_count}
        </div>
      </div>
    </button>
  )
}