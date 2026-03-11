import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import { QueryProvider } from '@/lib/query-provider'
import { AppHeader } from '@/components/app-header'
import { BottomNav } from '@/components/bottom-nav'
import { Toaster } from 'sonner'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: 'ParkPatrol — Enforcement Companion',
  description: 'Mobile-first parking enforcement officer companion app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-[9999] focus-visible:bg-background focus-visible:text-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <AppHeader title="ParkPatrol" />
          {children}
          <BottomNav />
        </QueryProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
