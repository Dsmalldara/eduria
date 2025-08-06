'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to onboarding by default
    // In a real app, you'd check if user is authenticated/onboarded
    router.push('/onboarding')
  }, [router])

  return <div>Loading...</div>
}