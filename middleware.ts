import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const salespersonId = request.cookies.get('salesperson_id')?.value

  // Protect QR page
  if (path === '/qr' && !salespersonId) {
    return NextResponse.redirect(new URL('/select', request.url))
  }

  return NextResponse.next()
}