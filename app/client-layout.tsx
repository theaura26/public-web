'use client'

import { ReactNode } from 'react'
import { ModeProvider } from '@/components/ModeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ModeProvider>
      <Cursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ModeProvider>
  )
}
