'use client'
interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-[#00113a] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
    </header>
  )
}