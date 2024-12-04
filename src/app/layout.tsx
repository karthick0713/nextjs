'use client'
//import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { DataProvider } from '@/lib/context'


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// export const metadata: Metadata = {
//   title: 'Landy Insurance',
//   description: 'Landy Insurance Quote and Policy Purchase',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gray-100 bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  )
}
