'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { REFRESH_MS } from '@/lib/living-index/contract'
import Link from 'next/link'
export default function Unavailable() {
  const router = useRouter()
  useEffect(() => { const id = setInterval(() => router.refresh(),REFRESH_MS);return () => clearInterval(id) },[router])
  return <div className="section-w" style={{paddingTop:'calc(var(--nav-h) + 80px)',paddingBottom:80}}>
    <h1>Living Index</h1><p>The herd’s live record is temporarily unavailable. Please try again in a few minutes.</p>
    <Link href="/living-index/cows">Try the herd index again</Link>
  </div>
}
