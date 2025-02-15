'use client'
import { Salesperson } from '../../../types/types'

interface HeaderProps {
  salesperson: Salesperson
}

export default function Header({ salesperson }: HeaderProps) {
  return (
    <header className="bg-[#00113a] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          {salesperson.salesperson_name}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">
            Membership Sales: {salesperson.sales_count}
          </span>
        </div>
      </div>
    </header>
  )
}