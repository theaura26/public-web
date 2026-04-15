'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ModeProvider } from '@/components/ModeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'

const BARE_ROUTES = ['/art']

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const bare = BARE_ROUTES.includes(pathname)

  return (
    <ModeProvider>
      <Cursor />
      {!bare && <Navbar />}
      <main>{children}</main>
      {!bare && <Footer />}
    </ModeProvider>
  )
}
