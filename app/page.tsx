import { redirect } from 'next/navigation'

export default function HomePage() {
  // Whenever the user visits the root route, redirect to /select
  redirect('/select')
}